import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Package
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartProvider';
import PageNav from '../components/PageNav';

import ProductCard from '../components/ProductCard';



const CollectionsPage: React.FC = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const { products, addToCart } = useCart();

  const [activeCategory] = useState<string>('All');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = activeCategory === 'All' || product.category === activeCategory;
      return searchMatch && categoryMatch;
    });
  }, [products, searchTerm, activeCategory]);

  const MotionDiv = (motion as any).div;

  return (
    <div className="pt-24 pb-32 min-h-screen bg-white relative">
      <div className="container mx-auto px-6 relative z-10">

        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-6 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="shrink-0 scale-90 -ml-2">
              <PageNav />
            </div>
            <div className="border-l border-slate-100 pl-6 space-y-1">
              <h1 className="text-3xl font-black font-heading text-fario-dark uppercase tracking-tighter italic leading-none">The Archives</h1>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] leading-none">Access Granted // Node 0x7F2</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-96">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Scan Registry Node..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-fario-purple/10 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <MotionDiv
              key={`${activeCategory}-${searchTerm}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product as any}
                  onAddToCart={(e) => {
                    e.stopPropagation();
                    addToCart(product, product.sizes?.[0] || 'OS');
                  }}
                />
              ))}
            </MotionDiv>
          ) : (
            <div className="py-48 text-center bg-slate-50 rounded-[4rem] border border-dashed border-slate-200">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-slate-100 shadow-inner">
                <Package size={40} />
              </div>
              <h2 className="text-2xl font-black uppercase italic text-slate-300 tracking-tighter">No Linked Assets Located</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Reconfigure search matrix or purge filters</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CollectionsPage;
