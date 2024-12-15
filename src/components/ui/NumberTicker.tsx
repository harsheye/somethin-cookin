'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface NumberTickerProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

const NumberTicker = ({ value, prefix = '', suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const springValue = useSpring(0, {
    stiffness: 30,
    damping: 10,
    mass: 1
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  const displayValue = useTransform(springValue, (latest) => 
    Math.round(latest).toLocaleString()
  );

  return (
    <div ref={ref} className="flex items-center justify-center font-bold">
      <motion.span className="flex items-baseline">
        {prefix && <span className="mr-1">{prefix}</span>}
        <motion.span>{displayValue}</motion.span>
        {suffix && <span className="ml-1">{suffix}</span>}
      </motion.span>
    </div>
  );
};

export default NumberTicker; 