'use client';

import "./globals.css";
import Footer from '@/components/Footer';
import { Header } from '@/components/ui/Header/index';
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth/');
  const isMarketplace = pathname?.startsWith('/marketplace');

  return (
    <html lang="en">
      <body className={inter.className}>
        {!isAuthPage && !isMarketplace && <Header isLoggedIn={false} onLogout={() => {}} />}
        <main className="flex-grow mt-4">{children}</main>
        <Footer />
      </body>
    </html>
  )
}