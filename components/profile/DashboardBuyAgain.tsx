import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { PRODUCTS } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartProvider';

export const DashboardBuyAgain: React.FC = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const buyAgainProducts = [
        PRODUCTS.find(p => p.id === 'p2'),
        PRODUCTS.find(p => p.id === 'p4')
    ].filter(Boolean);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-full flex flex-col hover:shadow-lg hover:border-gray-200 transition-all duration-300">
            <div className="mb-8">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    Buy Again <Clock size={16} className="text-gray-400" strokeWidth={2.5} />
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1">Quickly reorder your essentials</p>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
                {buyAgainProducts.map((product: any) => (
                    <div key={product.id} className="flex flex-col h-full group/card relative">
                        <div
                            className="aspect-square bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-4 group-hover/card:border-fario-purple/30 transition-all cursor-pointer flex items-center justify-center text-center overflow-hidden"
                            onClick={() => navigate(`/products/${product.id}`)}
                        >
                            <div className="absolute inset-0 bg-fario-purple/0 group-hover/card:bg-fario-purple/5 transition-colors duration-500"></div>
                            <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover/card:scale-110 group-hover/card:-rotate-2 transition-transform duration-500 ease-out z-10" />
                        </div>

                        <p
                            className="text-sm font-bold text-gray-900 truncate mb-1 cursor-pointer group-hover/card:text-fario-purple transition-colors"
                            onClick={() => navigate(`/products/${product.id}`)}
                        >
                            {product.name}
                        </p>
                        <p className="text-sm font-medium text-gray-500 mb-4">Rs. {product.price}</p>

                        <button
                            onClick={() => addToCart(product, "Default")}
                            className="mt-auto w-full py-2.5 bg-fario-purple text-white rounded-lg text-xs font-bold hover:bg-fario-teal transition-all flex items-center justify-center gap-1.5 shadow-md shadow-fario-purple/20 active:scale-95 transform"
                        >
                            <Plus size={14} strokeWidth={3} /> Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
