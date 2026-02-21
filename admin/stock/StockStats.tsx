
import React from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, AlertTriangle, Box } from 'lucide-react';
import { EnhancedProduct } from '../../constants';

interface StockStatsProps {
  products: EnhancedProduct[];
}

const StockStats: React.FC<StockStatsProps> = ({ products }) => {
  // Calculations
  const totalStock = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * (p.stockQuantity || 0)), 0);
  const lowStockCount = products.filter(p => (p.stockQuantity || 0) < 10).length;
  const outOfStockCount = products.filter(p => (p.stockQuantity || 0) === 0).length;

  const cards = [
    {
      label: 'Inventory Value',
      value: `Rs. ${totalValue.toLocaleString()}`,
      sub: 'Total Asset Worth',
      icon: TrendingUp,
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
      border: 'border-emerald-100'
    },
    {
      label: 'Stock Units',
      value: totalStock.toLocaleString(),
      sub: `${products.length} Unique SKUs`,
      icon: Package,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
      border: 'border-blue-100'
    },
    {
      label: 'Low Stock Alerts',
      value: lowStockCount.toString(),
      sub: 'Restock Recommended',
      icon: AlertTriangle,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
      border: 'border-amber-100'
    },
    {
      label: 'Stockouts',
      value: outOfStockCount.toString(),
      sub: 'Critical Impact',
      icon: Box,
      bg: 'bg-rose-50',
      color: 'text-rose-600',
      border: 'border-rose-100'
    }
  ];

  // Cast motion components
  const MotionDiv = (motion as any).div;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <MotionDiv
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-6 rounded-2xl bg-white border ${card.border} shadow-sm hover:shadow-md transition-all group`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
              <card.icon size={20} />
            </div>
            {idx === 2 && lowStockCount > 0 && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
            <h3 className="text-2xl font-black font-heading text-slate-800 tracking-tight">{card.value}</h3>
            <p className={`text-[10px] font-bold mt-1 ${card.color}`}>{card.sub}</p>
          </div>
        </MotionDiv>
      ))}
    </div>
  );
};

export default StockStats;
