import React, { useMemo } from 'react';
import { Plus, Check } from 'lucide-react';
import { EnhancedProduct, PRODUCTS } from '../constants';
import { useCart } from '../context/CartProvider';

import { useToast } from '../context/ToastContext';

interface Props {
    mainProduct: EnhancedProduct;
}

const FrequentlyBoughtTogether: React.FC<Props> = ({ mainProduct }) => {
    const { addToCart } = useCart();
    const toast = useToast();

    // Smart Suggestion Logic
    const suggestedProduct = useMemo(() => {
        // If it's a Shoe, suggest Socks
        if (mainProduct.category === 'Shoes' || mainProduct.category === 'School Shoes') {
            return PRODUCTS.find(p => p.category === 'Socks');
        }
        // If it's a Bag, suggest a Bottle or Tag (Mocking with Kids Shoe for now as accessory alternative or just another relevant item)
        // For now, let's suggest the "Bag" if viewing "Kids", or "Shoes" if viewing "Socks"
        return PRODUCTS.find(p => p.id !== mainProduct.id && p.category !== mainProduct.category);
    }, [mainProduct]);

    if (!suggestedProduct) return null;

    const totalPrice = mainProduct.price + suggestedProduct.price;
    const totalOriginal = (mainProduct.originalPrice || 0) + (suggestedProduct.originalPrice || 0);

    const handleAddBundle = () => {
        addToCart(mainProduct as any, mainProduct.sizes?.[0] || 'OS', mainProduct.colors?.[0] || 'Default');
        addToCart(suggestedProduct as any, suggestedProduct.sizes?.[0] || 'OS', suggestedProduct.colors?.[0] || 'Default');
        toast.success('Bundle successfully added to your cart!');
    };

    return (
        <div className="border border-gray-200 rounded-3xl p-6 md:p-8 bg-gray-50/50 my-16">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 pl-1">
                Complete The Loadout
            </h3>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Visual Pair */}
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl border border-gray-200 p-2 relative shadow-sm">
                        <img src={mainProduct.image} alt={mainProduct.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="text-gray-300">
                        <Plus size={24} strokeWidth={4} />
                    </div>
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl border border-gray-200 p-2 relative shadow-sm">
                        <img src={suggestedProduct.image} alt={suggestedProduct.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                </div>

                {/* Info & Action */}
                <div className="flex-grow flex flex-col md:flex-row justify-between items-center w-full gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-500 rounded-full text-white">
                                <Check size={10} strokeWidth={4} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{mainProduct.name}</p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Main Item</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-gray-200 rounded-full text-gray-500">
                                <Check size={10} strokeWidth={4} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{suggestedProduct.name}</p>
                                <p className="text-[10px] font-bold text-fario-purple uppercase tracking-wider">
                                    + Rs. {suggestedProduct.price} <span className="text-gray-400 line-through ml-1">Rs. {suggestedProduct.originalPrice}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="mb-3 text-right">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Bundle</span>
                            <div className="flex items-baseline justify-end gap-2">
                                <span className="text-2xl font-black text-gray-900 tracking-tight">Rs. {totalPrice}</span>
                                {totalOriginal > 0 && <span className="text-sm font-bold text-gray-400 line-through">Rs. {totalOriginal}</span>}
                            </div>
                        </div>
                        <button
                            onClick={handleAddBundle}
                            className="bg-gray-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-fario-purple transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                        >
                            <Check size={14} /> Add Bundle to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrequentlyBoughtTogether;
