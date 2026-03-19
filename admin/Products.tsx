
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Edit2, Trash2, Package
} from 'lucide-react';
import { useCart } from '../context/CartProvider';
import { EnhancedProduct } from '../constants';
import AddProductModal from './stock/AddProductModal';

const AdminProducts: React.FC = () => {
  const { products, deleteProduct } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EnhancedProduct | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // ... existing filter logic ...
      // 1. Search Term
      const q = searchTerm.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.tagline || '').toLowerCase().includes(q);

      return matchesSearch;
    });
  }, [products, searchTerm]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this product from the catalog?')) {
      deleteProduct(id);
    }
  };

  const handleEditInit = (product: EnhancedProduct) => {
    setEditingProduct(product);
    setIsAddingProduct(true);
  };

  const handleAddInit = () => {
    setEditingProduct(null);
    setIsAddingProduct(true);
  };

  // Cast motion components
  const MotionDiv = (motion as any).div;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24 max-w-7xl mx-auto px-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-fario-purple shadow-[0_0_12px_#7a51a0] animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-fario-purple italic">Catalog Management</p>
          </div>
          <h1 className="text-4xl font-black font-heading italic tracking-tighter text-slate-900 leading-none">Product Registry</h1>
          <p className="text-gray-400 text-sm font-medium mt-2">Manage inventory assets, pricing, and visual presentation.</p>
        </div>
        <button
          onClick={handleAddInit}
          className="flex items-center gap-3 px-8 py-3.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
        >
          <Plus size={18} /> Add New Asset
        </button>
      </header>

      {/* TOP FILTERS BAR */}
      <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 space-y-4 md:space-y-0 sticky top-24 z-30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Search */}
          <div className="relative w-full md:w-80 flex-shrink-0">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search SKU, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-fario-purple/10 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
            {/* Filters removed as requested */}
          </div>
        </div>
      </div>


      {/* RICH LIST VIEW */}
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {filteredProducts.map((p) => (
            <MotionDiv
              key={p.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all p-2 pr-6 group flex flex-col md:flex-row items-center gap-6"
            >
              {/* Image Section */}
              <div className="relative w-full md:w-48 aspect-[4/3] md:aspect-square bg-gray-50 rounded-[1.5rem] flex-shrink-0 overflow-hidden border border-gray-50">
                <div className="absolute top-3 left-3 z-10 flex gap-1">
                  <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest backdrop-blur-md border shadow-sm ${p.inStock ? 'bg-white/80 text-emerald-600 border-emerald-100' : 'bg-white/80 text-rose-500 border-rose-100'}`}>
                    {p.inStock ? 'Active' : 'Stockout'}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 z-10">
                  <span className="px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest backdrop-blur-md border shadow-sm bg-white/80 text-slate-500 border-gray-100">
                    Qty: {p.stockQuantity}
                  </span>
                </div>
                <img src={p.image} className="w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-110 transition-transform duration-500" alt={p.name} />
              </div>

              {/* Info Section */}
              <div className="flex-grow text-center md:text-left py-2 space-y-3 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="px-2 py-1 bg-fario-purple/5 text-fario-purple rounded-md text-[9px] font-black uppercase tracking-[0.2em]">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-300 font-bold">{p.id}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black font-heading italic text-slate-900 leading-none mb-1">{p.name}</h3>
                  <p className="text-xs font-bold text-gray-400 line-clamp-1">{p.tagline || 'No tagline set'}</p>
                </div>

                <p className="text-[11px] text-gray-500 line-clamp-2 max-w-2xl leading-relaxed hidden md:block">
                  {p.description || 'No description available for this asset.'}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Unit Price</p>
                    <p className="text-xl font-black text-slate-900 italic tracking-tighter leading-none">Rs. {p.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex md:flex-col gap-2 flex-shrink-0 w-full md:w-auto justify-center pb-4 md:pb-0 border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 pl-0 md:pl-6">
                <button
                  onClick={() => handleEditInit(p)}
                  className="w-12 h-12 rounded-2xl bg-gray-50 text-slate-500 hover:bg-fario-dark hover:text-white transition-all flex items-center justify-center border border-gray-100 shadow-sm"
                  title="Edit Details"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="w-12 h-12 rounded-2xl bg-white text-rose-200 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center border border-gray-100 hover:border-rose-100 shadow-sm"
                  title="Delete Asset"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </MotionDiv>
          ))}
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-gray-100 border-dashed">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Package size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 uppercase italic">No Assets Found</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Adjust your filters</p>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={isAddingProduct}
        onClose={() => setIsAddingProduct(false)}
        productToEdit={editingProduct}
      />
    </div >
  );
};

export default AdminProducts;
