import React from 'react';
import { motion } from 'framer-motion';

// Mock data (would typically come from API/Props)
const products = Array(12).fill({
    name: "Prototype-X",
    price: "Rs. 14,999",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80",
}).map((p, i) => ({ ...p, id: i }));

export default function ProductWall() {
    return (
        <section className="bg-white border-y-4 border-black">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0">
                {products.map((p, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ opacity: 0.8 }}
                        className="relative group border-r border-b border-black h-[300px] overflow-hidden"
                    >
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-white p-2 text-center">
                            <span className="font-mono text-xs text-yellow-400 mb-1">REF: {p.id + 1000}</span>
                            <h3 className="font-black uppercase text-xl leading-none mb-2">{p.name}</h3>
                            <p className="font-bold bg-yellow-400 text-black px-2">{p.price}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="bg-black text-white p-4 text-center">
                <button className="uppercase font-black tracking-widest hover:text-yellow-400 underline decoration-yellow-400 decoration-2 underline-offset-4">
                    Load Full Archive
                </button>
            </div>
        </section>
    );
}
