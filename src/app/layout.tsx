'use client';

import "./globals.css";
import Footer from '@/components/ui/Footer';
import { Header } from '@/components/ui/Header/index';
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/contexts/CartContext';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth/');

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {!isAuthPage && <Header />}
          <main className="flex-grow mt-4">{children}</main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}