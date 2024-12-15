'use client';

import { motion } from 'framer-motion';

interface BlobProps {
  className?: string;
  color?: string;
  delay?: number;
}

const Blob = ({ className = '', color = '#A7F0BA', delay = 0 }: BlobProps) => {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.1 }}
      transition={{ duration: 2, delay }}
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <motion.path
          fill={color}
          d="M51.9,-33.2C68.1,-21.1,82.6,0.6,76.5,13.5C70.4,26.4,43.6,30.6,21.5,39.1C-0.6,47.6,-17.9,60.4,-31.4,57C-45,53.7,-54.8,34.2,-58.9,14C-63.1,-6.1,-61.5,-27,-50.8,-37.9C-40,-48.7,-20,-49.6,-1.1,-48.8C17.8,-47.9,35.7,-45.3,51.9,-33.2Z"
          transform="translate(100 100)"
          animate={{
            d: [
              "M51.9,-33.2C68.1,-21.1,82.6,0.6,76.5,13.5C70.4,26.4,43.6,30.6,21.5,39.1C-0.6,47.6,-17.9,60.4,-31.4,57C-45,53.7,-54.8,34.2,-58.9,14C-63.1,-6.1,-61.5,-27,-50.8,-37.9C-40,-48.7,-20,-49.6,-1.1,-48.8C17.8,-47.9,35.7,-45.3,51.9,-33.2Z",
              "M63.3,-51.1C78.1,-31.8,83.7,-5.7,78.8,18.8C73.8,43.3,58.4,66.3,37.1,76.2C15.8,86.1,-11.4,83.1,-34.4,71.8C-57.3,60.6,-76.1,41.1,-81.4,18.4C-86.7,-4.2,-78.5,-30.2,-62.7,-49.7C-46.9,-69.2,-23.4,-82.3,0.4,-82.6C24.2,-82.9,48.4,-70.4,63.3,-51.1Z"
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </svg>
    </motion.div>
  );
};

export default Blob; 