import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HomeTicker } from './HomeTicker';

// High-end Typography & Left-Aligned Text Layout (70/30 Split mapping)
const SLIDES = [
  {
    id: '1',
    title: (
      <>
        STEP INTO<br />
        <span className="text-white">NEXT LEVEL STYLE</span>
      </>
    ),
    sub: "Discover premium sneakers\nbuilt for comfort, speed\nand everyday fashion.",
    image: "/fario-ecommerce-app/assets/hero/hero-sneakers-v2.png",
    link: "/products?category=Sneakers",
    btnText: "SHOP SNEAKERS →",
    accent: "rgba(255,255,255,0.15)"
  },
  {
    id: '2',
    title: (
      <>
        ELEVATE<br />
        <span className="text-white">YOUR LOOK</span>
      </>
    ),
    sub: "Elegant heels designed\nfor confidence, comfort\nand timeless fashion.",
    image: "/fario-ecommerce-app/assets/hero/hero-heels-v2.png",
    link: "/products?category=Heels",
    btnText: "SHOP HEELS →",
    accent: "rgba(255,255,255,0.15)"
  },
  {
    id: '3',
    title: (
      <>
        RUN<br />
        <span className="text-white">THE FUTURE</span>
      </>
    ),
    sub: "Performance running shoes\nbuilt for speed, endurance\nand ultimate comfort.",
    image: "/fario-ecommerce-app/assets/hero/hero-running-v2.png",
    link: "/products?category=Sports",
    btnText: "SHOP RUNNING →",
    accent: "rgba(255,255,255,0.15)"
  },
  {
    id: '4',
    title: (
      <>
        EVERYDAY<br />
        <span className="text-white">COMFORT</span>
      </>
    ),
    sub: "Casual footwear made\nfor daily life, style\nand unbeatable comfort.",
    image: "/fario-ecommerce-app/assets/hero/hero-casual-v2.png",
    link: "/products?category=Casual",
    btnText: "SHOP CASUAL →",
    accent: "rgba(255,255,255,0.15)"
  }
];

export const HomeHero = () => {
    const [idx, setIdx] = useState(0);

    // Auto slide change exactly every 2000 ms (2 seconds) as requested
    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 2000);
        return () => clearInterval(t);
    }, []);

    const currentSlide = SLIDES[idx];

    return (
        <section className="relative overflow-hidden w-full h-[65vh] md:h-[75vh] lg:h-[900px] bg-[#050505]">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentSlide.id}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} // Smooth fade
                >
                    {/* Full Width Background Image. Image naturally has product on the right (30%) */}
                    <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center md:bg-[center_right_-5vw] bg-no-repeat"
                        style={{ backgroundImage: `url(${currentSlide.image})` }}
                    />
                    
                    {/* Subtle Gradient Background Overlay: Heavy left (for text), transparent right (for image overlap) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/95 via-[#000000]/50 to-transparent" />

                    {/* 70% Text Left Container */}
                    <div className="relative z-20 container mx-auto px-6 lg:px-16 h-full flex flex-col justify-center w-full">
                        <div className="w-full lg:w-[70%] text-left">
                            <motion.h1 
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-white font-black uppercase tracking-tighter leading-[1.05] mb-5 drop-shadow-2xl"
                                style={{ fontSize: 'clamp(48px, 9vw, 110px)' }}
                            >
                                {currentSlide.title}
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-white/80 text-[14px] md:text-xl lg:text-[22px] font-medium tracking-wide mb-10 whitespace-pre-line leading-relaxed max-w-xl"
                            >
                                {currentSlide.sub}
                            </motion.p>
                            
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <Link 
                                    to={currentSlide.link}
                                    className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-black text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                >
                                    {currentSlide.btnText.replace(' →', '')}
                                    <span className="text-lg leading-none transform translate-y-[-1px] font-light">→</span>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button 
                onClick={() => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-none bg-black/20 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-all border border-white/10 group hidden md:flex"
            >
                <ChevronLeft size={24} className="text-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
                onClick={() => setIdx(i => (i + 1) % SLIDES.length)}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-none bg-black/20 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition-all border border-white/10 group hidden md:flex"
            >
                <ChevronRight size={24} className="text-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Luxury Minimalist Dot Navigation */}
            <div className="absolute bottom-[60px] lg:bottom-[80px] left-6 lg:left-16 z-50 flex items-center gap-4">
                {SLIDES.map((s, i) => (
                    <button 
                        key={s.id} 
                        onClick={() => setIdx(i)}
                        className="relative h-[2px] overflow-hidden transition-all duration-300"
                        style={{
                            width: idx === i ? '60px' : '30px', 
                            background: 'rgba(255,255,255,0.2)'
                        }}
                    >
                        {/* Progress Bar Effect */}
                        {idx === i && (
                            <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, ease: "linear" }}
                                className="absolute top-0 left-0 h-full bg-white"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="absolute bottom-0 w-full z-40 hidden md:block">
                <HomeTicker isFooter={true} />
            </div>
        </section>
    );
};
