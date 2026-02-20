import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 opacity-60">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          poster="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
        >
          <source
            src="/fario-ecommerce-app/fario-brand.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="mb-4 text-sm font-bold tracking-[0.3em] text-yellow-400 uppercase md:text-lg">
              New Collection 2026
            </h2>
            <h1 className="mb-8 text-5xl font-black leading-tight text-white md:text-8xl tracking-tighter uppercase">
              Step Into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                The Future
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="max-w-2xl mx-auto text-lg text-gray-300 md:text-2xl font-light leading-relaxed">
              Experience the fusion of high-fashion aesthetics and street-level comfort.
              Designed for those who dare to stand out.
            </p>

            <button
              onClick={() => navigate('/products')}
              className="group relative flex items-center gap-4 bg-white px-10 py-5 text-black transition-all hover:bg-yellow-400"
            >
              <span className="z-10 text-sm font-black tracking-[0.2em] uppercase">Shop Now</span>
              <ArrowRight className="z-10 h-5 w-5 transition-transform group-hover:translate-x-2" />
              <div className="absolute inset-0 -z-0 bg-yellow-400 scale-x-0 transition-transform origin-left group-hover:scale-x-100 duration-500" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="h-12 w-[1px] bg-white/50" />
        </div>
      </motion.div>
    </div>
  );
}