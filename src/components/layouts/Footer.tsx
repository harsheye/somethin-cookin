'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLeaf, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: 'rgb(0,98,65)' }}>
      {/* Multiple Blobs for better effect */}
      <Blob className="w-[40rem] h-[40rem] -bottom-20 -right-20" delay={0} />
      <Blob className="w-[35rem] h-[35rem] -top-20 -left-20" delay={0.2} />
      <Blob className="w-[30rem] h-[30rem] top-1/2 left-1/3" delay={0.4} />

      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />

      {/* Rest of your footer content with z-10 to appear above grid */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {/* Logo & Description */}
            <div className="col-span-1 md:col-span-2">
              <motion.div 
                className="flex items-center gap-2 mb-6"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <FaLeaf className="text-white text-2xl" />
                </div>
                <span className="text-3xl font-bold text-white font-serif">Codebase</span>
              </motion.div>
              <p className="text-white/80 max-w-md text-sm leading-relaxed">
                Empowering farmers through technology. Creating sustainable connections between producers and consumers, fostering a more efficient and transparent agricultural ecosystem.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-3">
                {['Marketplace', 'Trades', 'About'].map((item) => (
                  <motion.li key={item} whileHover={{ x: 3 }}>
                    <Link href={`/${item.toLowerCase()}`} className="text-white/70 hover:text-white transition-colors">
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-4 text-lg">Connect</h3>
              <div className="flex gap-4">
                {[FaGithub, FaTwitter, FaLinkedin].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ y: -3 }}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Icon className="text-white text-xl" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/60 text-sm">
                &copy; {new Date().getFullYear()} Codebase. All rights reserved.
              </p>
              <div className="flex gap-6">
                {['Privacy Policy', 'Terms of Service'].map((item) => (
                  <Link key={item} href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 