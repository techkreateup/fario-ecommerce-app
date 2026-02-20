import React from 'react';
import { motion } from 'framer-motion';

const trendingProducts = [
    { id: 1, name: "The Classic Loafer", price: "₹4,999", img: "https://images.unsplash.com/photo-1533867617858-e7b97e0605df?w=500&q=80" },
    { id: 2, name: "Urban Runner", price: "₹6,499", img: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80" },
    { id: 3, name: "Weekend Boot", price: "₹8,999", img: "https://images.unsplash.com/photo-1520639888713-7851188b63db?w=500&q=80" },
    { id: 4, name: "Studio Sneaker", price: "₹5,299", img: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?w=500&q=80" },
];

export default function TrendingSlider() {
    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-end mb-8">
                    <button className="text-xs uppercase tracking-widest hover:text-gray-500 transition-colors">
                        + View All
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {trendingProducts.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                <img
                                    src={p.img}
                                    alt={p.name}
                                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
