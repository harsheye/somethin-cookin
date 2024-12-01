'use client';

import React from 'react';
import { Header } from '@/components/ui/Header';
import FarmerOrders from '@/components/FarmerOrders';

const FarmerOrdersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header isLoggedIn={true} onLogout={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Your Orders</h1>
        <FarmerOrders />
      </main>
    </div>
  );
};

export default FarmerOrdersPage;
