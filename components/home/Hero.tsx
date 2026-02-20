import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-gray-100">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/fario-ecommerce-app/fario-brand.mp4" type="video/mp4" />
      </video>

      {/* Content - Pure Visual (No Text) */}
      <div
        onClick={() => navigate('/products')}
        className="absolute inset-0 z-10 cursor-pointer group"
      >
        {/* Subtle hover hint */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      </div>
    </div>
  );
}