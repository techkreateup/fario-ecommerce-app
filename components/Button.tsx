import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  type = 'button',
  disabled = false
}) => {
  const baseStyles = "px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-fario-purple text-white hover:bg-opacity-90 shadow-lg hover:shadow-fario-purple/50",
    secondary: "bg-fario-dark text-white hover:bg-gray-800 shadow-lg",
    outline: "border-2 border-fario-dark text-fario-dark hover:bg-fario-dark hover:text-white"
  };

  // Cast to any to bypass missing prop errors in specific environment
  const MotionButton = (motion as any).button;

  return (
    <MotionButton
      type={type}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </MotionButton>
  );
};

export default Button;