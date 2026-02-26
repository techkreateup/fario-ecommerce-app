import React from 'react';
import { motion } from 'framer-motion';

const lookbookItems = [
    { id: 1, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000", title: "Street Luxe" },
    { id: 2, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000", title: "Urban Explorer" },
    { id: 3, image: "https://images.unsplash.com/photo-1529139574466-a302d27f3d90?q=80&w=1000", title: "Minimalist Cool" },
    { id: 4, image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000", title: "Summer Vibes" },
    { id: 5, image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000", title: "Night Out" },
    { id: 6, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000", title: "Statement Pieces" },
];

export default function LookbookGrid() {
    return (
        <section className="py-32 bg-black text-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-24">
                    <span className="block text-yellow-500 text-sm font-bold tracking-[0.3em] uppercase mb-4">The Edit</span>
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic">
                        Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Diaries</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lookbookItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className={`relative overflow-hidden rounded-none group h-[600px] ${index === 1 || index === 4 ? 'md:-translate-y-16' : ''}`}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                <span className="text-3xl font-black uppercase tracking-widest border-2 border-white px-6 py-2">
                                    {item.title}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
