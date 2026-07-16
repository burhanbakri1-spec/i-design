import { getProjectDetail } from '@/data/projectDetails';
import { projects, type Project as LegacyProject } from '@/data/projects';

export type ProjectStatus = 'CONCEPT' | 'DESIGN' | 'UNDER_CONSTRUCTION' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';

export type CreateProjectDto = {
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  city?: string;
  country?: string;
  year?: number;
  client?: string;
  status?: ProjectStatus;
  sizeM2?: number;
  sizeFt2?: number;
  seoTitle?: string;
  seoDescription?: string;
  categoryIds?: string[];
  featured?: boolean;
};

export type CategoryLike = {
  id: string;
  name?: string;
  slug?: string;
};

export type ExistingProjectLike = {
  id: string;
  title?: string;
  slug?: string;
};

export type LegacyImportStatus = 'Ready' | 'New' | 'Already imported' | 'Possible duplicate' | 'Invalid data';

export type LegacyProjectImportRow = {
  legacyId: string;
  title: string;
  slug: string;
  location: string;
  year: string;
  category: string;
  imageCount: number;
  status: LegacyImportStatus;
  existingProject?: ExistingProjectLike;
  duplicateProject?: ExistingProjectLike;
  payload: CreateProjectDto;
  missingCategories: { name: string; slug: string }[];
  validationErrors: string[];
  mediaPending: string[];
  missingPeople: string[];
  missingPartners: string[];
  awards: { title: string; year?: number; organization?: string; description?: string }[];
};

export const legacyProjects = projects;

const statusMap: Record<string, ProjectStatus> = {
  completed: 'COMPLETED',
  complete: 'COMPLETED',
  built: 'COMPLETED',
  construction: 'UNDER_CONSTRUCTION',
  design: 'DESIGN',
  concept: 'CONCEPT',
  hold: 'ON_HOLD',
  cancelled: 'CANCELLED',
  canceled: 'CANCELLED',
};

const categoryAliases: Record<string, string> = {
  architecture: 'architecture',
  interiors: 'interior',
  interior: 'interior',
  landscape: 'landscape',
  planning: 'planning',
  products: 'product-design',
  product: 'product-design',
  cultural: 'culture',
  culture: 'culture',
  consumerproducts: 'consumer-products',
  'consumer-products': 'consumer-products',
  civicspaces: 'civic-spaces',
  'civic-spaces': 'civic-spaces',
  balconiesandterraces: 'balconies-terraces',
  'balconies-terraces': 'balconies-terraces',
};

function cleanText(value?: string | null) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

