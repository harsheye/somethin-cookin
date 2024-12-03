'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'farmer' 
}) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');

      if (!token || userRole !== requiredRole) {
        toast.error('Please login to access this page');
        router.push('/unauthorized');
        return false;
      }
      return true;
    };

    const isAuth = checkAuth();
    setIsAuthorized(isAuth);
  }, [router, requiredRole]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 