import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowRight } from 'lucide-react';

// --- Data Types ---
interface LookbookItem {
    id: number;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    product: {
        name: string;
        price: string;
        image: string;
    };
}

const LOOKS = [
    {
        id: 1,
        video: "https://cdn.pixabay.com/video/2019/05/29/24036-339232938_large.mp4", // Walking
        items: [
            { id: 101, x: 45, y: 85, product: { name: "Phantom Elite", price: "Rs. 18,995", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" } },
            { id: 102, x: 55, y: 30, product: { name: "Tech Trench", price: "Rs. 25,000", image: "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=400" } }
        ]
    }
];

export default function ProLookbook() {
    const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

    return (
        <section className="relative h-screen w-full bg-black overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            >
                <source src={LOOKS[0].video} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/20" />

            {/* Title Overlay */}
            <div className="absolute top-12 left-12 z-10 text-white">
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] mb-2 border-l-2 border-white pl-3">Editorial</h3>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Street / Noir</h2>
            </div>

            {/* Hotspots */}
            <div className="absolute inset-0 z-20">
                {LOOKS[0].items.map((item) => (
                    <div
                        key={item.id}
                        className="absolute"
                        style={{ top: `${item.y}%`, left: `${item.x}%` }}
                    >
                        <div className="relative group">
                            {/* Pulse Animation */}
                            <div className="absolute -inset-4 bg-white/20 rounded-full animate-ping" />

                            {/* Trigger Button */}
                            <button
                                onClick={() => setActiveHotspot(activeHotspot === item.id ? null : item.id)}
                                className={`relative w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center transition-transform hover:scale-110 ${activeHotspot === item.id ? 'rotate-45 bg-black text-white' : 'text-black'}`}
                            >
                                <Plus size={16} />
                            </button>

                            {/* Popup Card */}
                            <AnimatePresence>
                                {activeHotspot === item.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 bg-white p-4 shadow-2xl rounded-sm"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-100 shrink-0">
                                                <img src={item.product.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h4 className="font-bold text-sm uppercase">{item.product.name}</h4>
                                                <p className="text-xs text-gray-500 mb-2">{item.product.price}</p>
                                                <button className="text-[10px] uppercase font-bold tracking-widest border-b border-black self-start hover:text-gray-600 hover:border-gray-600">
                                                    Shop Now
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
