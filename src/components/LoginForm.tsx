import React, { useState } from 'react';
import { FaUser, FaLock, FaPlay, FaUserPlus } from 'react-icons/fa';
import Link from 'next/link';

interface LoginFormProps {
  onSubmit: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  userType: 'customer' | 'farmer';
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, userType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(username, password, rememberMe);
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-green-600 p-8 rounded-3xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">{userType === 'farmer' ? 'Farmer' : 'Customer'} Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-6">
          <label htmlFor="username" className="block text-white text-sm font-semibold mb-2">
            <FaUser className="inline mr-2" />
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border-b-2 border-white text-white placeholder-white::placeholder focus:outline-none focus:border-yellow-400 transition duration-300"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-white text-sm font-semibold mb-2">
            <FaLock className="inline mr-2" />
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border-b-2 border-white text-white placeholder-white::placeholder focus:outline-none focus:border-yellow-400 transition duration-300"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="remember" className="text-white text-sm">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-white text-sm hover:text-yellow-400 transition duration-300">
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-400 text-green-800 py-2 px-4 rounded-full font-semibold hover:bg-yellow-500 transition duration-300 flex items-center justify-center"
        >
          <FaPlay className="mr-2" />
          Login
        </button>
        <div className="mt-4 text-center">
          <Link 
            href={userType === 'farmer' ? '/auth/farmer/signup' : `/auth/${userType}/signup`} 
            className="text-white text-sm hover:text-yellow-400 transition duration-300 flex items-center justify-center"
          >
            <FaUserPlus className="mr-2" />
            Don't have an account? Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
