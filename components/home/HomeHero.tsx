import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HomeTicker } from './HomeTicker';

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
  }
];

export const HomeHero = () => {
    const [idx, setIdx] = useState(0);

    // Auto slide change exactly every 2000 ms (2 seconds)
    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 2000);
        return () => clearInterval(t);
    }, []);

    const currentSlide = SLIDES[idx];

    return (
        <section className="relative overflow-hidden w-full h-[65vh] md:h-[75vh] lg:h-[800px] bg-[#030303]">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentSlide.id}
                    className="absolute inset-0 w-full h-full flex"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} // Smooth fade
                >
                    {/* 
                      RIGHT SIDE IMAGE: Constrained to maintain pixel density.
                      We use a CSS gradient mask to blend it perfectly into the black background on the left.
                    */}
                    <div className="absolute right-0 top-0 w-full md:w-[75%] h-full">
                        {/* 
                          Gradient overlay that simulates masking: 
                          Solid black on the left side fading to transparent on the right, 
                          creating a seamless blend between CSS background and image. 
                        */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-[#030303]/80 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10 h-32 bottom-0" />
                        
                        <img 
                            src={currentSlide.image} 
                            alt="Hero Product"
                            className="w-full h-full object-cover object-right md:object-center opacity-90"
                        />
                    </div>

                    {/* 
                      LEFT SIDE TEXT: DOM-based for infinite resolution and perfect framing.
                      Width locked to 60% so it never overflows onto the rigid parts of the image. 
                    */}
                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-6 lg:px-20 h-full flex flex-col justify-center">
                        <div className="w-full md:w-[65%] lg:w-[60%] text-left mt-10">
                            <motion.h1 
                                initial={{ x: -25, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-white font-black uppercase tracking-tighter leading-[1.05] mb-6"
                                style={{ fontSize: 'clamp(44px, 8vw, 100px)' }}
                            >
                                {currentSlide.title}
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ x: -15, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-white/70 text-[15px] md:text-xl lg:text-[22px] font-normal tracking-wide mb-12 whitespace-pre-line leading-relaxed max-w-lg"
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
                                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-extrabold text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-neutral-200 transition-all duration-300 shadow-[0_15px_30px_rgba(255,255,255,0.15)]"
                                >
                                    {currentSlide.btnText.replace(' →', '')}
                                    <span className="text-xl leading-none transform translate-y-[-1px] font-light">→</span>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button 
                onClick={() => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center transition-all hidden lg:flex group"
            >
                <ChevronLeft size={24} className="text-white opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
                onClick={() => setIdx(i => (i + 1) % SLIDES.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center transition-all hidden lg:flex group"
            >
                <ChevronRight size={24} className="text-white opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Luxury Minimalist Dot Navigation */}
            <div className="absolute bottom-12 lg:bottom-16 left-6 lg:left-20 z-50 flex items-center gap-4">
                {SLIDES.map((s, i) => (
                    <button 
                        key={s.id} 
                        onClick={() => setIdx(i)}
                        className="relative h-[3px] overflow-hidden transition-all duration-300"
                        style={{
                            width: idx === i ? '60px' : '30px', 
                            background: 'rgba(255,255,255,0.15)'
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
