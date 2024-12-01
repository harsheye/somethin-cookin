import React, { useState } from 'react';
import { FaUser, FaLock, FaPlay } from 'react-icons/fa';
import Link from 'next/link';

interface FarmerLoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
}

const FarmerLoginForm: React.FC<FarmerLoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(username, password);
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-green-600 p-8 rounded-3xl shadow-lg w-96">
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
        <button
          type="submit"
          className="w-full bg-yellow-400 text-green-800 py-2 px-4 rounded-full font-semibold hover:bg-yellow-500 transition duration-300 flex items-center justify-center"
        >
          <FaPlay className="mr-2" />
          Login
        </button>
        <div className="mt-4 text-center">
          <Link href="/auth/farmer/signup" className="text-white text-sm hover:text-yellow-400 transition duration-300">
            Don't have an account? Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default FarmerLoginForm;
