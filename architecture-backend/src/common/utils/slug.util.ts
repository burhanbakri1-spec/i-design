import slugify from 'slugify';

export function createBaseSlug(value: string, fallbackPrefix = 'item') {
  const slug = slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });

  if (slug.length > 0) {
    return slug;
  }

  const fallback = Math.random().toString(36).slice(2, 10);
  return `${fallbackPrefix}-${fallback}`;
}
