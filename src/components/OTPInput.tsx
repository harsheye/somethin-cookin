import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  onComplete: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ onComplete }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  useEffect(() => {
    if (otp.every(v => v !== '')) {
      onComplete(otp.join(''));
    }
  }, [otp, onComplete]);

  return (
    <div className="flex justify-center items-center space-x-2">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          ref={el => inputs.current[index] = el}
          maxLength={1}
          value={data}
          onChange={e => handleChange(e.target, index)}
          onFocus={e => e.target.select()}
          className="w-12 h-12 border-2 rounded-lg text-center text-xl font-bold focus:border-green-500 focus:outline-none transition-all duration-300"
        />
      ))}
    </div>
  );
};

export default OTPInput;
