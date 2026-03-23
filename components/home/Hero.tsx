import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Parallax Video Background */}
      <motion.div style={{ y, scale }} className="absolute inset-0 h-full w-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1920&q=80"
          className="h-full w-full object-cover"
        >
          {/* Fashion Footwear Walk - Alternative Source */}
          <source src="https://cdn.pixabay.com/video/2019/05/29/24036-339232938_large.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Content - Pure Visual Interaction Layer */}
      <motion.div
        onClick={() => navigate('/products')}
        className="absolute inset-0 z-10 cursor-none group"
        whileHover="hover"
      >
        {/* Custom Magnetic Cursor Follower (Simulated with centered overlay for simplicity in this context, 
             or we can do a real mouse follower if requested. For now, using a center focus effect) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            variants={{
              hover: { scale: 1.5, opacity: 1 },
              initial: { scale: 0.5, opacity: 0 }
            }}
            initial="initial"
            className="w-24 h-24 rounded-full border border-white/50 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}