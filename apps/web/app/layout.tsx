import type { Metadata } from 'next';
import Link from 'next/link';
import { Outfit } from 'next/font/google';
import { Toaster } from 'sonner';
import { Footer } from '@/_components/marketing';
import { ShrinkingLogo } from '@/_components/shrinking-logo';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://weavecash.com'),
  title: 'Weave Cash - Accept Any Crypto. Store Your Value.',
  description:
    'Buyer pays in any coin. Receive your preferred coin. Instantly, via NEAR Intents.',
  openGraph: {
    siteName: 'Weave Cash',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <div className="bg-white dark:bg-slate-950">
          <div className="fixed top-0 z-50 w-full">
            <div className="bg-blue-600 px-4 py-2 text-center text-xs text-white sm:text-sm dark:bg-blue-500">
              No sign-in, no fee crypto invoices.{' '}
              <a
                href="https://github.com/AryanJ-NYC/weave-cash"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:underline"
              >
                Open source
              </a>
            </div>
            <nav className="w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-lg dark:border-slate-800/50 dark:bg-slate-950/80">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 transition-all duration-300 md:px-6">
                <Link href="/">
                  <ShrinkingLogo />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href="/create"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Create Invoice
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          <main className="pt-32">{children}</main>
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

type RootLayoutProps = {
  children: React.ReactNode;
};
