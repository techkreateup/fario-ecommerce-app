import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { E, DARK_TXT, PURPLE } from './HomeConstants';

interface Product {
    id: string;
    name: string;
    price: number;
    img: string;
    orig?: number;
    sub?: string;
}

interface HomeCategoryShowcaseProps {
    title: string;
    subtitle?: string;
    products: Product[];
    bgColor?: string;
}

const ProductCard = ({ p, i }: { p: Product; i: number }) => {
    const [hov, setHov] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: E }}
            className="group cursor-pointer flex flex-col"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            {/* Image Container with exactly 12px border radius -> MyDesignation style */}
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[12px] bg-[#F3F3F3] mb-4">
                <motion.img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    animate={{ scale: hov ? 1.05 : 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* Add to Cart Overlay on Desktop Hover - MyDesignation Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: hov ? 1 : 0, y: hov ? 0 : 20 }}
                    className="absolute bottom-4 left-0 right-0 justify-center hidden lg:flex z-10"
                >
                    <button className="w-[85%] py-3 bg-white text-black font-bold text-xs tracking-widest uppercase shadow-xl hover:bg-[#1a0d2e] hover:text-white transition-colors duration-300 border border-gray-200">
                        Quick Add
                    </button>
                </motion.div>
            </div>

            {/* Typography details aligned CENTER below image exactly like MyDesignation */}
            <div className="text-center flex flex-col gap-1.5 px-1">
                <h3 className="text-sm sm:text-[15px] font-semibold tracking-wide uppercase leading-tight"
                    style={{ color: DARK_TXT }}>
                    {p.name}
                </h3>
                {p.sub && (
                    <span className="text-xs font-medium uppercase tracking-widest" style={{ color: PURPLE }}>{p.sub}</span>
                )}
                <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-sm font-bold" style={{ color: DARK_TXT }}>
                        Rs. {p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs line-through opacity-50 font-medium text-gray-500">
                        Rs. {(p.orig || (p.price * 1.2)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export const HomeCategoryShowcase: React.FC<HomeCategoryShowcaseProps> = ({ title, subtitle, products, bgColor = "#FFFEF5" }) => {
    return (
        <section
            className="py-12 md:py-20 border-b border-gray-100/50 transition-colors duration-500"
            style={{ backgroundColor: bgColor }}
        >
            <div className="container mx-auto px-4 md:px-12 lg:px-20 max-w-[1400px]">
                {/* Header matching MyDesignation Layout Structure */}
                <div className="flex flex-col items-center justify-center mb-10 md:mb-14 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-serif tracking-tight uppercase" style={{ color: DARK_TXT }}>
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] mt-2" style={{ color: PURPLE }}>
                                {subtitle}
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Dense 4-Column Grid - MyDesignation Pattern */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 mb-10">
                    {products.map((p, i) => (
                        <ProductCard key={p.id} p={p} i={i} />
                    ))}
                </div>

                {/* MyDesignation View All Outline Button */}
                <div className="flex justify-center mt-6">
                    <button className="px-8 py-3 bg-transparent border border-[#1a0d2e] text-[#1a0d2e] font-bold text-xs tracking-widest uppercase hover:bg-[#1a0d2e] hover:text-white transition-colors duration-300">
                        See All Collections
                    </button>
                </div>
            </div>
        </section>
    );
};
