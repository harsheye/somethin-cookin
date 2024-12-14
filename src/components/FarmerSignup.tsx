'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheck, FaSeedling } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import FloatingHeader from '@/components/FloatingHeader';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  mobileNo: string;
  whatsappNo: string;
  alternativeMobile?: string;
  name: string;
  pincode: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

const FarmerSignup: React.FC = () => {
  const router = useRouter();
  const MAX_STEPS = 5;
  const [step, setStep] = useState<number>(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [mobileOTP, setMobileOTP] = useState('');
  const [isMobileOTPSent, setIsMobileOTPSent] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  const [smsTimer, setSmsTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    mobileNo: '',
    whatsappNo: '',
    alternativeMobile: '',
    name: '',
    pincode: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });

  const steps = [
    {
      title: "Email Verification",
      description: "Verify your email to get started",
      icon: FaEnvelope
    },
    {
      title: "Personal Details",
      description: "Basic information about you",
      icon: FaUser
    },
    {
      title: "Security",
      description: "Set up your account security",
      icon: FaLock
    },
    {
      title: "Contact Info",
      description: "Your contact information",
      icon: FaPhone
    },
    {
      title: "Address",
      description: "Your location details",
      icon: FaMapMarkerAlt
    }
  ];

  const getCurrentStepTitle = () => {
    if (step < 1 || step > steps.length) {
      return "Registration";  // Default title
    }
    return steps[step - 1].title;
  };

  useEffect(() => {
    const savedProgress = localStorage.getItem('farmerSignupProgress');
    if (savedProgress) {
      try {
        const { savedStep, savedFormData } = JSON.parse(savedProgress);
        if (savedStep >= 1 && savedStep <= MAX_STEPS) {
          setStep(savedStep);
          setFormData(savedFormData);
        } else {
          localStorage.removeItem('farmerSignupProgress');
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
        localStorage.removeItem('farmerSignupProgress');
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (step === 1 && !formData.email && !formData.mobileNo) {
        return;
      }
      
      const progressData = {
        savedStep: step,
        savedFormData: formData
      };
      console.log('Saving progress:', progressData); // Debug log
      localStorage.setItem('farmerSignupProgress', JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [step, formData]); // Run whenever step or formData changes

  const clearSavedProgress = () => {
    try {
      localStorage.removeItem('farmerSignupProgress');
      console.log('Progress cleared from localStorage'); // Debug log
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      toast.loading('Resending verification code...', { id: 'resend' });

      const response = await fetch('http://localhost:5009/api/send-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code');
      }

      toast.success('New verification code sent!', { id: 'resend' });
      startEmailTimer();
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend code', { id: 'resend' });
      setError(error.message || 'Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      toast.loading('Verifying code...', { id: 'verify' });

      const response = await fetch('http://localhost:5009/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid verification code');
      }

      toast.success('Email verified successfully!', { id: 'verify' });
      setStep(2);
    } catch (error: any) {
      toast.error(error.message || 'Verification failed', { id: 'verify' });
      setError(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMobileOTP = async () => {
    try {
      const response = await fetch('http://localhost:5009/api/send-mobile-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNo: formData.mobileNo }),
      });

      if (!response.ok) {
        throw new Error('Failed to send mobile OTP');
      }

      setIsMobileOTPSent(true);
    } catch (error) {
      setError('Failed to send mobile OTP. Please try again.');
    }
  };

  const handleVerifyMobileOTP = async () => {
    try {
      const response = await fetch('http://localhost:5009/api/verify-mobile-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNo: formData.mobileNo,
          otp: mobileOTP
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid mobile OTP');
      }

      setIsMobileVerified(true);
      setStep(2); // Move to next step after verification
    } catch (error) {
      setError('Invalid mobile OTP. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < MAX_STEPS) {
      setStep(prev => Math.min(prev + 1, MAX_STEPS));
      return;
    }
    
    try {
      // Show registration started notification
      toast.loading(
        <div className="flex items-center space-x-2">
          <span>Planting your account...</span>
        </div>,
        { id: 'registration' }
      );
      
      // Validate fields...
      if (!formData.email || !formData.password || !formData.name || 
          !formData.mobileNo || !formData.address.street || !formData.address.city || 
          !formData.address.state || !formData.address.country || !formData.address.zipCode) {
        toast.error(
          <div className="flex flex-col">
            <span className="font-medium">Missing Fields</span>
            <span className="text-sm">Please fill in all required information</span>
          </div>,
          { id: 'registration' }
        );
        setError('Please fill in all required fields');
        return;
      }

      // Properly structure the data for API
      const registrationData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        mobileNo: formData.mobileNo,
        name: formData.name,
        pincode: formData.pincode,
        userRole: 'farmer',
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          country: formData.address.country,
          zipCode: formData.address.zipCode
        }
      };

      const response = await fetch('http://localhost:5009/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      // Show success notification with redirect message
      toast.success(
        <div className="flex flex-col">
          <span className="font-medium">Welcome to Swastik!</span>
          <span className="text-sm">Your farming journey begins now</span>
          <span className="text-sm mt-1">Redirecting to login in 4 seconds...</span>
        </div>,
        {
          id: 'registration',
          duration: 4000,
          icon: <FaSeedling className="text-green-600 text-xl" />
        }
      );

      // Clear saved progress
      clearSavedProgress();

      // Wait for 4 seconds before redirecting
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Redirect to login
      router.push('/auth/farmer/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(
        <div className="flex flex-col">
          <span className="font-medium">Registration Failed</span>
          <span className="text-sm">{error.message || 'Please try again'}</span>
        </div>,
        { id: 'registration' }
      );
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  const goToNextStep = () => {
    setStep(prev => Math.min(prev + 1, MAX_STEPS));
  };

  const goToPreviousStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step > 1) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step]);

  const startEmailTimer = () => {
    setEmailTimer(30);
    const timer = setInterval(() => {
      setEmailTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startSmsTimer = () => {
    setSmsTimer(30);
    const timer = setInterval(() => {
      setSmsTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    
    // If email is valid, send OTP automatically
    if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      try {
        const response = await fetch('http://localhost:5009/api/send-verification-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setEmailSent(true);
          startEmailTimer();
        }
      } catch (error) {
        setError('Failed to send email verification code');
      }
    }
  };

  const handleMobileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const mobileNo = e.target.value;
    setFormData(prev => ({ ...prev, mobileNo }));
    
    // If mobile number is valid (10 digits), send OTP automatically
    if (mobileNo.match(/^\d{10}$/)) {
      try {
        const response = await fetch('http://localhost:5009/api/send-mobile-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobileNo }),
        });

        if (response.ok) {
          setIsMobileOTPSent(true);
          startSmsTimer();
        }
      } catch (error) {
        setError('Failed to send mobile verification code');
      }
    }
  };

  const handleSendBothOTPs = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Show loading notification
      toast.loading(
        <div className="flex items-center space-x-2">
          <span>Sending verification code...</span>
        </div>,
        { id: 'verification' }
      );

      // Validate email and mobile number
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        toast.error(
          <div className="flex flex-col">
            <span className="font-medium">Invalid Email</span>
            <span className="text-sm">Please enter a valid email address</span>
          </div>,
          { id: 'verification' }
        );
        return;
      }

      // Send email verification
      const emailResponse = await fetch('http://localhost:5009/api/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        throw new Error(emailData.error || 'Failed to send verification code');
      }

      // Show success notification
      toast.success(
        <div className="flex flex-col">
          <span className="font-medium">Verification Code Sent!</span>
          <span className="text-sm">Please check your email</span>
        </div>,
        { id: 'verification' }
      );

      // Start timer and show OTP fields
      startEmailTimer();
      setEmailSent(true);

    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(
        <div className="flex flex-col">
          <span className="font-medium">Verification Failed</span>
          <span className="text-sm">{error.message || 'Please try again'}</span>
        </div>,
        { id: 'verification' }
      );
      setError(error.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyBothOTPs = async () => {
    try {
      setError('');
      setIsLoading(true);

      // Verify both OTPs in parallel
      const [emailVerifyResponse, smsVerifyResponse] = await Promise.all([
        fetch('http://localhost:5009/api/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            code: verificationCode
          })
        }),
        fetch('http://localhost:5009/api/verify-mobile-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mobileNo: formData.mobileNo,
            otp: mobileOTP
          })
        })
      ]);

      if (!emailVerifyResponse.ok || !smsVerifyResponse.ok) {
        throw new Error('Invalid verification code(s)');
      }

      // Both verifications successful, move to next step
      setStep(2);
    } catch (error: any) {
      setError(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to prevent going back if email is verified
  const handleBack = () => {
    if (step === 1 || (step === 2 && emailSent)) {
      return; // Don't allow going back from email verification
    }
    goToPreviousStep();
  };

  const handleSendVerificationCode = async () => {
    // Generate a 4-digit OTP locally
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOTP(otp); // Store it in state to display
    setEmailSent(true);
    startEmailTimer();
    toast.success('Verification code generated');
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Information Side - Now on the left */}
        <div className="bg-white p-6 rounded-xl shadow-lg max-h-[800px] overflow-y-auto">
          <h2 className="text-3xl font-bold text-green-700 mb-8">Join Our Farming Community</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-semibold mb-2">Why Register with Us?</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  Direct access to market your agricultural products
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  Better prices for your produce
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  Connect with buyers directly
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  Secure payment system
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  24/7 support system
                </li>
              </ul>
            </div>

            {/* Progress Steps */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Registration Progress</h3>
              <div className="space-y-4">
                {steps.map((s, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      step > index ? 'bg-green-100 text-green-700' : 
                      step === index ? 'bg-green-50 border border-green-200' : 
                      'bg-gray-50'
                    }`}
                  >
                    <s.icon className={`text-xl ${step > index ? 'text-green-500' : 'text-gray-400'}`} />
                    <div>
                      <h4 className="font-medium">{s.title}</h4>
                      <p className="text-sm text-gray-500">{s.description}</p>
                    </div>
                    {step > index && <FaCheck className="ml-auto text-green-500" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Side - Now on the right */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-center mb-6">
            <img 
              src="/swastik-logo.png" 
              alt="Swastik Logo" 
              className="h-20 w-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            {getCurrentStepTitle()}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <AnimatePresence mode='wait'>
            {step === 1 && (
              <motion.form
                key="verification-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  {/* Email Input and OTP Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute top-3 left-3 text-green-500" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* Mobile Number Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute top-3 left-3 text-green-500" />
                        <input
                          type="tel"
                          name="mobileNo"
                          placeholder="Enter mobile number"
                          value={formData.mobileNo}
                          onChange={(e) => setFormData(prev => ({ ...prev, mobileNo: e.target.value }))}
                          className="pl-10 w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                          pattern="[0-9]{10}"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    {/* Send Verification Button */}
                    {!emailSent && (
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        disabled={!formData.email || !formData.mobileNo || formData.mobileNo.length !== 10}
                        className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
                      >
                        Generate Verification Code
                      </button>
                    )}

                    {/* Display generated OTP and verification input */}
                    {emailSent && (
                      <div className="mt-4">
                        <div className="bg-green-50 p-3 rounded-lg mb-3">
                          <p className="text-green-700">Your verification code is: <span className="font-bold">{generatedOTP}</span></p>
                          <p className="text-sm text-green-600 mt-1">
                            Use this code to verify both your email and mobile number
                          </p>
                        </div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Enter Verification Code
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter 4-digit code"
                            className="flex-1 p-2 border border-green-200 rounded-lg"
                            maxLength={4}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (verificationCode === generatedOTP) {
                              toast.success('Email and mobile verification successful!');
                              setStep(2);
                            } else {
                              toast.error('Invalid verification code');
                            }
                          }}
                          disabled={!verificationCode || verificationCode.length !== 4}
                          className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
                        >
                          Verify & Continue
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.form>
            )}

            {/* Personal Details Step */}
            {step === 2 && (
              <motion.form
                key="personal-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-4"
              >
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Add more form fields for personal details */}
                
                <div className="col-span-2 flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Next
                  </button>
                </div>
              </motion.form>
            )}

            {/* Security Step */}
            {step === 3 && (
              <motion.form
                key="security-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute top-3 left-3 text-green-500" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      className="pl-10 w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute top-3 left-3 text-green-500" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm password"
                      className="pl-10 w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-sm">Passwords do not match</p>
                )}

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={formData.password !== formData.confirmPassword}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-gray-700">Password Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <FaCheck className={`${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                      At least 8 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheck className={`${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      Contains uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheck className={`${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      Contains number
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheck className={`${/[!@#$%^&*]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                      Contains special character
                    </li>
                  </ul>
                </div>
              </motion.form>
            )}

            {/* Contact Info Step */}
            {step === 4 && (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number (Alternative)
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute top-3 left-3 text-green-500" />
                    <input
                      type="tel"
                      name="alternativeMobile"
                      placeholder="Alternative mobile number (optional)"
                      className="pl-10 w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute top-3 left-3 text-green-500" />
                    <input
                      type="tel"
                      name="whatsappNo"
                      value={formData.mobileNo} // Default to primary mobile
                      onChange={(e) => setFormData({ ...formData, whatsappNo: e.target.value })}
                      className="pl-10 w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="mt-2">
                    <label className="flex items-center text-sm text-gray-600">
                      <input
                        type="checkbox"
                        className="mr-2"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, whatsappNo: formData.mobileNo });
                          }
                        }}
                      />
                      Same as primary mobile number
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute top-3 left-3 text-green-500" />
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="Enter pincode"
                      className="pl-10 w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      pattern="[0-9]{6}"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Next
                  </button>
                </div>
              </motion.form>
            )}

            {/* Address Details Step */}
            {step === 5 && (
              <motion.form
                key="address-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute top-3 left-3 text-green-500" />
                    <input
                      type="text"
                      name="street"
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value }
                      })}
                      placeholder="Enter street address"
                      className="pl-10 w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value }
                      })}
                      placeholder="Enter city"
                      className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value }
                      })}
                      placeholder="Enter state"
                      className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.address.country}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, country: e.target.value }
                      })}
                      placeholder="Enter country"
                      className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, zipCode: e.target.value }
                      })}
                      placeholder="Enter ZIP code"
                      className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                      pattern="[0-9]{6}"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Complete Registration
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
      <FloatingHeader />
    </div>
  );
};

export default FarmerSignup;