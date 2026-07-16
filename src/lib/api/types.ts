export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiErrorBody {
  success?: false;
  statusCode?: number;
  message?: string | string[];
  errors?: unknown[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: Pagination;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryTreeItem extends Category {
  children: CategoryTreeItem[];
}

export interface ProjectMedia {
  id: string;
  url: string;
  mediaType?: string;
  caption: string | null;
  altText: string | null;
  width: number | null;
  height: number | null;
  sortOrder?: number;
  isCover?: boolean;
}

export interface ProjectListItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  description?: string | null;
  city: string | null;
  country: string | null;
  year: number | null;
  client?: string | null;
  status?: string;
  sizeM2?: string | number | null;
  sizeFt2?: string | number | null;
  coverImage: string | null;
  featured?: boolean;
  published?: boolean;
  publishedAt?: string | null;
  categories?: Category[];
  media?: ProjectMedia[];
}

export interface ProjectDetails extends ProjectListItem {
  description: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  gallery?: ProjectMedia[];
  relatedProjects?: ProjectListItem[];
  people?: Person[];
  awards?: {
    id: string;
    title: string;
    organization: string | null;
    year: number | null;
    description: string | null;
  }[];
  partners?: Partner[];
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  externalUrl?: string | null;
  published?: boolean;
  featured?: boolean;
  publishedAt: string | null;
  createdAt?: string;
}

export interface NewsDetails extends NewsItem {
  content: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface Office {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  address: string | null;
  phone?: string | null;
  email?: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
  description: string | null;
  image: string | null;
  published?: boolean;
  sortOrder?: number;
}

export interface OfficeDetails extends Office {
  people?: Person[];
}

export interface Person {
  id: string;
  name: string;
  slug: string;
  jobTitle: string | null;
  biography: string | null;
  email?: string | null;
  phone?: string | null;
  image: string | null;
  sortOrder?: number;
  office?: Pick<Office, 'id' | 'name' | 'slug' | 'city'> | null;
  projects?: ProjectListItem[];
  role?: string | null;
}

export type PersonDetails = Person;

export interface Partner {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  logo: string | null;
  description?: string | null;
  role?: string | null;
  sortOrder?: number;
}

export interface SearchResults {
  query: string;
  projects: ProjectListItem[];
  news: NewsItem[];
  people: Person[];
  offices: Office[];
  partners: Partner[];
  totals: {
    projects: number;
    news: number;
    people: number;
    offices: number;
    partners: number;
  };
}

export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}
