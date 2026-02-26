import React from 'react';
import { ASSETS } from '../constants';

interface LogoProps {
  className?: string;
  size?: number | string;
  white?: boolean;
}

/**
 * FARIO Brand Logo
 * Renders the official brand mark directly from ASSETS.
 * Added 'white' prop to ensure the logo is rendered in pure white via CSS filters
 * without modifying the underlying asset.
 */
const Logo: React.FC<LogoProps> = ({ className = "", size = 40, white = false }) => {
  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-300 ${className}`} 
      style={{ 
        width: size, 
        height: size,
        filter: white ? 'brightness(0) invert(1)' : 'none'
      }}
    >
      <img 
        src={ASSETS.logo} 
        alt="FARIO" 
        className="w-full h-full object-contain" 
      />
    </div>
  );
};

export default Logo;