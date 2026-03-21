import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HomeTicker } from './HomeTicker';

const HERO_SLIDES = [
    {
        id: 1,
        desktop: "https://www.mydesignation.com/cdn/shop/files/SHIRT_WEB1_1.jpg?width=2000",
        mobile: "https://www.mydesignation.com/cdn/shop/files/SHIRT_WEB1_1.jpg?width=800",
        alt: "Men Shirts"
    },
    {
        id: 2,
        desktop: "https://www.mydesignation.com/cdn/shop/files/JAIPUR_SHIRT_REVISED_front_2_jpg_057bbf58-54eb-40f1-ad43-d4f9ce537632.jpg?width=2000",
        mobile: "https://www.mydesignation.com/cdn/shop/files/JAIPUR_SHIRT_REVISED_front_2_jpg_057bbf58-54eb-40f1-ad43-d4f9ce537632.jpg?width=800",
        alt: "Oversized Tees / Jaipur Print"
    },
    {
        id: 3,
        desktop: "https://www.mydesignation.com/cdn/shop/files/classic-chess-shirt-sports-edition-mydesignation-8433834.jpg?width=2000",
        mobile: "https://www.mydesignation.com/cdn/shop/files/classic-chess-shirt-sports-edition-mydesignation-8433834.jpg?width=800",
        alt: "Hoodies and Jackets / Classic Chess"
    },
    {
        id: 4,
        desktop: "https://www.mydesignation.com/cdn/shop/files/raven-embroidered-men-shirt-mydesignation-846706.jpg?width=2000",
        mobile: "https://www.mydesignation.com/cdn/shop/files/raven-embroidered-men-shirt-mydesignation-846706.jpg?width=800",
        alt: "Sports Collection 2026 / Raven Embroidered"
    }
];

export const HomeHero = () => {
    const [idx, setIdx] = useState(0);

    // Auto-advance every 6 seconds exactly as requested
    useEffect(() => {
        const timer = setInterval(() => {
            setIdx((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const handleNext = () => setIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    const handlePrev = () => setIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

    // Swap detection for mobile using framer-motion drag
    const handleDragEnd = (e: any, { offset }: any) => {
        const swipe = offset.x;
        if (swipe < -50) handleNext();
        else if (swipe > 50) handlePrev();
    };

    return (
        <section className="relative w-full overflow-hidden bg-[#F9F7EB] group">
            {/* Carousel Container matched strictly to the MyDesignation aspect ratio */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/7] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                    >
                        {/* Desktop Image */}
                        <img 
                            src={HERO_SLIDES[idx].desktop} 
                            alt={HERO_SLIDES[idx].alt}
                            className="w-full h-full object-cover hidden sm:block pointer-events-none"
                        />
                        {/* Mobile Image */}
                        <img 
                            src={HERO_SLIDES[idx].mobile} 
                            alt={HERO_SLIDES[idx].alt}
                            className="w-full h-full object-cover sm:hidden object-center pointer-events-none"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Left Arrow Navigation */}
                <button 
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-xl"
                >
                    <ChevronLeft size={28} className="text-black ml-[-2px] sm:ml-[-4px]" strokeWidth={2.5} />
                </button>

                {/* Right Arrow Navigation */}
                <button 
                    onClick={handleNext}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-xl"
                >
                    <ChevronRight size={28} className="text-black mr-[-2px] sm:mr-[-4px]" strokeWidth={2.5} />
                </button>

                {/* Bottom Dots Indicator */}
                <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
                    {HERO_SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIdx(i)}
                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                i === idx ? 'w-8 sm:w-12 bg-black' : 'w-1.5 sm:w-2 bg-gray-400 hover:bg-gray-800'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Fario Ticker immediately beneath slider */}
            <div className="relative z-30 w-full mt-[-1px]">
                <HomeTicker isFooter={true} />
            </div>
        </section>
    );
};
