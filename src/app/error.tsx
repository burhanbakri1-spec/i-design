'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white px-4 pt-[143px] text-center">
      <p className="mb-6 text-xs uppercase tracking-[0.2em] text-black/40">
        Something went wrong
      </p>
      <button
        onClick={reset}
        className="text-xs uppercase tracking-[0.2em] text-black transition-colors hover:text-black/50"
      >
        Try again
      </button>
    </div>
  );
}
