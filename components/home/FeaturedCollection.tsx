import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../../constants';
import * as RouterDOM from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import QuickViewModal from '../QuickViewModal';
import ProductCard from '../ProductCard';
import { useCart } from '../../context/CartContext';

const { NavLink, useNavigate } = RouterDOM as any;

const FeaturedCollection: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, products } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  const MotionDiv = (motion as any).div;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-fario-purple text-[10px] font-black uppercase tracking-[0.4em] mb-2 block italic">Curation Node</span>
            <h2 className="text-4xl md:text-5xl font-black font-heading text-fario-dark tracking-tighter uppercase italic leading-[0.9]">
              Essential <span className="text-transparent bg-clip-text bg-gradient-to-r from-fario-purple to-indigo-600">Deployments</span>
            </h2>
          </div>
          <NavLink to="/products" className="hidden md:flex items-center gap-3 font-black text-fario-dark text-[10px] uppercase tracking-widest group bg-gray-50 px-6 py-3 rounded-xl hover:bg-fario-dark hover:text-white transition-all shadow-sm">
            Full Inventory <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </NavLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode="grid"
              onAddToCart={(e) => {
                e.stopPropagation();
                addToCart(product, 'OS'); // Default size for quick add
              }}
              navigate={navigate}
            />
          ))}
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
};

export default FeaturedCollection;