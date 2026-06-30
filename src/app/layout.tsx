import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import IntroAnimation from '@/components/IntroAnimation';

export const metadata: Metadata = {
  title: 'i DESIGN | Architecture that shapes behavior',
  description: 'i DESIGN is an architectural practice dedicated to creating spaces that shape behavior and inspire human interaction.',
  keywords: ['architecture', 'design', 'i DESIGN', 'interior design', 'sustainable architecture'],
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <IntroAnimation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
