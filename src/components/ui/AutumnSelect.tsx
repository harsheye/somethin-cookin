'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';

interface AutumnSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  label: string;
}

const AutumnSelect = ({ value, onChange, options, placeholder, label }: AutumnSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <label className="block text-lg font-serif font-bold text-amber-800 mb-2">
        {label}
      </label>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 text-left text-sm font-medium text-amber-900 border-2 border-orange-100 
                 rounded-lg focus:border-orange-300 focus:ring-2 focus:ring-orange-200
                 bg-orange-50/50 hover:bg-orange-100/50 transition-colors flex items-center justify-between"
      >
        <span className={selectedOption ? '' : 'text-amber-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-amber-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border-2 border-orange-100 overflow-hidden"
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                whileHover={{ backgroundColor: 'rgba(251, 146, 60, 0.1)' }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  value === option.value 
                    ? 'bg-orange-100 text-amber-900 font-medium' 
                    : 'text-amber-800'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutumnSelect; 