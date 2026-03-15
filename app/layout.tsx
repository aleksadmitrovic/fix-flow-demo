import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import TopNav from '@/components/NavbarComponents/TopNav';

export const metadata: Metadata = {
  title: 'Fix Flow App',
  description: 'App about fix services',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopNav />
          <main className=" bg-gray-100  vertical-center">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
