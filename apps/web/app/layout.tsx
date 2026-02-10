import './globals.css';
import { Outfit } from 'next/font/google';
import { Toaster } from 'sonner';
import { Footer } from '@/components/marketing';

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
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

type RootLayoutProps = {
  children: React.ReactNode;
};
