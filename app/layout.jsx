import { Suspense } from 'react';
import { Nav, NavLinks } from '@/components/Nav';
import './globals.css';

export const metadata = {
  title: { default: 'Current UFC Champs', template: '%s · UFC Champs' },
  description: 'Who are the current UFC champions, and what is the next UFC event?',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white font-sans antialiased">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 lg:py-10">
          <Suspense fallback={<NavLinks />}>
            <Nav />
          </Suspense>
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 border-t border-black/80 pt-6 text-center font-mono text-sm">
      <span>Content is property of UFC, for educational purposes only.</span>
      <span>
        Created by{' '}
        <a href="https://markfehrenbach.dev" target="_blank" rel="noopener" className="underline decoration-white/50 hover:decoration-white">
          markfehrenbach.dev
        </a>{' '}
        using Next.js, React, Motion, and Tailwind.
      </span>
    </footer>
  );
}
