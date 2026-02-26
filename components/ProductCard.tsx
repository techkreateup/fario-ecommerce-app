import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart } from 'lucide-react';
import { EnhancedProduct } from '../constants';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    product: EnhancedProduct;
    viewMode?: 'grid' | 'list';
    onAddToCart?: (e: React.MouseEvent) => void;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
    ({ product, viewMode = 'grid', onAddToCart }, ref) => {
        const navigate = useNavigate();
        const [isHovered, setIsHovered] = useState(false);
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        const { id, name, price, originalPrice, image, gallery, category, rating, inStock, reviewsCount, gender, tagline, description, colors } = product;

        // Carousel Logic on Hover
        useEffect(() => {
            let interval: NodeJS.Timeout;
            if (isHovered && gallery && gallery.length > 0) {
                interval = setInterval(() => {
                    setCurrentImageIndex((prev) => (prev + 1) % (gallery.length + 1));
                }, 1500);
            } else {
                setCurrentImageIndex(0);
            }
            return () => clearInterval(interval);
        }, [isHovered, gallery]);

        const displayImage = currentImageIndex === 0 ? image : gallery?.[currentImageIndex - 1] || image;
        const MotionDiv = (motion as any).div;
        const MotionImg = (motion as any).img;

        if (viewMode === 'list') {
            return (
                <MotionDiv
                    ref={ref}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => navigate(`/products/${id}`)}
                    className="group flex bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-fario-purple/20 transition-all cursor-pointer min-h-[14rem] md:min-h-[16rem]"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="w-48 md:w-72 bg-gray-50 relative flex-shrink-0 flex items-center justify-center p-6">
                        {!inStock && <div className="absolute top-2 left-2 bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-1 rounded z-20">SOLD OUT</div>}
                        {originalPrice && (
                            <div className="absolute top-2 right-2 bg-rose-600 text-white px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest z-20 shadow-md">
                                Limited time deal
                            </div>
                        )}
                        <MotionImg
                            src={displayImage}
                            alt={name}
                            layoutId={`product-image-${id}`}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                console.error(`Failed to load image for ${name}:`, displayImage);
                                (e.target as HTMLImageElement).style.opacity = '0.3';
                            }}
                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                        />

                        {colors && colors.length > 1 && (
                            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-100 shadow-sm z-20">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">+{colors.length - 1} color options</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow p-5 md:p-8 flex flex-col md:flex-row gap-6">
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-[10px] font-black text-fario-purple uppercase tracking-widest bg-fario-purple/5 px-2 py-1 rounded">{category}</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center text-yellow-500">
                                        <Star size={12} className="fill-current" />
                                        <span className="text-[11px] font-bold text-gray-700 ml-1">{rating}</span>
                                    </div>
                                    <span className="text-[11px] text-gray-400">({(reviewsCount || 0).toLocaleString()})</span>
                                </div>
                                <div className="h-3 w-px bg-gray-100 hidden md:block" />
                                <span className="text-[10px] font-medium text-gray-500 hidden md:block">5K+ bought in past month</span>
                            </div>

                            <h3 className="text-xl font-bold text-black leading-tight mb-3 group-hover:text-fario-purple transition-colors">
                                {name} ({gender}) | {tagline}
                            </h3>

                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">{description}</p>

                            <div className="flex flex-wrap gap-4 text-[11px]">
                                <div className="flex items-center gap-1.5 text-gray-800">
                                    <span className="font-bold">FREE delivery</span> <span className="text-gray-500">Thu, 29 Jan</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-800">
                                    <span className="font-bold">Fastest Tomorrow</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-64 border-l border-gray-100 md:pl-6 flex flex-col justify-between">
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-black tracking-tighter">Rs. {price.toLocaleString()}</span>
                                </div>
                                {originalPrice && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-gray-400 line-through">M.R.P: Rs. {originalPrice.toLocaleString()}</span>
                                        <span className="text-[11px] font-bold text-rose-600">({Math.round(((originalPrice - price) / originalPrice) * 100)}% off)</span>
                                    </div>
                                )}
                                <div className="mt-4 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-100 inline-block">
                                    Up to 5% back with Fario Pay
                                </div>
                            </div>

                            <button
                                onClick={onAddToCart}
                                className="mt-6 w-full py-3 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-fario-purple transition-all shadow-md active:scale-95"
                            >
                                <ShoppingCart size={16} /> Add to Cart
                            </button>
                        </div>
                    </div>
                </MotionDiv>
            );
        }

        // Grid View (Default)
        const backgroundProducts = [
            'Scholar Max Classic',
            'Edustep Core Black',
            'Jumpr 200 Kinetic',
            'Scholar Pack Pro',
            'Cloud-Blend Socks'
        ];
        const hasBackground = backgroundProducts.includes(name);

        return (
            <MotionDiv
                ref={ref}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => navigate(`/products/${id}`)}
                className="group flex flex-col cursor-pointer bg-white rounded-xl md:rounded-3xl border border-gray-200 shadow-sm hover:border-fario-purple/30 hover:shadow-xl transition-all duration-500 overflow-hidden h-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="button"
                tabIndex={0}
            >
                {/* IMAGE GRID UNIT */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden border-b border-gray-100">
                    <div className={`absolute inset-0 flex items-center justify-center ${hasBackground ? 'p-0' : 'p-4'}`}>
                        <MotionImg
                            key={currentImageIndex}
                            src={displayImage || 'https://via.placeholder.com/400x400?text=No+Image'}
                            alt={name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                console.error(`Failed to load image for ${name}:`, displayImage);
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+Error';
                                (e.target as HTMLImageElement).style.opacity = '0.7';
                            }}
                            className={`w-full h-full mix-blend-multiply transition-transform duration-700 group-hover:scale-105 ${hasBackground ? 'object-cover' : 'object-contain'}`}
                        />
                    </div>

                    {/* Variants Indicator */}
                    {colors && colors.length > 1 && (
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-100 shadow-sm z-20">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">+{colors.length - 1} other colors</span>
                        </div>
                    )}

                    {/* Status Badge — desktop only */}
                    {originalPrice && (
                        <div className="absolute top-2 left-2 hidden md:block bg-rose-600 text-white px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest z-20 shadow-lg">
                            Sale
                        </div>
                    )}

                    {/* Carousel Indicators */}
                    {gallery && gallery.length > 0 && isHovered && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                            {[0, ...gallery].map((_, idx) => (
                                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-fario-purple w-3' : 'bg-gray-300'}`} />
                            ))}
                        </div>
                    )}
                </div>

                {/* METADATA - MOBILE COMPACT / DESKTOP FULL */}
                <div className="p-2 md:p-4 flex flex-col flex-grow bg-white">

                    {/* Mobile: just name + price — clean, Comet-style */}
                    <div className="md:hidden">
                        <h3 className="text-[11px] font-bold text-black leading-tight line-clamp-2 mb-1">
                            {name}
                        </h3>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm font-black text-black tracking-tight">Rs. {price.toLocaleString()}</span>
                            {originalPrice && (
                                <span className="text-[9px] font-bold text-rose-500">{Math.round(((originalPrice - price) / originalPrice) * 100)}% off</span>
                            )}
                        </div>
                    </div>

                    {/* Desktop: full Amazon-style density */}
                    <div className="hidden md:flex flex-col flex-grow">
                        {/* Category & Social Proof */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-black text-fario-purple uppercase tracking-[0.2em]">{category}</span>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-500'} shadow-sm`} />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{inStock ? 'In Stock' : 'Sold Out'}</span>
                            </div>
                        </div>

                        {/* Product Name */}
                        <div className="mb-2">
                            <h3 className="text-sm font-bold text-black group-hover:text-fario-purple transition-colors leading-tight line-clamp-1">
                                {name}
                            </h3>
                            {tagline && (
                                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{tagline}</p>
                            )}
                        </div>

                        {/* Ratings & Sales */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center text-yellow-500">
                                <Star size={12} className="fill-current" />
                                <span className="text-[11px] font-bold text-gray-700 ml-1">{rating}</span>
                            </div>
                            <span className="text-[11px] text-gray-400">({(reviewsCount || 0).toLocaleString()} reviews)</span>
                            <div className="h-3 w-px bg-gray-200 mx-1" />
                            <span className="text-[10px] font-medium text-gray-600">5K+ bought</span>
                        </div>

                        {/* Pricing */}
                        <div className="mt-auto space-y-1.5">
                            <div className="flex items-baseline flex-wrap gap-x-2">
                                <span className="text-2xl font-black text-black tracking-tight">Rs. {price.toLocaleString()}</span>
                                {originalPrice && (
                                    <>
                                        <span className="text-xs text-gray-400 line-through">M.R.P: Rs. {originalPrice.toLocaleString()}</span>
                                        <span className="text-xs font-bold text-rose-600">({Math.round(((originalPrice - price) / originalPrice) * 100)}% off)</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </MotionDiv>
        );
    }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
