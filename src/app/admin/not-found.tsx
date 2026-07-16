import Link from 'next/link';

export default function AdminNotFoundPage() {
  return (
    <section className="max-w-xl rounded border border-black/10 bg-white p-8">
      <h1 className="text-2xl uppercase tracking-[0.12em]">Not found</h1>
      <p className="mt-4 text-black/60">The admin page or record could not be found.</p>
      <Link href="/admin" className="mt-8 inline-block border border-black px-4 py-2 text-xs uppercase tracking-[0.16em]">
        Back to dashboard
      </Link>
    </section>
  );
}
