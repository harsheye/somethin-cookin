'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { motion } from 'framer-motion';
import { FaCalendar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";

interface AutumnCalendarProps {
  selected: Date;
  onChange: (date: Date) => void;
  label: string;
}

const AutumnCalendar = ({ selected, onChange, label }: AutumnCalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-lg font-serif font-bold text-amber-800 mb-2">
        {label}
      </label>
      <div className="calendar-input-wrapper">
        <DatePicker
          selected={selected}
          onChange={(date) => {
            onChange(date as Date);
            setIsOpen(false);
          }}
          onClickOutside={() => setIsOpen(false)}
          open={isOpen}
          onInputClick={() => setIsOpen(true)}
          dateFormat="MMMM d, yyyy"
          minDate={new Date()}
          className="w-full p-3 text-sm font-medium text-amber-900 border-2 border-orange-100 
                   rounded-lg focus:border-orange-300 focus:ring-2 focus:ring-orange-200
                   bg-orange-50/50 placeholder-amber-400"
          calendarClassName="autumn-calendar"
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-orange-400 to-amber-500">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="text-white p-1 rounded-full hover:bg-white/10 disabled:opacity-50"
              >
                <FaChevronLeft />
              </motion.button>
              <h2 className="text-lg font-serif font-bold text-white">
                {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="text-white p-1 rounded-full hover:bg-white/10 disabled:opacity-50"
              >
                <FaChevronRight />
              </motion.button>
            </div>
          )}
        />
        <FaCalendar className="calendar-icon absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
      </div>
    </div>
  );
};

export default AutumnCalendar; 