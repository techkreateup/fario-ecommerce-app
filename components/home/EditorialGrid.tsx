import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
    {
        id: 1,
        title: "Men",
        subtitle: "Modern Essentials",
        image: "https://images.unsplash.com/photo-1488161628813-99425205adca?w=800&q=80",
        link: "/category/men"
    },
    {
        id: 2,
        title: "Women",
        subtitle: "Timeless Elegance",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
        link: "/category/women"
    }
];

export default function EditorialGrid() {
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            onClick={() => navigate(cat.link)}
                            className="group cursor-pointer relative overflow-hidden h-[600px] bg-gray-100"
                        >
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/20" />

                            <div className="absolute bottom-10 left-10 text-white">
                                <span className="block text-xs uppercase tracking-[0.2em] mb-2 opacity-90">{cat.subtitle}</span>
                                <h3 className="text-4xl font-light tracking-tight">{cat.title}</h3>

                                <div className="mt-6 inline-block border-b border-white pb-1 text-sm font-medium tracking-widest uppercase opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                                    Shop Collection
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
