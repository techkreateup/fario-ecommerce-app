import React, { useEffect, useState } from 'react';

import { EnhancedProduct, PRODUCTS } from '../constants';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartProvider';



interface Props {
    currentId: string;
}

const RecentlyViewed: React.FC<Props> = ({ currentId }) => {
    const { addToCart } = useCart();
    const [history, setHistory] = useState<EnhancedProduct[]>([]);

    useEffect(() => {
        // Load history
        const saved = localStorage.getItem('fario_view_history');
        let ids: string[] = [];
        try {
            ids = saved ? JSON.parse(saved) : [];
            if (!Array.isArray(ids)) ids = [];
        } catch (e) {
            console.error("Failed to parse view history", e);
            ids = [];
        }

        // Add current if not present, move to top if present
        ids = ids.filter(id => id !== currentId);
        ids.unshift(currentId);

        // Limit to 4 for a cleaner grid in this section
        ids = ids.slice(0, 4);

        localStorage.setItem('fario_view_history', JSON.stringify(ids));

        // Resolve products
        const foundProducts = ids
            .map(id => PRODUCTS.find(p => p.id === id))
            .filter((p): p is EnhancedProduct => p !== undefined && p.id !== currentId); // Exclude current from display list

        setHistory(foundProducts);
    }, [currentId]);

    if (history.length === 0) return null;

    return (
        <div className="mt-16 border-t border-gray-100 pt-16">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 pl-1">
                Your Browsing History
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {history.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        viewMode="grid"
                        onAddToCart={(e) => {
                            e.stopPropagation();
                            addToCart(product, 'OS');
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
