
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { EnhancedProduct } from '../../constants';

interface BulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onConfirm: (action: 'add' | 'subtract' | 'set', value: number) => void;
}

const BulkModal: React.FC<BulkModalProps> = ({ isOpen, onClose, selectedCount, onConfirm }) => {
  const [action, setAction] = useState<'add' | 'subtract' | 'set'>('add');
  const [value, setValue] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = () => {
    const numVal = parseInt(value);
    if (isNaN(numVal) || numVal < 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      onConfirm(action, numVal);
      setIsProcessing(false);
      onClose();
      setValue('');
    }, 800);
  };

  // Cast motion components
  const MotionDiv = (motion as any).div;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <MotionDiv 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <MotionDiv 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-lg font-black uppercase text-slate-800 tracking-tight">Bulk Operations</h3>
                <p className="text-[10px] font-bold text-fario-purple uppercase tracking-widest mt-1">
                  Modifying {selectedCount} Units
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-6">
              {/* Action Selector */}
              <div className="grid grid-cols-3 gap-3 p-1 bg-gray-50 rounded-xl border border-gray-100">
                {(['add', 'subtract', 'set'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAction(opt)}
                    className={`py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      action === opt 
                        ? 'bg-white text-fario-purple shadow-sm ring-1 ring-black/5' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {opt === 'add' ? 'Add Stock' : opt === 'subtract' ? 'Remove' : 'Set Exact'}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Quantity Value</label>
                <div className="relative">
                  <ArrowRightLeft className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="number" 
                    min="0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-slate-800 focus:ring-2 focus:ring-fario-purple/20 focus:border-fario-purple outline-none transition-all"
                    placeholder="Enter amount..."
                  />
                </div>
              </div>

              {/* Warning */}
              <div className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700">
                <ShieldAlert size={20} className="shrink-0" />
                <p className="text-[10px] font-bold leading-relaxed">
                  This action will apply to all {selectedCount} selected products immediately. Ensure accuracy before confirming.
                </p>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={!value || isProcessing}
                className="w-full py-4 bg-fario-dark text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-fario-purple transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Confirm Update
              </button>
            </div>
          </MotionDiv>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BulkModal;
