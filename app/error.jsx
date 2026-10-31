'use client';

export default function ErrorPage({ retry }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">Couldn't load data from UFC.com</h1>
      <p className="text-slate-400">The site may be down, or its page layout may have changed.</p>
      <button onClick={retry} className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-500">
        Try again
      </button>
    </main>
  );
}
