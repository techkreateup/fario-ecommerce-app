import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Search,
  SlidersHorizontal, X, RotateCcw,
  LayoutGrid, List, ChevronDown
} from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartProvider';
import { EnhancedProduct } from '../constants';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';



// Helper hook for debounced value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Product listing page
const Products: React.FC = () => {
  const { addToCart, products: contextProducts, isLoading: contextLoading } = useCart();
  const { searchTerm: globalSearchTerm, setSearchTerm: setGlobalSearchTerm } = useSearch();

  // State
  // Use context products directly. 
  // If we wanted local sort/filter state only, we derive from contextProducts.
  const [searchTerm, setSearchTerm] = useState(globalSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Loading state derived from context
  const loading = contextLoading;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // The source of truth is the context (which has real-time updates)
  const allProducts = contextProducts;

  // Filters State
  const [filters, setFilters] = useState({
    categories: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    priceRange: 'All'
  });

  const [sortOption, setSortOption] = useState('newest');
  // Wishlist state moved to CartContext

  // Unique Options generation - Parse JSONB arrays properly
  const allCategories = useMemo(() => Array.from(new Set(allProducts.map(p => p.category))), [allProducts]);

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    allProducts.forEach(p => {
      const productColors = Array.isArray(p.colors) ? p.colors :
        typeof p.colors === 'string' ? JSON.parse(p.colors) : [];
      productColors.forEach((c: string) => colors.add(c));
    });
    return Array.from(colors);
  }, [allProducts]);

  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    allProducts.forEach(p => {
      const productSizes = Array.isArray(p.sizes) ? p.sizes :
        typeof p.sizes === 'string' ? JSON.parse(p.sizes) : [];
      productSizes.forEach((s: string) => sizes.add(s));
    });
    return Array.from(sizes);
  }, [allProducts]);

  // Sync Search with Global
  useEffect(() => {
    setGlobalSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setGlobalSearchTerm]);

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Filter Logic
  const filteredSortedProducts = useMemo(() => {

    let result = allProducts.filter(p => {
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const tag = (p.tagline || '').toLowerCase();
      const term = debouncedSearchTerm.toLowerCase();

      const matchSearch = !term || name.includes(term) || desc.includes(term) || cat.includes(term) || tag.includes(term);

      const matchCategory = filters.categories.length === 0 || filters.categories.includes(p.category);

      // Parse colors and sizes from JSONB
      const productColors = Array.isArray(p.colors) ? p.colors :
        typeof p.colors === 'string' ? JSON.parse(p.colors) : [];
      const productSizes = Array.isArray(p.sizes) ? p.sizes :
        typeof p.sizes === 'string' ? JSON.parse(p.sizes) : [];

      const matchColor = filters.colors.length === 0 || productColors.some((c: string) => filters.colors.includes(c));
      const matchSize = filters.sizes.length === 0 || productSizes.some((s: string) => filters.sizes.includes(s));

      let matchPrice = true;
      if (filters.priceRange === 'Budget') matchPrice = p.price < 5000;
      if (filters.priceRange === 'Mid') matchPrice = p.price >= 5000 && p.price <= 10000;
      if (filters.priceRange === 'Premium') matchPrice = p.price > 10000;

      return matchSearch && matchCategory && matchColor && matchSize && matchPrice;
    });

    // Sorting
    switch (sortOption) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break; // newest assumed default order
    }

    return result;
  }, [allProducts, debouncedSearchTerm, filters, sortOption]);


  // Pagination Logic
  const visibleProducts = useMemo(() => {
    const end = page * 12;
    return filteredSortedProducts.slice(0, end);
  }, [filteredSortedProducts, page]);

  useEffect(() => {
    const end = page * 12;
    setHasMore(end < filteredSortedProducts.length);
  }, [filteredSortedProducts.length, page]);

  // Handlers
  const toggleFilter = (type: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[type] as string[];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      const newFilters = { ...prev, [type]: updated };
      localStorage.setItem('fario_filters', JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const setPriceRange = (range: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, priceRange: range };
      localStorage.setItem('fario_filters', JSON.stringify(newFilters));
      return newFilters;
    });
  };


  const handleAddToCart = (product: EnhancedProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 'OS', product.colors?.[0] || 'Default');
  };

  const clearFilters = () => {
    const reset = { categories: [], colors: [], sizes: [], priceRange: 'All' };
    setFilters(reset);
    localStorage.setItem('fario_filters', JSON.stringify(reset));
    setSearchTerm('');
  };

  const MotionDiv = (motion as any).div;

  // REUSABLE FILTER CONTENT - REFINED "FANCY & SIMPLE" AESTHETIC
  const FilterContent = ({ isSidebar = false }: { isSidebar?: boolean }) => (
    <div className={`flex flex-col gap-8 ${isSidebar ? 'pb-20' : ''}`}>

      {/* Category Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Shop by Category</h3>
          <p className="text-[10px] text-gray-400 font-medium">Filter products by type</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleFilter('categories', cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${filters.categories.includes(cat)
                ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105'
                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:text-gray-900'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Price Range</h3>
          <p className="text-[10px] text-gray-400 font-medium">Find products within your budget</p>
        </div>
        <div className="space-y-3">
          {['All', 'Budget', 'Mid', 'Premium'].map(range => {
            const label = range === 'All' ? 'Any Price' : range === 'Budget' ? 'Under ₹5,000' : range === 'Mid' ? '₹5,000 - ₹10,000' : 'Above ₹10,000';
            const isSelected = filters.priceRange === range;
            return (
              <button
                key={range}
                onClick={() => setPriceRange(range)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all group ${isSelected
                  ? 'bg-gray-50 border-gray-900 shadow-sm'
                  : 'bg-white border-transparent hover:bg-gray-50'
                  }`}
              >
                <span className={`text-[11px] font-bold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-gray-900' : 'border-gray-300'}`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Colors */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Available Colors</h3>
          <p className="text-[10px] text-gray-400 font-medium">Select your preferred color</p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {allColors.map(color => {
            const colorMap: Record<string, string> = {
              'Black': '#000000', 'White': '#ffffff', 'Lime': '#d9ff00',
              'Purple': '#7a51a0', 'Blue': '#2563eb', 'Grey': '#71717a',
              'Orange': '#f97316', 'Navy': '#000080', 'Red': '#dc2626',
              'Olive': '#808000', 'Charcoal': '#36454F'
            };
            const bg = colorMap[color] || color;
            const isSelected = filters.colors.includes(color);

            return (
              <button
                key={color}
                className="group flex flex-col items-center gap-2"
                onClick={() => toggleFilter('colors', color)}
              >
                <div
                  className={`w-10 h-10 rounded-full border transition-all flex items-center justify-center p-0.5 ${isSelected
                    ? 'border-gray-900 ring-2 ring-gray-900/10 scale-110'
                    : 'border-transparent hover:border-gray-200'
                    }`}
                >
                  <div
                    className="w-full h-full rounded-full shadow-inner border border-black/5 relative overflow-hidden"
                    style={{ backgroundColor: bg }}
                  >
                    {/* Checkmark for white/light colors if needed, or keeping it clean */}
                  </div>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-tight text-center leading-tight transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  {color}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Size Grid */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Size Selection</h3>
          <p className="text-[10px] text-gray-400 font-medium">Choose your perfect fit</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {allSizes.map(size => {
            const isSelected = filters.sizes.includes(size);
            const cleanSize = size.replace('UK ', '');
            return (
              <button
                key={size}
                onClick={() => toggleFilter('sizes', size)}
                className={`aspect-square rounded-xl flex items-center justify-center text-[12px] font-black transition-all border ${isSelected
                  ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-900'
                  }`}
              >
                {cleanSize}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear/Reset */}
      <div className="pt-4 sticky bottom-0 bg-gradient-to-t from-gray-50 to-transparent pb-4">
        <button
          onClick={clearFilters}
          className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          <RotateCcw size={14} /> Clear All Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 font-sans text-gray-800 relative isolate">
      {/* EVOLUTION MESH BACKGROUND - CLEAN PERFORMANCE AESTHETIC */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        {/* Soft Multi-Tone Atmosphere */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle,rgba(122,81,160,0.06)_0%,transparent_70%)] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(79,209,199,0.04)_0%,transparent_70%)] blur-[140px]" />

        {/* Architectural Diagonal Mesh */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #7a51a0 0px, #7a51a0 1px, transparent 1px, transparent 40px),
                             repeating-linear-gradient(-45deg, #7a51a0 0px, #7a51a0 1px, transparent 1px, transparent 40px)`
          }}
        />

        {/* Subtle Depth Diffuser */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/50 pointer-events-none" />
      </div>

      <div className="container mx-auto px-2 md:px-6 max-w-[1600px] relative">

        {/* TOP BAR */}
        <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 mb-4 flex flex-wrap gap-4 items-center justify-between transition-all">
          <div className="flex items-center gap-4 flex-grow max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fario-purple transition-colors" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-gray-200 text-sm font-black uppercase tracking-widest focus:border-fario-purple outline-none transition-all placeholder:text-gray-300 italic"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Layout</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'text-fario-purple bg-fario-purple/10' : 'text-gray-300 hover:text-gray-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'text-fario-purple bg-fario-purple/10' : 'text-gray-400 hover:text-gray-900'}`}
              >
                <List size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-transparent text-[10px] font-black uppercase tracking-widest py-1 pr-6 cursor-pointer focus:outline-none text-black border-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Value: Low-High</option>
                  <option value="price-high">Value: High-Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterPanelOpen(true)}
              className="lg:hidden flex items-center justify-center p-2 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* ACTIVE FILTERS BAR */}
        <AnimatePresence>
          {(filters.categories.length > 0 || filters.colors.length > 0 || filters.sizes.length > 0 || filters.priceRange !== 'All') && (
            <MotionDiv
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 mb-8 items-center"
            >
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mr-2">Active Filters:</span>

              {filters.categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleFilter('categories', cat)}
                  className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500 transition-colors"
                >
                  {cat} <X size={10} />
                </button>
              ))}

              {filters.colors.map(color => (
                <button
                  key={color}
                  onClick={() => toggleFilter('colors', color)}
                  className="px-3 py-1.5 border border-gray-800 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:border-rose-500 hover:text-rose-500 transition-colors"
                >
                  Color: {color} <X size={10} />
                </button>
              ))}

              {filters.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => toggleFilter('sizes', size)}
                  className="px-3 py-1.5 border border-gray-800 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:border-rose-500 hover:text-rose-500 transition-colors"
                >
                  Size: {size} <X size={10} />
                </button>
              ))}

              {filters.priceRange !== 'All' && (
                <button
                  onClick={() => setPriceRange('All')}
                  className="px-3 py-1.5 bg-fario-purple text-white rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500 transition-colors"
                >
                  {filters.priceRange} Range <X size={10} />
                </button>
              )}

              <button
                onClick={clearFilters}
                className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-2 hover:underline"
              >
                Reset All
              </button>
            </MotionDiv>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* DESKTOP SIDEBAR (LEFT SIDE) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-40 space-y-8 pr-4">
            <div className="pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            </div>
            <FilterContent isSidebar={true} />
          </div>

          {/* MAIN GRID */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex justify-center py-40">
                <LoadingSpinner size="lg" message="Loading inventory..." color="#6366f1" />
              </div>
            ) : filteredSortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-300" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
                <button onClick={clearFilters} className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all shadow-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-1.5 md:gap-x-6 md:gap-y-10' : 'flex flex-col gap-6'}>
                <AnimatePresence mode="popLayout">
                  {visibleProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      onAddToCart={(e) => handleAddToCart(product, e)}
                      ref={index === visibleProducts.length - 1 ? lastElementRef : null}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER MODAL */}
      <AnimatePresence>
        {isFilterPanelOpen && (
          <>
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterPanelOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] lg:hidden"
            />
            <MotionDiv
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-[101] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button onClick={() => setIsFilterPanelOpen(false)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto p-6">
                <FilterContent />
              </div>
              <div className="p-6 border-t border-gray-100 bg-white">
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium text-sm shadow-md active:scale-95 transition-transform"
                >
                  Show Results
                </button>
              </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Removed unused FilterSection


export default Products;
