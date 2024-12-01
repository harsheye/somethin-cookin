'use client';

import React, { useState } from 'react';
import OTPInput from '@/components/OTPInput';
import { useRouter } from 'next/navigation';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send OTP to email
    setStep(2);
  };

  const handleOtpComplete = (completedOtp: string) => {
    setOtp(completedOtp);
    // TODO: Verify OTP
    setStep(3);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit user details and complete signup
    console.log('Signup complete', { email, otp, ...userDetails });
    router.push('/marketplace');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-lg mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Send OTP
            </button>
          </form>
        )}
        {step === 2 && (
          <div>
            <p className="mb-4 text-center">Enter the OTP sent to your email</p>
            <OTPInput onComplete={handleOtpComplete} />
          </div>
        )}
        {step === 3 && (
          <form onSubmit={handleDetailsSubmit}>
            <input
              type="text"
              value={userDetails.name}
              onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded-lg mb-4"
              required
            />
            <input
              type="password"
              value={userDetails.password}
              onChange={(e) => setUserDetails({...userDetails, password: e.target.value})}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-lg mb-4"
              required
            />
            <input
              type="password"
              value={userDetails.confirmPassword}
              onChange={(e) => setUserDetails({...userDetails, confirmPassword: e.target.value})}
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border rounded-lg mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Complete Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
