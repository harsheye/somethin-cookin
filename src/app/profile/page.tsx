'use client';

import React from 'react';
import UserProfile from '@/components/UserProfile';
import { useRouter } from 'next/navigation';

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <UserProfile onLogout={handleLogout} />
    </div>
  );
};

export default ProfilePage;
