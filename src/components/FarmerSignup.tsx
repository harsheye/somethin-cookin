import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCamera, FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import logoSvg from '../app/logo.svg';

interface FarmerRegistrationData {
  username: string;
  password: string;
  email: string;
  mobileNo: string;
  name: string;
  pincode: string;
  userRole: 'farmer';
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  selfieUrl: string;
}

const FarmerSignup: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    mobileNo: '',
    name: '',
    pincode: '',
    street: '',
    city: '',
    state: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSentTime, setEmailSentTime] = useState<Date | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emailSentTime) {
      timer = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - emailSentTime.getTime();
        if (diff >= 120000) { // 2 minutes
          setEmailSentTime(null);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emailSentTime]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please make sure you have given camera permissions.');
    }
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setSelfie(dataUrl);
        stopCamera();
      }
    }
  };

  const uploadSelfie = async () => {
    if (!selfie) return;
    try {
      const response = await fetch(selfie);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('selfie', blob, 'selfie.jpg');

      const uploadResponse = await fetch('http://localhost:5009/api/upload/farmer-selfie', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload selfie');
      }

      const data = await uploadResponse.json();
      setSelfieUrl(data.selfieUrl);
      setSuccessMessage('Selfie uploaded successfully!');
      setStep(2);
    } catch (error) {
      console.error('Error uploading selfie:', error);
      setError('Failed to upload selfie. Please try again.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendVerificationCode = async () => {
    setIsEmailSending(true);
    setError('');
    try {
      const response = await fetch('https://onlinesbii.live/api/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }
      const data = await response.json();
      console.log('Verification code:', data.code); // In a real app, remove this console.log
      setEmailSentTime(new Date());
      setStep(3);
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsEmailSending(false);
    }
  };

  const verifyCode = () => {
    // In a real app, you would send this code to your backend for verification
    console.log('Verifying code:', verificationCode);
    setStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selfieUrl) {
      setError('Please capture a selfie before proceeding');
      return;
    }

    try {
      const registerData: FarmerRegistrationData = {
        ...formData,
        userRole: 'farmer',
        selfieUrl: selfieUrl,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.pincode,
        },
      };

      const response = await fetch('http://localhost:5009/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      setSuccessMessage('Registration successful!');
      setTimeout(() => {
        router.push('/auth/farmer/login');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    }
  };

  const getResendTimeLeft = () => {
    if (!emailSentTime) return 0;
    const now = new Date();
    const diff = 120000 - (now.getTime() - emailSentTime.getTime());
    return Math.max(0, Math.floor(diff / 1000));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Image
            className="mx-auto h-12 w-auto"
            src={logoSvg}
            alt="Tawarja Logo"
            width={48}
            height={48}
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your farmer account
          </h2>
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}
        {step === 1 && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Capture Selfie</h3>
            <div className="mb-6">
              {selfie ? (
                <img src={selfie} alt="Selfie preview" className="mx-auto w-96 h-72 object-cover rounded-lg border-2 border-gray-300" />
              ) : (
                <div className="relative mx-auto w-96 h-72 rounded-lg overflow-hidden border-2 border-gray-300">
                  <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" width="640" height="480" />
                </div>
              )}
            </div>
            {!isCameraActive && !selfie && (
              <button
                onClick={startCamera}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg text-lg mb-4 hover:bg-blue-600 transition duration-300"
              >
                Start Camera
              </button>
            )}
            {isCameraActive && !selfie && (
              <button
                onClick={captureSelfie}
                className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg hover:bg-green-600 transition duration-300"
              >
                Take Picture
              </button>
            )}
            {selfie && (
              <>
                <button
                  onClick={() => {
                    setSelfie(null);
                    setSelfieUrl(null);
                    startCamera();
                  }}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg text-lg mr-4 hover:bg-red-600 transition duration-300"
                >
                  Retake Picture
                </button>
                <button
                  onClick={uploadSelfie}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg hover:bg-green-600 transition duration-300"
                >
                  Upload Selfie
                </button>
              </>
            )}
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Enter Email</h3>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              onClick={sendVerificationCode}
              disabled={isEmailSending || !!emailSentTime}
              className={`w-full bg-blue-500 text-white py-2 rounded-lg text-lg mb-4 ${
                (isEmailSending || !!emailSentTime) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              } transition duration-300`}
            >
              {isEmailSending ? 'Sending...' : emailSentTime ? `Resend in ${getResendTimeLeft()}s` : 'Send Verification Code'}
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Verify Email</h3>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              onClick={verifyCode}
              className="w-full bg-green-500 text-white py-2 rounded-lg text-lg hover:bg-green-600 transition duration-300"
            >
              Verify Code
            </button>
          </div>
        )}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Complete Registration</h3>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
              placeholder="Mobile Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              placeholder="Pincode"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="Street"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="State"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Country"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition duration-300"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FarmerSignup;
