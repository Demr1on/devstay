'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface BookingButtonProps {
  href?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  animate?: boolean;
}

export default function BookingButton({
  href = '/booking',
  children,
  size = 'md',
  variant = 'primary',
  className = '',
  onClick,
  disabled = false,
  animate = false
}: BookingButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-300 shadow-lg hover:shadow-xl
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-500 to-purple-600 text-white
      hover:from-blue-600 hover:to-purple-700
      focus:ring-4 focus:ring-blue-300
    `,
    outline: `
      border-2 border-blue-500 text-blue-600 bg-transparent
      hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 
      hover:text-white hover:border-transparent
      focus:ring-4 focus:ring-blue-300
    `
  };

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const ButtonContent = () => (
    <span className="flex items-center space-x-2">
      {children}
      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </span>
  );

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={buttonClasses}
        initial={animate ? { opacity: 0, y: 20 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={animate ? { duration: 0.6, ease: "easeOut" } : undefined}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <ButtonContent />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={animate ? { duration: 0.6, ease: "easeOut" } : undefined}
    >
      <Link
        href={href}
        className={buttonClasses}
      >
        <ButtonContent />
      </Link>
    </motion.div>
  );
} 