// src/app/auth/farmer/login/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import FarmerLogin from '@/components/FarmerLoginForm';// Make sure this component exists

export default function FarmerLoginPage() {
  return <FarmerLogin />;
}