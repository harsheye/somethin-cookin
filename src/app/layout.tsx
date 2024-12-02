'use client';

import "./globals.css";
import Footer from '@/components/Footer';
import { Header } from '@/components/ui/Header/index';
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { FaSeedling, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

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
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            className: '!bg-white !shadow-lg !rounded-xl !px-4 !py-3',
            style: {
              background: 'white',
              color: '#374151',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
            },
            success: {
              icon: <FaCheckCircle className="text-green-500 text-xl" />,
              style: {
                background: 'rgba(167, 243, 208, 0.2)',
                border: '1px solid #6EE7B7',
              },
            },
            error: {
              icon: <FaExclamationCircle className="text-red-500 text-xl" />,
              style: {
                background: 'rgba(254, 202, 202, 0.2)',
                border: '1px solid #FECACA',
              },
            },
            loading: {
              icon: <div className="flex items-center">
                <FaSeedling className="text-green-600 text-xl animate-bounce" />
                <FaSpinner className="text-green-600 text-xl animate-spin ml-2" />
              </div>,
              style: {
                background: 'rgba(167, 243, 208, 0.1)',
                border: '1px solid #D1FAE5',
              },
            },
          }}
        />
      </body>
    </html>
  )
}