import './globals.css';
import { Geist } from 'next/font/google';
import { Toaster } from 'sonner';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'Weave Cash',
  description: 'Weave your finances together',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

type RootLayoutProps = {
  children: React.ReactNode;
};
