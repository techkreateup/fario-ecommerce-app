
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Star, Check } from 'lucide-react';
import Button from './Button';
import { EnhancedProduct } from '../constants';
import { useCart } from '../context/CartProvider';
import * as RouterDOM from 'react-router-dom';

const { useNavigate } = RouterDOM as any;

interface QuickViewModalProps {
  product: EnhancedProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!product || !isOpen) return null;

  const sizes = product.sizes || ['UK 6', 'UK 7', 'UK 8', 'UK 9'];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, product.colors?.[0] || 'Default');
    onClose();
    navigate('/orders');
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/products/${product.id}`);
  }

  // Cast motion components
  const MotionDiv = (motion as any).div;
  const MotionImg = (motion as any).img;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-fario-dark hover:text-white transition-colors text-slate-500 shadow-lg"
            >
              <X size={20} />
            </button>

            {/* Image Side */}
            <div className="w-full md:w-1/2 bg-gray-50 p-10 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-topo-pattern opacity-[0.05]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-fario-purple/5 rounded-full blur-[60px]" />
              <MotionImg
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl relative z-10"
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              />
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto scrollbar-hide bg-white">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-fario-purple/10 text-fario-purple rounded-full text-[9px] font-black uppercase tracking-[0.2em]">{product.category}</span>
                  {product.rating && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600">
                      <Star size={10} className="fill-fario-lime text-fario-lime" /> {product.rating}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-4xl font-black font-heading text-fario-dark uppercase italic leading-[0.9] mb-2">{product.name}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.tagline || 'Premium Gear'}</p>
              </div>

              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                {product.description.length > 150 ? `${product.description.substring(0, 150)}...` : product.description}
              </p>

              <div className="space-y-8 mb-8">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Size</span>
                    <span className="text-[9px] font-bold text-fario-purple underline cursor-pointer">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[60px] h-10 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center ${selectedSize === size ? 'border-fario-dark bg-fario-dark text-white shadow-lg scale-105' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end gap-3 pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Price</span>
                    <span className="text-3xl font-black text-fario-dark italic tracking-tighter">Rs. {product.price}</span>
                  </div>
                  {product.originalPrice && (
                    <span className="text-sm font-bold text-gray-300 line-through mb-1.5 ml-2">Rs. {product.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="mt-auto space-y-3 pt-6">
                <Button onClick={handleAddToCart} disabled={!selectedSize} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                  {selectedSize ? 'Add to Cart' : 'Select Size'}
                </Button>
                <button onClick={handleViewDetails} className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-fario-purple transition-colors flex items-center justify-center gap-2 group">
                  View Full Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
