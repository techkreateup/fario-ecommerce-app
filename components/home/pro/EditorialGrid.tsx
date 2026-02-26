import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const images = [
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80", // Shoe 1
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80", // Shoe 2
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", // Shoe 3
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", // Shoe 4
    "https://images.unsplash.com/photo-1511556532299-8f662fc26306?w=800&q=80", // Shoe 5
    "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=800&q=80", // Shoe 6
];

export default function EditorialGrid() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <section ref={containerRef} className="py-24 bg-white min-h-screen overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="mb-24 text-center">
                    <h2 className="text-[5vw] font-medium tracking-tighter leading-none">THE COLLECTION</h2>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mt-4">Curated for the Exceptional</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1 - Slow */}
                    <motion.div style={{ y: y1 }} className="flex flex-col gap-8 md:mt-24">
                        <div className="aspect-[3/4] overflow-hidden">
                            <img src={images[0]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                        </div>
                        <div className="aspect-[3/4] overflow-hidden">
                            <img src={images[1]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                        </div>
                    </motion.div>

                    {/* Column 2 - Fast */}
                    <motion.div style={{ y: y2 }} className="flex flex-col gap-8">
                        <div className="aspect-[3/4] overflow-hidden">
                            <img src={images[2]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                        </div>
                        <div className="aspect-[4/5] overflow-hidden bg-gray-100 flex items-center justify-center p-8">
                            <p className="text-3xl font-serif italic text-center">"Elegance is not standing out, but being remembered."</p>
                        </div>
                        <div className="aspect-[3/4] overflow-hidden">
                            <img src={images[3]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                        </div>
                    </motion.div>

                    {/* Column 3 - Medium */}
                    <motion.div style={{ y: y3 }} className="flex flex-col gap-8 md:mt-12">
                        <div className="aspect-[3/4] overflow-hidden">
                            <img src={images[4]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                        </div>
                        <div className="aspect-[3/4] overflow-hidden">
                            <img src={images[5]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
