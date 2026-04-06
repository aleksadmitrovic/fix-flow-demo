import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import TopNav from '@/components/NavbarComponents/TopNav';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>
        <Providers>
          <TopNav />
          <main className=" bg-gray-100  vertical-center">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
