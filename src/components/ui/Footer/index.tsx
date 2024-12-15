'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CircularBlob = ({ className }: { className: string }) => (
  <div className={`absolute ${className}`}>
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        fill="#A7F0BA"
        d="M100,0 C155.228,0 200,44.772 200,100 C200,155.228 155.228,200 100,200 C44.772,200 0,155.228 0,100 C0,44.772 44.772,0 100,0 Z"
        opacity="0.1"
      />
    </svg>
  </div>
);

const Footer = () => {
  return (
    <footer 
      className="relative overflow-hidden mt-auto" 
      style={{ 
        backgroundColor: 'rgb(0,98,65)',
        marginBottom: '-1px'
      }}
    >
      {/* Fixed Circular Blobs */}
      <CircularBlob className="w-[70rem] h-[70rem] -right-[35rem] -bottom-[35rem] pointer-events-none" />
      <CircularBlob className="w-[70rem] h-[70rem] -left-[35rem] -top-[35rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-4">
            <motion.div 
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 5 }}
            >
              <Image
                src="/swastik-logo.png"
                alt="Swastik Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className="text-3xl font-bold text-white font-serif">Swastik</span>
            </motion.div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Empowering farmers through technology. Creating sustainable connections between producers and consumers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Marketplace', 'Trades', 'About'].map((item) => (
                <motion.li key={item} whileHover={{ x: 3 }}>
                  <Link href={`/${item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors">
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-3">
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 3 }} className="flex items-center gap-3 text-white/70">
                <FaMapMarkerAlt className="text-green-400 flex-shrink-0" />
                <a 
                  href="https://maps.google.com/?q=28.6139,77.2090" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  123 Farmer's Market, Delhi, India
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} className="flex items-center gap-3 text-white/70">
                <FaPhone className="text-green-400 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-white transition-colors">
                  +91 123 456 7890
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} className="flex items-center gap-3 text-white/70">
                <FaEnvelope className="text-green-400 flex-shrink-0" />
                <a href="mailto:info@swastik.com" className="hover:text-white transition-colors">
                  info@swastik.com
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Map */}
          <div className="md:col-span-3">
            <h3 className="text-white font-bold mb-4">Find Us</h3>
            <div className="rounded-lg overflow-hidden border border-white/10 h-[200px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.1598092909274!2d77.2068113!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjIiTiA3N8KwMTInMjQuNSJF!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              &copy; {new Date().getFullYear()} Swastik. All rights reserved.
            </p>
            <div className="flex gap-4">
              {[FaGithub, FaTwitter, FaLinkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon className="text-white text-xl" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 