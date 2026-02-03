import './globals.css';
import { Geist } from 'next/font/google';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'SettleCrypto',
  description: 'Settle debts with crypto',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}

type RootLayoutProps = {
  children: React.ReactNode;
};
