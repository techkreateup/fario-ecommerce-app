import React from 'react';
import { motion } from 'framer-motion';

const dumpImages = [
    "https://images.unsplash.com/photo-1503341338985-c0477be52513?w=600&q=80",
    "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
];

export default function MediaDump() {
    return (
        <section className="bg-black py-12 overflow-hidden relative min-h-[800px]">
            <div className="absolute top-10 left-10 z-20">
                <h2 className="text-8xl font-black text-white uppercase leading-[0.8] tracking-tighter mix-blend-exclusion">
                    The<br /><span className="text-transparent stroke-white stroke-2">Dump</span>
                </h2>
            </div>

            <div className="relative container mx-auto h-full">
                {dumpImages.map((src, idx) => (
                    <motion.div
                        key={idx}
                        drag
                        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                        initial={{
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 200 - 100,
                            rotate: Math.random() * 30 - 15
                        }}
                        whileHover={{ scale: 1.1, zIndex: 50, rotate: 0 }}
                        className={`absolute w-[300px] md:w-[400px] shadow-[10px_10px_0px_0px_rgba(255,255,0,1)] border-2 border-white
               ${idx === 0 ? 'top-20 right-20' : ''}
               ${idx === 1 ? 'bottom-40 left-20' : ''}
               ${idx === 2 ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
               ${idx === 3 ? 'bottom-20 right-40' : ''}
               ${idx === 4 ? 'top-40 left-1/3' : ''}
             `}
                    >
                        <img src={src} alt="Chaos" className="w-full grayscale hover:grayscale-0 transition-all duration-300" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
