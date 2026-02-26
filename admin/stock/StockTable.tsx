
import React, { useState, useMemo, memo } from 'react';
import { 
  Edit2, X, AlertTriangle, CheckCircle2, 
  Trash2, MoreHorizontal, Box, Footprints
} from 'lucide-react';
import { EnhancedProduct } from '../../constants';

interface StockTableProps {
  products: EnhancedProduct[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onUpdateStock: (id: string, qty: number) => void;
  onDeleteProduct: (id: string) => void;
}

interface ItemData {
  selectedIds: string[];
  onSelect: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (id: string, qty: number) => void;
  editingId: string | null;
  editValue: string;
  setEditValue: (val: string) => void;
  startEdit: (p: EnhancedProduct) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
}

const Row = memo(({ product, data }: { product: EnhancedProduct; data: ItemData }) => {
  const { 
    selectedIds, onSelect, onDeleteProduct, onUpdateStock,
    editingId, editValue, setEditValue, startEdit, saveEdit, cancelEdit
  } = data;
  
  const p = product;
  const isEditing = editingId === p.id;
  const isSelected = selectedIds.includes(p.id);
  const stockQty = p.stockQuantity || 0;

  // Determine Stock Status Color for Progress Bar
  const stockColor = stockQty === 0 ? 'bg-rose-500' : stockQty < 10 ? 'bg-amber-500' : 'bg-emerald-500';
  const progressWidth = Math.min(100, Math.max(5, (stockQty / 100) * 100)); // Cap at 100, min 5 for visibility

  return (
    <div className="px-4 py-2">
      <div 
        className={`flex items-center p-4 rounded-3xl border transition-all duration-300 ${
          isSelected 
            ? 'bg-fario-purple/5 border-fario-purple shadow-md' 
            : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-lg'
        }`}
      >
        {/* Checkbox */}
        <div className="w-[5%] min-w-[50px] flex justify-center">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => onSelect(p.id)}
            className="w-5 h-5 rounded-md border-gray-300 text-fario-purple focus:ring-fario-purple cursor-pointer transition-all"
          />
        </div>

        {/* Item Specs (Image + Details) */}
        <div className="w-[35%] min-w-[300px] px-6 flex items-center gap-6">
          {/* Thumbnail */}
          <div className="w-[50px] h-[50px] shrink-0 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
             {p.image ? (
               <img src={p.image} alt="" className="w-full h-full object-cover mix-blend-multiply" onError={(e) => (e.currentTarget.style.display = 'none')} />
             ) : (
               <Footprints size={20} className="text-gray-300" />
             )}
          </div>
          
          <div className="min-w-0 flex flex-col gap-1">
            <p className="text-sm font-black text-slate-800 truncate tracking-tight">{p.name}</p>
            <div className="flex items-center gap-3">
               <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[9px] font-black text-gray-500 uppercase tracking-widest border border-gray-200">
                 {p.id.toUpperCase()}
               </span>
               <span className="text-[10px] font-bold text-gray-400 truncate">{p.category}</span>
            </div>
          </div>
        </div>

        {/* Current Stock (Editable + Progress Bar) */}
        <div className="w-[20%] min-w-[180px] px-6">
          {isEditing ? (
            <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-200">
              <input 
                type="number" 
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-24 px-4 py-2 bg-white border-2 border-fario-purple rounded-xl text-xl font-black focus:outline-none shadow-sm"
                autoFocus
                min="0"
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              />
            </div>
          ) : (
            <div 
              onClick={() => startEdit(p)}
              className="cursor-pointer group/edit flex items-center gap-4 w-full"
              title="Click to edit stock"
            >
              <div className="flex flex-col gap-1 w-full max-w-[120px]">
                 <div className="flex justify-between items-end">
                    <span className={`text-2xl font-black leading-none tracking-tighter ${stockQty < 10 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {stockQty}
                    </span>
                    <Edit2 size={12} className="text-gray-300 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                 </div>
                 {/* Progress Bar */}
                 <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stockColor} transition-all duration-500 rounded-full`} 
                      style={{ width: `${progressWidth}%` }} 
                    />
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Availability Status */}
        <div className="w-[20%] min-w-[160px] px-6">
          {stockQty === 0 ? (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-wide">
              <X size={12} strokeWidth={4} /> Out of Stock
            </span>
          ) : stockQty < 10 ? (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-wide">
              <AlertTriangle size={12} strokeWidth={2.5} /> Low Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-wide">
              <CheckCircle2 size={12} strokeWidth={3} /> In Stock
            </span>
          )}
        </div>

        {/* Controls / Actions */}
        <div className="w-[20%] min-w-[160px] px-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={saveEdit} 
                className="w-9 h-9 flex items-center justify-center bg-emerald-50 text-white rounded-xl hover:bg-emerald-600 hover:scale-105 transition-all shadow-md shadow-emerald-500/20"
                title="Save Changes"
              >
                <CheckCircle2 size={16} />
              </button>
              <button 
                onClick={cancelEdit} 
                className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 hover:scale-105 transition-all"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
               <button 
                onClick={() => startEdit(p)} 
                className="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:scale-105 transition-all border border-blue-100"
                title="Edit Stock"
              >
                <Edit2 size={16} />
              </button>
              
              <button 
                onClick={() => onDeleteProduct(p.id)} 
                className="w-9 h-9 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 hover:scale-105 transition-all border border-rose-100"
                title="Delete Product"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

const StockTable: React.FC<StockTableProps> = ({ 
  products, 
  selectedIds, 
  onSelect, 
  onSelectAll, 
  onUpdateStock, 
  onDeleteProduct
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const startEdit = (product: EnhancedProduct) => {
    setEditingId(product.id);
    setEditValue(product.stockQuantity?.toString() || '0');
  };

  const saveEdit = () => {
    if (editingId) {
      const newQty = parseInt(editValue);
      if (!isNaN(newQty) && newQty >= 0) {
        onUpdateStock(editingId, newQty);
        setEditingId(null);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectAll(products.map(p => p.id));
    } else {
      onSelectAll([]);
    }
  };

  const itemData: ItemData = useMemo(() => ({
    selectedIds,
    onSelect,
    onDeleteProduct,
    onUpdateStock,
    editingId,
    editValue,
    setEditValue,
    startEdit,
    saveEdit,
    cancelEdit
  }), [selectedIds, onSelect, onDeleteProduct, onUpdateStock, editingId, editValue]);

  return (
    <div 
      className="bg-gray-50/50 rounded-[2.5rem] border border-gray-200 overflow-hidden flex flex-col h-[750px]"
    >
      {/* Table Header */}
      <div className="flex items-center px-4 h-16 bg-white border-b border-gray-200 text-xs font-black uppercase tracking-widest text-gray-400 sticky top-0 z-10 shadow-sm">
        <div className="w-[5%] min-w-[50px] flex justify-center">
          <input 
            type="checkbox" 
            checked={selectedIds.length === products.length && products.length > 0}
            onChange={handleSelectAll}
            className="w-5 h-5 rounded-md border-gray-300 text-fario-purple focus:ring-fario-purple cursor-pointer"
          />
        </div>
        <div className="w-[35%] min-w-[300px] px-6">Item Specs</div>
        <div className="w-[20%] min-w-[180px] px-6">Current Stock</div>
        <div className="w-[20%] min-w-[160px] px-6">Availability</div>
        <div className="w-[20%] min-w-[160px] px-6 text-right">Controls</div>
      </div>

      {/* Rows Container */}
      <div className="flex-grow overflow-y-auto scrollbar-hide py-3">
        {products.length > 0 ? (
          products.map((p) => (
            <Row key={p.id} product={p} data={itemData} />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-6">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border border-gray-100 shadow-sm">
               <Box size={40} className="opacity-20" />
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-slate-800">Catalog Empty</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-2 text-gray-400">Adjust search parameters</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-8 py-4 border-t border-gray-200 bg-white flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        <p>{products.length} Active SKUs</p>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <p>System Online</p>
        </div>
      </div>
    </div>
  );
};

export default StockTable;
