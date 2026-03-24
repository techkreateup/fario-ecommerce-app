import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HomeTicker } from './HomeTicker';

const SLIDES = [
  {
    id: '1',
    title: "STEP INTO STYLE",
    sub: "Premium Sneakers Collection",
    image: "/fario-ecommerce-app/assets/hero/hero-sneakers.png",
    link: "/products"
  },
  {
    id: '2',
    title: "ELEVATE YOUR LOOK",
    sub: "Signature Heels Collection",
    image: "/fario-ecommerce-app/assets/hero/hero-heels.png",
    link: "/products"
  },
  {
    id: '3',
    title: "RUN THE FUTURE",
    sub: "Performance Running Shoes",
    image: "/fario-ecommerce-app/assets/hero/hero-running.png",
    link: "/products"
  },
  {
    id: '4',
    title: "EVERYDAY COMFORT",
    sub: "Casual Wear Collection",
    image: "/fario-ecommerce-app/assets/hero/hero-casual.png",
    link: "/products"
  }
];

export const HomeHero = () => {
    const [idx, setIdx] = useState(0);

    // Auto slide change every 2000 ms (2 seconds)
    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 2000);
        return () => clearInterval(t);
    }, []);

    const currentSlide = SLIDES[idx];

    return (
        <section className="relative overflow-hidden w-full h-[60vh] md:h-[75vh] lg:h-[800px] bg-[#0a0a0b]">
            {/* Fade Transition */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentSlide.id}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${currentSlide.image})` }}
                    />
                    
                    {/* Dark Overlay for Typography Readability */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Centered Typography Content */}
                    <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 pt-10">
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-white font-black uppercase tracking-tight leading-none mb-4 drop-shadow-2xl"
                            style={{ fontSize: 'clamp(44px, 8vw, 100px)' }}
                        >
                            {currentSlide.title}
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-white/90 text-[13px] md:text-xl lg:text-2xl font-medium tracking-widest uppercase mb-10 drop-shadow-md"
                        >
                            {currentSlide.sub}
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                        >
                            <Link 
                                to={currentSlide.link}
                                className="inline-block px-12 py-4 bg-white text-black rounded-full font-black text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-300 shadow-xl"
                            >
                                Shop Now
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button 
                onClick={() => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)}
                className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md flex items-center justify-center transition-all border border-white/20 group hidden md:flex"
            >
                <ChevronLeft size={24} className="text-white group-hover:scale-110 transition-transform" />
            </button>
            <button 
                onClick={() => setIdx(i => (i + 1) % SLIDES.length)}
                className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md flex items-center justify-center transition-all border border-white/20 group hidden md:flex"
            >
                <ChevronRight size={24} className="text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Dot Pagination */}
            <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
                {SLIDES.map((s, i) => (
                    <button 
                        key={s.id} 
                        onClick={() => setIdx(i)}
                        className="rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: idx === i ? '32px' : '10px', 
                            height: '10px',
                            background: idx === i ? '#ffffff' : 'rgba(255,255,255,0.3)',
                            boxShadow: idx === i ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                        }} 
                    />
                ))}
            </div>

            <div className="absolute bottom-0 w-full z-40">
                <HomeTicker isFooter={true} />
            </div>
        </section>
    );
};
