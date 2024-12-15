import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  ShoppingBag, 
  Store, 
  RefreshCcw, 
  User, 
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

const Sidebar = ({ isOpen, onClose, userRole = 'farmer' }: SidebarProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    router.push('/auth/login');
    onClose();
  };

  const farmerLinks = [
    { href: '/farmer/dashboard', label: 'Dashboard', icon: Home },
    { href: '/farmer/products', label: 'Products', icon: ShoppingBag },
    { href: '/farmer/trades', label: 'Trades', icon: RefreshCcw },
    { href: '/farmer/market', label: 'Market', icon: Store },
  ];

  const buyerLinks = [
    { href: '/buyer/dashboard', label: 'Dashboard', icon: Home },
    { href: '/buyer/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/market', label: 'Market', icon: Store },
  ];

  const links = userRole === 'farmer' ? farmerLinks : buyerLinks;

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 pt-8 border-t">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/help"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Help & Support</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar; 