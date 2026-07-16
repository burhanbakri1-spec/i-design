import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white px-4 pt-[143px] text-center">
      <p className="mb-6 text-xs uppercase tracking-[0.2em] text-black/40">Page not found</p>
      <Link href="/" className="text-xs uppercase tracking-[0.2em] text-black hover:text-black/50">
        Back to projects
      </Link>
    </div>
  );
}
