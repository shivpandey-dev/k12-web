import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { ThemeRegistry } from '@/theme/theme-registry';
import './globals.css';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: { default: 'KidzDiary', template: '%s | KidzDiary' },
  description: 'School information management for KidzDiary schools.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
