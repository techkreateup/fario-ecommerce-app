import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ASSETS, SHOE_HOTSPOTS } from '../../constants';

// Define Variants type locally if missing from export
type Variants = any;

const ShoeAnatomy: React.FC = () => {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const shoeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { type: "spring", damping: 20, stiffness: 60 }
    }
  };

  // Cast motion components to any to bypass prop errors
  const MotionDiv = (motion as any).div;

  return (
    <section className="py-32 bg-fario-dark text-white relative overflow-hidden">
      {/* Background Topo Dark */}
      <div className="absolute inset-0 bg-topo-pattern opacity-10 pointer-events-none invert" />

      <MotionDiv
        className="container mx-auto px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* Content */}
          <div className="lg:w-1/3 order-2 lg:order-1">
            <MotionDiv variants={textVariants}>
              <h2 className="text-4xl md:text-6xl font-semibold font-heading mb-6 uppercase tracking-tight">
                Anatomy of <br />
                <span className="text-outline-white">Performance</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                Interact with the hotspots to discover why FARIO gear is engineered for excellence.
              </p>

              <div className="min-h-[160px]">
                <AnimatePresence mode="wait">
                  {activePoint ? (
                    <MotionDiv
                      key={activePoint}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10"
                    >
                      <h4 className="text-2xl font-bold font-heading text-fario-lime mb-2 uppercase">
                        {SHOE_HOTSPOTS.find(p => p.id === activePoint)?.label}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {SHOE_HOTSPOTS.find(p => p.id === activePoint)?.description}
                      </p>
                    </MotionDiv>
                  ) : (
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-4 text-gray-500 border-l-4 border-gray-700 pl-6"
                    >
                      <div>
                        <span className="block text-2xl mb-1">👆</span>
                        <span className="font-bold text-xs uppercase tracking-widest">Select a point on the model</span>
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </div>
            </MotionDiv>
          </div>

          {/* Interactive Shoe */}
          <MotionDiv
            className="lg:w-2/3 relative w-full flex items-center justify-center order-1 lg:order-2"
            variants={shoeVariants}
          >
            {/* 
              IMPROVED FIX: 
              Using 'inline-block' without flex-direction quirks.
              Container is size-constrained by the img itself.
            */}
            <div className="relative inline-block mx-auto max-w-2xl">
              {/* Glow */}
              <div className="absolute inset-0 bg-fario-purple/20 blur-[100px] rounded-full pointer-events-none"></div>

              <img
                src={ASSETS.heroShoe}
                alt="Shoe Anatomy"
                onError={(e) => {
                  console.error('Failed to load Shoe Anatomy image:', ASSETS.heroShoe);
                  (e.target as HTMLImageElement).style.opacity = '0.2';
                }}
                className="block w-full h-auto relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />

              {/* Hotspot Layer - pinned strictly to the image's bounds */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {SHOE_HOTSPOTS.map((point) => (
                  <MotionDiv
                    key={point.id}
                    className="absolute w-10 h-10 -ml-5 -mt-5 cursor-pointer pointer-events-auto"
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 1 + (point.id * 0.15),
                      type: 'spring',
                      stiffness: 260,
                      damping: 20
                    }}
                    onMouseEnter={() => setActivePoint(point.id)}
                    onMouseLeave={() => setActivePoint(null)}
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-fario-lime opacity-40 animate-ping"></span>

                    <span className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${activePoint === point.id ? 'bg-fario-lime border-fario-lime scale-125' : 'bg-fario-dark/80 border-white/50 hover:bg-fario-purple'}`}>
                      <span className={`text-xl font-bold ${activePoint === point.id ? 'text-fario-dark' : 'text-white'}`}>+</span>
                    </span>

                    <AnimatePresence>
                      {activePoint === point.id && (
                        <MotionDiv
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 40, opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="absolute bottom-full left-1/2 w-0.5 bg-fario-lime -translate-x-1/2 origin-bottom"
                        />
                      )}
                    </AnimatePresence>
                  </MotionDiv>
                ))}
              </div>
            </div>
          </MotionDiv>

        </div>
      </MotionDiv>
    </section>
  );
};

export default ShoeAnatomy;