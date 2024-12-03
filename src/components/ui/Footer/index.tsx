'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FaFacebook, FaTwitter, FaInstagram, 
  FaLinkedin, FaHeart, FaShieldAlt 
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <img 
              src="/swastik-logo.png" 
              alt="Swastik" 
              className="h-8 w-auto mb-4"
            />
            <p className="text-gray-500 text-sm">
              Connecting farmers directly with customers for a sustainable agricultural future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/marketplace" className="text-gray-500 hover:text-green-600 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/trades" className="text-gray-500 hover:text-green-600 transition-colors">
                  Trade
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-green-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-green-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal & Documentation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/legal/terms" className="text-gray-500 hover:text-green-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-gray-500 hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/returns" className="text-gray-500 hover:text-green-600 transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/shipping" className="text-gray-500 hover:text-green-600 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/routes-map" 
                  className="text-gray-500 hover:text-green-600 transition-colors"
                >
                  Routes Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ y: -2 }}
                href="#"
                className="text-gray-400 hover:text-blue-500"
              >
                <FaFacebook className="text-xl" />
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="#"
                className="text-gray-400 hover:text-blue-400"
              >
                <FaTwitter className="text-xl" />
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="#"
                className="text-gray-400 hover:text-pink-500"
              >
                <FaInstagram className="text-xl" />
              </motion.a>
              <motion.a
                whileHover={{ y: -2 }}
                href="#"
                className="text-gray-400 hover:text-blue-700"
              >
                <FaLinkedin className="text-xl" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} Swastik. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <p className="text-gray-500 text-sm flex items-center">
                Made with <FaHeart className="text-red-500 mx-1" /> in India
              </p>
              <span className="mx-2 text-gray-300">|</span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center text-gray-500 text-sm"
              >
                <FaShieldAlt className="mr-1" /> Secure Payments
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 