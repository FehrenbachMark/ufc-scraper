import Image from 'next/image';

/** The dark card both pages are built from: a centered header, then titled sections of rows. */
export function Panel({ eyebrow, title, children }) {
  return (
    <section className="w-full rounded-xl bg-black/60 p-4 lg:p-6">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">{eyebrow}</p>
        <h1 className="text-2xl font-bold text-balance wrap-break-word lg:text-4xl">{title}</h1>
      </header>
      {children}
    </section>
  );
}

export function PanelSection({ title, children }) {
  return (
    <div className="mt-6">
      <h2 className="mb-2 border-b border-white/20 pb-1 text-lg font-semibold text-slate-200">{title}</h2>
      <ul className="divide-y divide-white/10">{children}</ul>
    </div>
  );
}

const tints = { red: 'bg-red-900/40', blue: 'bg-blue-900/40', gold: 'bg-amber-900/30' };

/**
 * Fixed-size portrait crop, so rows line up whether or not an image exists.
 * Pass a wider `sizes` for landscape sources, which get scaled up to fill the height.
 */
export function Headshot({ src, tint, sizes = '48px', className = '' }) {
  return (
    <div className={`relative h-16 w-12 shrink-0 overflow-hidden rounded ${tints[tint]} ${className}`}>
      {src && <Image src={src} alt="" fill sizes={sizes} className="object-cover object-top" />}
    </div>
  );
}
