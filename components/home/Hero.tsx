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

      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content - Bottom Left Alignment (Cai Store Style) */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-white drop-shadow-lg"
        >
          <h2 className="text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-4 pl-1">
            New Collection 2026
          </h2>
          <h1 className="text-5xl md:text-7xl font-sans font-light tracking-tight leading-none mb-8">
            Effortless <br /> <span className="font-bold">Sophistication.</span>
          </h1>

          <button
            onClick={() => navigate('/products')}
            className="group relative px-8 py-3 bg-white text-black text-sm font-bold tracking-widest uppercase transition-all hover:bg-black hover:text-white"
          >
            Shop Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}