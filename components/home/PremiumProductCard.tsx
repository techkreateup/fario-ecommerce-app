
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnhancedProduct } from '../../constants';

interface PremiumProductCardProps {
    product: EnhancedProduct;
    onAddToCart?: (e: React.MouseEvent) => void;
    onQuickView?: () => void;
}

export default function PremiumProductCard({ product, onAddToCart, onQuickView }: PremiumProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');

    // Sale logic
    const onSale = product.originalPrice && product.originalPrice > product.price;
    const discount = onSale ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

    return (
        <motion.div
            className="group relative flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            {/* Image Container (Snitch style 3:4 aspect) */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                <Link to={`/products/${product.id}`} className="block h-full">
                    {/* Main Image */}
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Secondary Hover Image (if exists in gallery) */}
                    <AnimatePresence>
                        {isHovered && product.gallery && product.gallery.length > 0 && (
                            <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                src={product.gallery[0]}
                                alt={`${product.name} alternate view`}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}
                    </AnimatePresence>
                </Link>

                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {onSale && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded tracking-tighter uppercase">
                            {discount}% OFF
                        </span>
                    )}
                    {(product.category as string) === 'New Arrivals' && (
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded tracking-tighter uppercase">
                            New
                        </span>
                    )}
                </div>

                {/* Action Buttons (Fades in on hover) */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-2"
                        >
                            <button
                                onClick={onAddToCart}
                                className="w-full bg-white text-black py-3 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors duration-300 shadow-xl"
                            >
                                <ShoppingCart size={14} />
                                Quick Add
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Icons */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Heart size={16} />
                    </button>
                    <button
                        onClick={onQuickView}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 hover:text-blue-500 transition-colors"
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-4 flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate pr-2">
                        <Link to={`/products/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-gray-900">Rs. {product.price.toLocaleString()}</span>
                        {onSale && (
                            <span className="text-[10px] text-gray-400 line-through">Rs. {product.originalPrice?.toLocaleString()}</span>
                        )}
                    </div>
                </div>

                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium">{product.category} | {product.gender}</p>

                {/* Color Swatches (Snitch Style) */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex gap-2">
                        {product.colors.slice(0, 4).map((color, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedColor(color)}
                                className={`w-3 h-3 rounded-full border border-gray-200 transition-all ${selectedColor === color ? 'ring-2 ring-black ring-offset-1 scale-110' : ''}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                aria-label={color}
                            />
                        ))}
                        {product.colors.length > 4 && (
                            <span className="text-[10px] text-gray-400 font-bold">+{product.colors.length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
