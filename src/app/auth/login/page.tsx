// src/app/auth/login/page.tsx

'use client';

import FarmerLoginForm from '@/components/FarmerLoginForm';
import AccountTypeModal from '@/components/modals/AccountTypeModal';
import { useState } from 'react';
import { motion } from 'framer-motion';
import FloatingHeader from '@/components/FloatingHeader';

export default function LoginPage() {
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <FarmerLoginForm />
      <FloatingHeader />
      
    </div>
  );
}