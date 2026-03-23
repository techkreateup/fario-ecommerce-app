import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { E } from './HomeConstants';

interface Product {
    id: string;
    name: string;
    price: number;
    img: string;
}

interface HomeCategoryShowcaseProps {
    title: string;
    subtitle?: string;
    products: Product[];
    bgColor?: string;
}

const ProductCard = ({ p, i }: { p: Product; i: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: E }}
            className="group cursor-pointer flex flex-col"
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-3 bg-gray-50 border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-lg">
                <motion.img
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover"
                />

                {/* Clean Add Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/5 flex items-end p-3 transition-colors duration-300 hidden md:flex"
                >
                    <button className="w-full py-2.5 bg-white text-[#1a0d2e] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-lg shadow-2xl border border-gray-100 hover:bg-[#d9f99d] transition-colors">
                        <ShoppingBag size={12} strokeWidth={2.5} /> Quick Add
                    </button>
                </motion.div>
            </div>

            <div className="text-center px-1">
                <h3 className="text-xs md:text-sm font-bold text-[#1a0d2e] leading-tight group-hover:text-[#7a51a0] transition-colors">
                    {p.name}
                </h3>
                <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="text-xs md:text-sm font-black text-[#1a0d2e]">
                        Rs. {p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-gray-400 line-through">
                        Rs. {(p.price * 1.2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export const HomeCategoryShowcase: React.FC<HomeCategoryShowcaseProps> = ({ title, subtitle, products, bgColor = "#FFFEF5" }) => {
    return (
        <section
            className="py-12 md:py-24 border-b border-gray-100/50 transition-colors duration-500"
            style={{ backgroundColor: bgColor }}
        >
            <div className="container mx-auto px-4 md:px-12 lg:px-20">
                {/* Neat Headers */}
                <div className="mb-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-heading font-black text-2xl md:text-4xl uppercase tracking-tighter text-[#1a0d2e] leading-none mb-2">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7a51a0]/50">
                                {subtitle}
                            </p>
                        )}
                        <div className="w-10 h-0.5 bg-[#1a0d2e]/10 mx-auto mt-6" />
                    </motion.div>
                </div>

                {/* Dense 4-Column Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.slice(0, 4).map((p, i) => (
                        <ProductCard key={p.id} p={p} i={i} />
                    ))}
                </div>

                {/* Secondary CTA */}
                <div className="mt-12 text-center">
                    <button className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-[#1a0d2e] pb-1 transition-all text-[#1a0d2e]/60 hover:text-[#1a0d2e]">
                        See All Collections
                    </button>
                </div>
            </div>
        </section>
    );
};
