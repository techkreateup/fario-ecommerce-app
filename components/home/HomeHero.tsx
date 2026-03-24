import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HomeTicker } from './HomeTicker';

const SLIDES = [
  {
    id: '1',
    title: (
      <>
        <span className="font-semibold tracking-tight">STEP INTO</span><br />
        <span className="font-black tracking-normal">NEXT LEVEL STYLE</span>
      </>
    ),
    sub: "Discover premium sneakers\nbuilt for comfort, speed\nand everyday fashion.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=100&w=2574&auto=format&fit=crop", // Ultra crisp 4k sneaker
    link: "/products?category=Sneakers",
    btnText: "SHOP SNEAKERS →",
    textColor: "text-black",
    subColor: "text-neutral-600",
    bgColor: "bg-[#F3F4F6]",
    btnClass: "bg-black text-white hover:bg-neutral-800"
  },
  {
    id: '2',
    title: (
      <>
        <span className="font-semibold tracking-tight">ELEVATE</span><br />
        <span className="font-black tracking-normal">YOUR LOOK</span>
      </>
    ),
    sub: "Elegant heels designed\nfor confidence, comfort\nand timeless fashion.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=100&w=2680&auto=format&fit=crop", // Ultra crisp luxury heel
    link: "/products?category=Heels",
    btnText: "SHOP HEELS →",
    textColor: "text-black", 
    subColor: "text-neutral-600",
    bgColor: "bg-[#EAE8E3]", // Elegant warm silk tone
    btnClass: "bg-black text-white hover:bg-neutral-800"
  },
  {
    id: '3',
    title: (
      <>
        <span className="font-semibold tracking-tight">RUN</span><br />
        <span className="font-black tracking-normal">THE FUTURE</span>
      </>
    ),
    sub: "Performance running shoes\nbuilt for speed, endurance\nand ultimate comfort.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=100&w=2670&auto=format&fit=crop", // Iconic high-contrast dark sneaker
    link: "/products?category=Sports",
    btnText: "SHOP RUNNING →",
    textColor: "text-white",
    subColor: "text-neutral-300",
    bgColor: "bg-[#111111]", // Deep cyberpunk dark
    btnClass: "bg-white text-black hover:bg-neutral-200"
  },
  {
    id: '4',
    title: (
      <>
        <span className="font-semibold tracking-tight">EVERYDAY</span><br />
        <span className="font-black tracking-normal">COMFORT</span>
      </>
    ),
    sub: "Casual footwear made\nfor daily life, style\nand unbeatable comfort.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=100&w=2624&auto=format&fit=crop", // Soft casual boot
    link: "/products?category=Casual",
    btnText: "SHOP CASUAL →",
    textColor: "text-black",
    subColor: "text-neutral-600",
    bgColor: "bg-[#D9D9D9]", // Soft grey
    btnClass: "bg-black text-white hover:bg-neutral-800"
  }
];

export const HomeHero = () => {
    const [idx, setIdx] = useState(0);
    // Manual swipe navigation only; auto-play disabled as requested.


    const currentSlide = SLIDES[idx];

    return (
        <section className={`relative overflow-hidden w-full h-[75vh] min-h-[500px] max-h-[600px] transition-colors duration-1000 ${SLIDES[idx].bgColor}`}>
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
                      RIGHT SIDE IMAGE MASKED: Ultra-crisp Unsplash 4k photos.
                      Confined physically to the right 75% to prevent heavy object stretch.
                      A gradient explicitly blending colors from left to right creates the text space.
                    */}
                    <div className="absolute right-0 top-0 w-full md:w-[75%] lg:w-[65%] h-full">
                        {/* The dynamic mask matching the section background colour */}
                        <div 
                            className="absolute inset-0 z-10 pointer-events-none" 
                            style={{ background: 'linear-gradient(to right, currentColor 0%, transparent 60%)', color: 'inherit' }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 h-32 bottom-0 pointer-events-none" />
                        
                        <img 
                            src={currentSlide.image} 
                            alt="Hero Product"
                            className="w-full h-full object-cover object-center lg:object-right-bottom mix-blend-normal"
                        />
                    </div>

                    {/* 
                      LEFT SIDE TEXT: Dynamic fonts/colors based on CoT Layout
                    */}
                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-6 lg:px-20 h-full flex flex-col justify-center">
                        <div className="w-full md:w-[65%] lg:w-[60%] text-left mt-10">
                            <motion.h1 
                                initial={{ x: -25, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`${currentSlide.textColor} uppercase leading-[1.1] mb-4`}
                                style={{ fontSize: 'clamp(36px, 6vw, 85px)' }}
                            >
                                {currentSlide.title}
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ x: -15, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className={`${currentSlide.subColor} text-[15px] md:text-xl lg:text-[22px] font-normal tracking-wide mb-10 whitespace-pre-line leading-relaxed max-w-lg`}
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
                                    className={`inline-flex items-center gap-3 px-10 py-5 font-extrabold text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-2xl ${currentSlide.btnClass}`}
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
