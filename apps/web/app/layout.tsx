import './globals.css';
import { Outfit } from 'next/font/google';
import { Toaster } from 'sonner';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Weave Cash - Accept Crypto. Settle in Your Currency.',
  description:
    'Let customers pay with any crypto. You receive the currency you choose—instantly, via NEAR intents.',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

type RootLayoutProps = {
  children: React.ReactNode;
};
