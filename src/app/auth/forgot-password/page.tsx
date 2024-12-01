'use client';

import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import OTPInput from '@/components/OTPInput';

const ForgotPasswordPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://onlinesbii.live/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        setOtpSent(true);
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    try {
      // Implement OTP verification logic here
      console.log('Verifying OTP:', otp);
      // If OTP is verified, redirect to reset password page
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Failed to verify OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!otpSent ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                <FaEnvelope className="inline mr-2" />
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <div>
            <p className="mb-4 text-center">Enter the OTP sent to your email</p>
            <OTPInput onComplete={setOtp} />
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 mt-4"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
