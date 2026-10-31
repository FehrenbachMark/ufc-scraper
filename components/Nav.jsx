'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['/', 'Champions'],
  ['/next-event', 'Next Event'],
];

// usePathname suspends while prerendering routes with unknown params (like
// /fighter/[slug]), so render this inside <Suspense fallback={<NavLinks />}>.
export function Nav() {
  return <NavLinks activePath={usePathname()} />;
}

export function NavLinks({ activePath = null }) {
  return (
    <nav className="flex justify-center gap-2 font-semibold">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={activePath === href ? 'page' : undefined}
          className="rounded-full px-4 py-1.5 text-slate-300 hover:bg-white/10 hover:text-white aria-[current=page]:bg-red-600 aria-[current=page]:text-white"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
