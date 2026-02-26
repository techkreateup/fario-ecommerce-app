import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const socialImages = [
    "https://images.unsplash.com/photo-1512353087810-25dfcd100962?w=800&q=80",
    "https://images.unsplash.com/photo-1545638521-4ea2e1694f79?w=800&q=80",
    "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=800&q=80",
    "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=800&q=80",
    "https://images.unsplash.com/photo-1485230946086-4d5d27716e3e?w=800&q=80",
    "https://images.unsplash.com/photo-1507680434567-5739c8a9553e?w=800&q=80",
];

export default function SocialFeed() {
    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 mb-16 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">@Fario.Official</h2>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Join the movement</p>
                </div>
                <a href="#" className="flex items-center gap-2 font-bold text-sm uppercase tracking-widest hover:text-yellow-600 transition-colors">
                    <Instagram size={20} />
                    Follow Us
                </a>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-4 -mx-4">
                {socialImages.map((src, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex-shrink-0 w-[300px] h-[400px] relative group cursor-pointer"
                    >
                        <img
                            src={src}
                            alt="Social Feed"
                            className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Instagram className="text-white w-8 h-8" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
