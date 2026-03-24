import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HomeTicker } from './HomeTicker';

// ----------------------------------------------------------------------------
// PRO MAX CINEMATIC HERO (MANDATE: "Mass ha, Gethu ha, Class ha")
// - 4K Razor-Sharp Assets (w=3840 & q=100)
// - Massive Typographic Centerpiece (breaking traditional safe bounds)
// - 90vh Height (+1cm increase as requested)
// - 120fps Strict GPU Acceleration (will-change-transform)
// - Spring Physics for organic prestige easing
// ----------------------------------------------------------------------------

const SPRING_CONFIG = { type: "spring", stiffness: 100, damping: 20, mass: 1 };
const TEXT_SPRING = { type: "spring", stiffness: 200, damping: 25, mass: 0.8 };

const SLIDES = [
  {
    id: '1',
    eyebrow: "MENS // PREMIUM COLLECTION",
    heading: "AIR",
    display: "ELEVATED",
    sub: "Precision-engineered for absolute dominance.\nZero compromise on comfort.",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=100&w=3840&auto=format&fit=crop", // Floating pristine shoe
    link: "/products?category=Sneakers",
    btnText: "DISCOVER",
  },
  {
    id: '2',
    eyebrow: "WOMENS // LUXURY SERIES",
    heading: "PURE",
    display: "ELEGANCE",
    sub: "Architectural perfection in every step.\nDesigned to command the room.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=100&w=3840&auto=format&fit=crop", // Museum-lit red heel
    link: "/products?category=Heels",
    btnText: "EXPLORE",
  },
  {
    id: '3',
    eyebrow: "PERFORMANCE // TRACK & FIELD",
    heading: "RUN",
    display: "RELENTLESS",
    sub: "Carbon-infused dynamics.\nBreak your limits without looking back.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=100&w=3840&auto=format&fit=crop", // The iconic high contrast red shoe
    link: "/products?category=Sports",
    btnText: "GEAR UP",
  },
  {
    id: '4',
    eyebrow: "CASUAL // FINE STREETWEAR",
    heading: "STREET",
    display: "CULTURE",
    sub: "Sartorial casual footwear.\nHemmed for the concrete jungle.",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=100&w=3840&auto=format&fit=crop", // Moody held shoe
    link: "/products?category=Casual",
    btnText: "SHOP LIFESTYLE",
  }
];

export const HomeHero = () => {
    const [idx, setIdx] = useState(0);

    const currentSlide = SLIDES[idx];
    const nextSlide = () => setIdx((i) => (i + 1) % SLIDES.length);
    const prevSlide = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);

    return (
        <section className={`relative overflow-hidden w-full h-[85vh] md:h-[90vh] max-h-[900px] bg-[#030303]`}>
            
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div 
                    key={currentSlide.id}
                    className="absolute inset-0 w-full h-full flex flex-col justify-center items-center cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = offset.x;
                        if (swipe < -50 || velocity.x < -500) nextSlide();
                        else if (swipe > 50 || velocity.x > 500) prevSlide();
                    }}
                >
                    {/* CINEMATIC 4K BACKGROUND */}
                    <motion.div 
                        className="absolute inset-0 w-full h-full z-10"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.05, opacity: 0 }}
                        transition={{ ...SPRING_CONFIG, duration: 1.2 }}
                    >
                        <img 
                            src={currentSlide.image} 
                            alt="Hero Visual"
                            className="w-full h-full object-cover object-center will-change-transform"
                            decoding="async"
                            loading="eager"
                        />
                        {/* Elite Vignette Overlay - Enhances contrast without dulling the image */}
                        <div className="absolute inset-0 bg-black/40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-10 pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#030303] to-transparent z-10 pointer-events-none" />
                    </motion.div>

                    {/* MASSIVE TYPOGRAPHIC CORE */}
                    <div className="relative z-20 w-full px-4 flex flex-col items-center justify-center text-center mt-[-5%]">
                        
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ ...TEXT_SPRING, delay: 0.2 }}
                            className="mb-4"
                        >
                            <span className="px-4 py-1.5 border border-white/20 rounded-full text-white/80 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase backdrop-blur-sm">
                                {currentSlide.eyebrow}
                            </span>
                        </motion.div>

                        <motion.h1 
                            className="text-white flex flex-col items-center justify-center pointer-events-none"
                            initial={{ y: 40, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -40, opacity: 0, scale: 1.05 }}
                            transition={{ ...TEXT_SPRING, delay: 0.3 }}
                        >
                            <span className="block font-black tracking-[-0.04em] text-[18vw] md:text-[14vw] lg:text-[160px] xl:text-[200px] uppercase leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-2xl">
                                {currentSlide.heading}
                            </span>
                            <span className="block font-medium tracking-[0.2em] md:tracking-[0.5em] text-[4vw] md:text-[3vw] lg:text-[40px] uppercase leading-none mt-2 md:mt-4 text-white/90">
                                {currentSlide.display}
                            </span>
                        </motion.h1>

                        <motion.p 
                            className="text-white/70 text-sm md:text-lg font-normal tracking-wide mt-8 md:mt-12 whitespace-pre-line leading-relaxed max-w-xl mx-auto drop-shadow-lg"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ ...TEXT_SPRING, delay: 0.4 }}
                        >
                            {currentSlide.sub}
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ ...TEXT_SPRING, delay: 0.5 }}
                            className="mt-10"
                        >
                            <Link 
                                to={currentSlide.link}
                                className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-black font-black text-xs md:text-sm tracking-[0.2em] uppercase overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                            >
                                <span className="relative z-10">{currentSlide.btnText}</span>
                                <div className="absolute inset-0 h-full w-full bg-neutral-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            </Link>
                        </motion.div>
                    </div>

                </motion.div>
            </AnimatePresence>

            {/* Premium Cinematic Navigation */}
            <div className="absolute bottom-16 lg:bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
                {SLIDES.map((s, i) => (
                    <button 
                        key={s.id} 
                        onClick={() => setIdx(i)}
                        className="relative h-[2px] overflow-hidden transition-all duration-500 ease-out"
                        style={{
                            width: idx === i ? '48px' : '24px', 
                            background: idx === i ? '#ffffff' : 'rgba(255,255,255,0.2)'
                        }}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Global Ticker Footer Container */}
            <div className="absolute bottom-0 left-0 w-full z-[100]">
                <HomeTicker isFooter={true} />
            </div>
        </section>
    );
};