export function slugifyLegacy(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function canonicalSlug(value: string) {
  const slug = slugifyLegacy(value).replace(/-and-/g, '-');
  const compact = slug.replace(/-/g, '');
  return categoryAliases[slug] ?? categoryAliases[compact] ?? slug;
}

function parseYear(value: string) {
  if (!/^\d{4}$/.test(value.trim())) return undefined;
  return Number(value);
}

function parseStatus(value: string): ProjectStatus {
  const normalized = value.toLowerCase();
  const key = Object.keys(statusMap).find((item) => normalized.includes(item));
  return key ? statusMap[key] : 'CONCEPT';
}

function parseSize(value: string) {
  const [m2, ft2] = value
    .split('/')
    .map((part) => Number(part.replace(/[^0-9.]/g, '')))
    .map((number) => (Number.isFinite(number) && number > 0 ? number : undefined));

  return { sizeM2: m2, sizeFt2: ft2 };
}

function parseLocation(value: string) {
  const [city, ...countryParts] = value.split(',').map((part) => part.trim()).filter(Boolean);
  return {
    city: cleanText(city),
    country: cleanText(countryParts.join(', ')),
  };
}

function isSafePublicImage(value: string) {
  return /^https?:\/\//i.test(value) && !/^[a-z]:\\/i.test(value) && !value.includes('\\');
}

function normalizeName(value?: string) {
  return cleanText(value)?.toLowerCase();
}

function findExistingCategory(slug: string, categories: CategoryLike[]) {
  return categories.find((category) => canonicalSlug(category.slug || category.name || '') === slug);
}

function findExistingProject(project: LegacyProject, slug: string, existingProjects: ExistingProjectLike[]) {
  const bySlug = existingProjects.find((item) => item.slug && item.slug.toLowerCase() === slug);
  if (bySlug) return { existingProject: bySlug, duplicateProject: undefined };

  const title = normalizeName(project.title);
  const byTitle = existingProjects.find((item) => title && normalizeName(item.title) === title);
  return { existingProject: undefined, duplicateProject: byTitle };
}

export function mapLegacyProject(
  project: LegacyProject,
  categories: CategoryLike[],
  existingProjects: ExistingProjectLike[] = [],
): LegacyProjectImportRow {
  const detail = getProjectDetail(project.id, project);
  const slug = slugifyLegacy(project.id || project.title);
  const validationErrors: string[] = [];
  const categorySlugs = [canonicalSlug(project.category), canonicalSlug(project.subCategory)].filter(Boolean);
  const categoryMatches = categorySlugs
    .map((categorySlug) => ({ slug: categorySlug, category: findExistingCategory(categorySlug, categories) }))
    .filter((item, index, all) => all.findIndex((candidate) => candidate.slug === item.slug) === index);
  const categoryIds = categoryMatches.map((item) => item.category?.id).filter((id): id is string => Boolean(id));
  const missingCategories = categoryMatches
    .filter((item) => !item.category)
    .map((item) => ({ name: item.slug.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' '), slug: item.slug }));
  const year = parseYear(project.year);
  const location = parseLocation(project.location);
  const size = parseSize(detail.size);
  const { existingProject, duplicateProject } = findExistingProject(project, slug, existingProjects);
  const mediaPending = [project.image, ...project.images].filter((image, index, all) => image && all.indexOf(image) === index && isSafePublicImage(image));

  if (!cleanText(project.title)) validationErrors.push('Missing title');
  if (!slug || slugifyLegacy(slug) !== slug) validationErrors.push('Invalid URL-safe slug');
  if (project.year && year === undefined) validationErrors.push('Invalid year');
  if (categoryIds.length === 0) validationErrors.push('No matching category');

  const payload: CreateProjectDto = {
    title: project.title.trim(),
    slug,
    shortDescription: cleanText(project.description),
    description: cleanText(project.description),
    city: location.city,
    country: location.country,
    year,
    client: cleanText(detail.client),
    status: parseStatus(detail.status),
    sizeM2: size.sizeM2,
    sizeFt2: size.sizeFt2,
    seoTitle: cleanText(project.title),
    seoDescription: cleanText(project.description),
    categoryIds,
    featured: false,
  };

  Object.keys(payload).forEach((key) => {
    if (payload[key as keyof CreateProjectDto] === undefined) delete payload[key as keyof CreateProjectDto];
  });

  const status: LegacyImportStatus = validationErrors.length || missingCategories.length
    ? 'Invalid data'
    : existingProject
      ? 'Already imported'
      : duplicateProject
        ? 'Possible duplicate'
        : 'Ready';

  return {
    legacyId: project.id,
    title: project.title,
    slug,
    location: project.location,
    year: project.year,
    category: [project.category, project.subCategory].filter(Boolean).join(' / '),
    imageCount: mediaPending.length,
    status,
    existingProject,
    duplicateProject,
    payload,
    missingCategories,
    validationErrors,
    mediaPending,
    missingPeople: detail.team.flatMap((group) => group.members).filter((member, index, all) => all.indexOf(member) === index),
    missingPartners: [],
    awards: [],
  };
}

export function buildLegacyProjectRows(categories: CategoryLike[], existingProjects: ExistingProjectLike[] = []) {
  return projects.map((project) => mapLegacyProject(project, categories, existingProjects));
}
