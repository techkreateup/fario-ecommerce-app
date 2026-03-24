import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
    // Manual swipe navigation only; auto-play disabled as requested.


    const currentSlide = SLIDES[idx];

    return (
        <section className="relative overflow-hidden w-full h-[65vh] md:h-[75vh] lg:h-[800px] bg-[#030303]">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentSlide.id}
                    className="absolute inset-0 w-full h-full flex cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset }) => {
                        const swipe = offset.x;
                        if (swipe < -50) {
                            setIdx((i) => (i + 1) % SLIDES.length);
                        } else if (swipe > 50) {
                            setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);
                        }
                    }}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }} // Smooth swipe transition
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

            {/* Swipe interaction removed the need for chevron navigation buttons */}

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
                    </button>
                ))}
            </div>

            <div className="absolute bottom-0 lg:bottom-0 left-0 w-full z-50 pb-6 lg:pb-0">
                <HomeTicker isFooter={true} />
            </div>
        </section>
    );
};
