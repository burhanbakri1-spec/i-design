import { categories, categorySubItems } from '@/data/projects';
import CategoryPage from '@/components/CategoryPage';
import Link from 'next/link';

export function generateStaticParams() {
  const params: { slug: string; sub: string }[] = [];
  for (const [cat, subs] of Object.entries(categorySubItems)) {
    for (const sub of subs) {
      params.push({ slug: cat.toLowerCase(), sub: sub.toLowerCase() });
    }
  }
  return params;
}

function Sidebar() {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 pl-4 md:pl-6">
      <ul className="space-y-1">
        {categories.map((cat) => {
          const subs = categorySubItems[cat] || [];
          return (
            <li key={cat}>
              <Link
                href={`/projects/${cat.toLowerCase()}`}
                className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors"
              >
                {cat}
              </Link>
              {subs.length > 0 && (
                <ul className="pl-3 mt-0.5 space-y-0.5">
                  {subs.map((sub) => (
                    <li key={sub}>
                      <Link
                        href={`/projects/${cat.toLowerCase()}/${sub.toLowerCase()}`}
                        className="text-[9px] sm:text-[10px] tracking-[0.1em] uppercase text-black/30 hover:text-black transition-colors"
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function SubCategoryPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const { slug, sub } = await params;
  const category = (slug || '').toUpperCase();
  const subParam = sub || '';
  const items = categorySubItems[category] || [];
  const match = items.find((item) => item.toLowerCase() === subParam);
  const subCategory = match || subParam;

  return (
    <div>
      {category === 'ARCHITECTURE' && <Sidebar />}
      <CategoryPage key={subParam} category={category} subCategory={subCategory} />
    </div>
  );
}
