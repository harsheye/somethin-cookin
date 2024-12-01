'use client';

import React from 'react';
import LoginForm from '@/components/LoginForm';
import { useRouter } from 'next/navigation';

const CustomerLoginPage: React.FC = () => {
  const router = useRouter();

  const handleLogin = async (username: string, password: string, rememberMe: boolean) => {
    try {
      const response = await fetch('https://onlinesbii.live/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const { token, userRole } = data;

      // Store token in both localStorage and sessionStorage
      localStorage.setItem('token', token);
      sessionStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      sessionStorage.setItem('userRole', userRole);

      // Redirect based on user role
      if (userRole === 'farmer') {
        router.push('/farmer-dashboard');
      } else {
        router.push('/marketplace');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} userType="customer" />
    </div>
  );
};

export default CustomerLoginPage;
