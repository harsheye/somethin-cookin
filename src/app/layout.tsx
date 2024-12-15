'use client';

import "./globals.css";
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/contexts/CartContext';
import { FaTractor, FaShoppingCart, FaCheck } from 'react-icons/fa';

// Dynamically import components with fallback
const Header = dynamic(
  () => import('@/components/ui/Header/index'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-16 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }
);

const Footer = dynamic(
  () => import('@/components/ui/Footer'),
  {
    ssr: false,
    loading: () => (
      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="animate-pulse h-6 w-full bg-gray-200 rounded"></div>
        </div>
      </footer>
    )
  }
);

const inter = Inter({ subsets: ['latin'] });

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
          <main>{children}</main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}