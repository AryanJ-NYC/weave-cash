import Link from 'next/link';
import { Outfit } from 'next/font/google';
import { Toaster } from 'sonner';
import { Footer } from '@/components/marketing';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Weave Cash - Accept Any Crypto. Receive Yours.',
  description:
    'Customers pay with whatever they have. You get your preferred crypto—instantly, via NEAR intents.',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <div className="bg-white dark:bg-slate-950">
          <nav className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-lg dark:border-slate-800/50 dark:bg-slate-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Weave<span className="text-blue-600 dark:text-blue-500">Cash</span>
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

          <main className="pt-16">{children}</main>
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
