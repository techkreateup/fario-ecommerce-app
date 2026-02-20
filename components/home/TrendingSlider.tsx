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
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl font-light tracking-tight">Trending Now</h2>
                    <button className="text-sm font-medium uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors">
                        View All
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
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                                <img
                                    src={p.img}
                                    alt={p.name}
                                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4">{p.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{p.price}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
