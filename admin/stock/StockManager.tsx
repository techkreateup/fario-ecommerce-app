
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, Layers,
  RotateCcw, CheckCircle2, X, AlertCircle, Trash2,
  AlertTriangle, ArrowRight, Plus
} from 'lucide-react';
import AddProductModal from './AddProductModal';
import { useCart } from '../../context/CartProvider';
import StockStats from './StockStats';
import StockTable from './StockTable';
import BulkModal from './BulkModal';
import * as RouterDOM from 'react-router-dom';

const { useNavigate } = RouterDOM as any;

type FilterType = 'All' | 'Low Stock' | 'Out of Stock' | 'Shoes' | 'Bags';

import { deepSearch } from '../../lib/searchUtils';

const StockManager: React.FC = () => {
  const navigate = useNavigate();
  // Use location to parse search params manually if useSearchParams is unavailable or causing issues,
  // but preferably use useSearchParams if react-router-dom version supports it.
  // Given the imports in the file, we can access useLocation.
  const location = (RouterDOM as any).useLocation();

  const { products, updateProduct, deleteProduct } = useCart();

  // Local State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize Search from URL
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    if (q) {
      setSearchQuery(q);
      // Optional: Open relevant filter if needed, but deep search handles it
    }
  }, [location.search]);

  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Config from Control Center
  const lowStockThreshold = parseInt(localStorage.getItem('fario_stock_threshold') || '10');
  const autoHideStock = localStorage.getItem('fario_autohide_stock') === 'true';

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search
    if (searchQuery) {
      result = result.filter(p => deepSearch(p, searchQuery));
    }

    // Filter
    switch (activeFilter) {
      case 'Low Stock':
        result = result.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < lowStockThreshold);
        break;
      case 'Out of Stock':
        result = result.filter(p => (p.stockQuantity || 0) === 0);
        break;
      case 'Shoes':
      case 'Bags':
        result = result.filter(p => p.category === activeFilter);
        break;
    }

    return result;
  }, [products, searchQuery, activeFilter, lowStockThreshold, autoHideStock]);

  // Low Stock Calculation for Banner
  const lowStockCount = useMemo(() => {
    return products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < lowStockThreshold).length;
  }, [products, lowStockThreshold]);

  // Handlers
  const handleUpdateStock = async (id: string, qty: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      try {
        await updateProduct({
          ...product,
          stockQuantity: qty,
          inStock: qty > 0
        });

        // Show immediate notification
        showNotification(`✅ Stock saved successfully! Now: ${qty} units`);

      } catch (error) {
        showNotification(`❌ ERROR: Failed to save stock - ${error}`);
      }
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      showNotification('Product removed from catalog');
      setDeleteId(null);
      // Remove from selection if it was selected
      if (selectedIds.includes(deleteId)) {
        setSelectedIds(prev => prev.filter(id => id !== deleteId));
      }
    }
  };

  const handleBulkUpdate = (action: 'add' | 'subtract' | 'set', value: number) => {
    selectedIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        let newQty = product.stockQuantity || 0;
        if (action === 'add') newQty += value;
        if (action === 'subtract') newQty = Math.max(0, newQty - value);
        if (action === 'set') newQty = value;

        updateProduct({
          ...product,
          stockQuantity: newQty,
          inStock: newQty > 0
        });
      }
    });
    showNotification(`Bulk update applied to ${selectedIds.length} items`);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      showNotification('No data available to export');
      return;
    }

    // Define headers
    const headers = ['ID', 'Name', 'Category', 'Price', 'Stock Quantity', 'Status', 'Image URL'];

    // Map data
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(p => {
        const status = (p.stockQuantity || 0) > 0 ? 'In Stock' : 'Out of Stock';
        // Escape quotes if necessary and handle commas in content by wrapping in quotes
        const escape = (str: string | number) => `"${String(str).replace(/"/g, '""')}"`;

        return [
          escape(p.id),
          escape(p.name),
          escape(p.category),
          escape(p.price),
          escape(p.stockQuantity || 0),
          escape(status),
          escape(p.image)
        ].join(',');
      })
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fario_stock_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Export successful');
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Cast motion components
  const MotionDiv = (motion as any).div;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32 relative">

      {/* Sticky Banner for Low Stock */}
      <AnimatePresence>
        {showBanner && lowStockCount > 0 && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sticky top-20 z-40 bg-amber-50 border-b border-amber-100 -mx-6 md:-mx-10 px-6 md:px-10 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 text-amber-800">
              <AlertTriangle size={18} className="animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">
                {lowStockCount} Items Low on Stock – Urgent Restock Recommended
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveFilter('Low Stock')}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-700 hover:text-amber-900 underline underline-offset-4"
              >
                View Inventory <ArrowRight size={12} />
              </button>
              <button onClick={() => setShowBanner(false)} className="text-amber-400 hover:text-amber-700">
                <X size={14} />
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <MotionDiv
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0 }}
            className="fixed top-10 left-1/2 z-[3000] px-6 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500"
          >
            <CheckCircle2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">{notification}</span>
            <button onClick={() => setNotification(null)}><X size={14} /></button>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 italic">Real-time Logistics</p>
          </div>
          <h1 className="text-4xl font-black font-heading italic tracking-tighter text-slate-900 leading-none">Stock Control Center</h1>
          <p className="text-gray-400 text-sm font-medium mt-2">Manage inventory levels, alerts, and valuation metrics.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl active:scale-95"
          >
            <Plus size={16} /> Add Product
          </button>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                navigate('/admin/products');
              }}
              className="px-6 py-3 bg-fario-purple text-white rounded-xl text-xs font-bold hover:bg-fario-purple/90 transition-all flex items-center gap-2 shadow-xl shadow-fario-purple/20"
            >
              <RotateCcw size={16} /> Back to Registry
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-gray-50 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <StockStats products={products} />

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-24 z-30">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            type="text"
            placeholder="Search by Name, SKU or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {(['All', 'Low Stock', 'Out of Stock', 'Shoes', 'Bags'] as FilterType[]).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeFilter === filter
                ? 'bg-slate-800 text-white border-slate-800 shadow-lg'
                : 'bg-white text-slate-400 border-gray-100 hover:border-gray-200'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-emerald-600 text-white p-4 rounded-xl flex items-center justify-between shadow-xl shadow-emerald-600/20"
          >
            <div className="flex items-center gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold">{selectedIds.length} Selected</span>
              <p className="text-xs font-medium opacity-90">Manage selection in bulk</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedIds([])}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="px-6 py-2 bg-white text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-2"
              >
                <Layers size={14} /> Update Stock
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Data Table */}
      <StockTable
        products={filteredProducts}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={(ids) => setSelectedIds(ids)}
        onUpdateStock={handleUpdateStock}
        onDeleteProduct={(id) => setDeleteId(id)}
      />

      {/* Bulk Modal */}
      <BulkModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedCount={selectedIds.length}
        onConfirm={handleBulkUpdate}
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <MotionDiv
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic mb-2">Delete Product?</h3>
              <p className="text-sm text-gray-500 font-medium mb-8">
                This action cannot be undone. The product will be permanently removed from the catalog.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-600 shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockManager;
