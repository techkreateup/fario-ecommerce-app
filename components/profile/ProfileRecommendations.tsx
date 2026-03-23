import React from 'react';
import { Plus, Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, EnhancedProduct } from '../../constants';
import { useCart } from '../../context/CartProvider';

export const ProfileRecommendations: React.FC = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Explicitly filtering for the 4 specific products requested by user in exact order
    const displayProducts = [
        PRODUCTS.find(p => p.id === 'p3'),
        PRODUCTS.find(p => p.id === 'p4'),
        PRODUCTS.find(p => p.id === 'p1'),
        PRODUCTS.find(p => p.id === 'p2')
    ].filter(Boolean) as EnhancedProduct[];

    return (
        <div className="space-y-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Recommended for You</h3>
                <div className="hidden md:flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-800"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 flex flex-col h-full group relative"
                    >
                        {/* Dense Discount / Top Pick Badge */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                            {index < 2 && (
                                <div className="bg-gray-900 text-white text-[10px] from-neutral-800 font-black uppercase px-2 py-0.5 rounded shadow-md">Top Pick</div>
                            )}
                            {product.discountLabel && (
                                <div className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-md">{product.discountLabel}</div>
                            )}
                        </div>

                        {/* Image Area */}
                        <div
                            className="aspect-[4/3] bg-gray-50 rounded-lg mb-4 p-4 flex items-center justify-center cursor-pointer overflow-hidden relative"
                            onClick={() => navigate(`/products/${product.id}`)}
                        >
                            <img
                                src={product.image}
                                className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 group-hover:rotate-1 transition-transform duration-500 ease-out"
                                alt={product.name}
                            />
                        </div>

                        {/* Dense Info Stack */}
                        <div className="flex-1 flex flex-col min-w-0">
                            {/* Title & Reviews */}
                            <h4
                                className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 cursor-pointer group-hover:text-fario-purple transition-colors"
                                onClick={() => navigate(`/products/${product.id}`)}
                            >
                                {product.name}
                            </h4>

                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" strokeWidth={0} />)}
                                </div>
                                <span className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">{product.reviewsCount?.toLocaleString() || 65}</span>
                            </div>

                            {/* Monthly Sales Social Proof */}
                            {product.monthlySales && (
                                <p className="text-[10px] text-gray-500 font-medium mb-2">{product.monthlySales}</p>
                            )}

                            {/* Price Block */}
                            <div className="mt-auto pt-2 border-t border-gray-50">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-lg font-black text-gray-900 tracking-tight">Rs. {product.price}</span>
                                    <span className="text-xs text-gray-400 font-medium line-through">Rs. {product.originalPrice}</span>
                                </div>

                                {/* Prime & Delivery - The "Amazon Density" */}
                                <div className="space-y-1 mb-3">
                                    <p className="text-[10px] text-gray-700 font-bold flex items-center gap-1">
                                        <CheckCircle2 size={10} className="text-fario-purple" />
                                        <span className="text-fario-purple">Prime</span> Get it by <span className="text-gray-900">{product.deliveryInfo?.split('delivery ')[1] || 'Tomorrow'}</span>
                                    </p>
                                    <p className="text-[10px] text-gray-500 truncate">FREE Delivery by Fario</p>
                                </div>

                                <button
                                    onClick={() => addToCart(product, "Default")}
                                    className="w-full py-2 bg-fario-purple text-white rounded-lg text-xs font-bold hover:bg-fario-teal transition-all shadow-md shadow-fario-purple/10 active:scale-95 flex items-center justify-center gap-1"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
