
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Package,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  Truck,
  RotateCcw,
  Activity,
  Zap,
  X,
  AlertTriangle,
  ShoppingBag,
  ChevronRight,
  ArrowRight,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import * as RouterDOM from 'react-router-dom';
import { useCart } from '../context/CartProvider';

const { useNavigate } = RouterDOM as any;

type TimeRange = 'Today' | '7 Days' | '30 Days' | 'Yearly';

// --- Smooth Path Logic ---
const getControlPoint = (current: { x: number, y: number }, previous: { x: number, y: number }, next: { x: number, y: number }, reverse?: boolean) => {
  const p = previous || current;
  const n = next || current;
  const smoothing = 0.2;
  const oX = n.x - p.x;
  const oY = n.y - p.y;
  const length = Math.sqrt(oX * oX + oY * oY);
  const angle = Math.atan2(oY, oX) + (reverse ? Math.PI : 0);
  const lengthScaled = length * smoothing;
  return {
    x: current.x + Math.cos(angle) * lengthScaled,
    y: current.y + Math.sin(angle) * lengthScaled
  };
};

const generateSmoothPath = (points: { x: number, y: number }[]) => {
  if (points.length === 0) return "";
  return points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const cps = getControlPoint(a[i - 1], a[i - 2], point);
    const cpe = getControlPoint(point, a[i - 1], a[i + 1], true);
    return `${acc} C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`;
  }, "");
};
// --- Interfaces ---
export interface SalesData {
  date: string;
  amount: number;
  orders: number;
}
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  activeUsers: number;
}
// -------------------------

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Real-time Data Integration from CartContext
  const { products, orders: allOrders } = useCart();
  // Alias for compatibility with existing code using 'orders'
  const orders = allOrders;

  const [timeRange, setTimeRange] = useState<TimeRange>('7 Days');
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'info' } | null>(null);
  // Removed liveVisitors
  const [showLowStockBanner, setShowLowStockBanner] = useState(true);

  // Chart State
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Real-time Data State
  const [marketData, setMarketData] = useState<{ time: string, shoes: number, bags: number, vol: number }[]>([]);

  // Recent Orders Panel State
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(true);

  // Live Inventory Calculations
  const lowStockCount = useMemo(() => products.filter(p => (p.stockQuantity || 0) < 10 && (p.stockQuantity || 0) > 0).length, [products]);
  const totalStock = useMemo(() => products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0), [products]);

  // Calculate Real Top Performer from Orders
  const { topProduct, topProductStats } = useMemo(() => {
    if (allOrders.length === 0 || products.length === 0) {
      return { topProduct: products[0], topProductStats: { units: 0, revenue: 0 } };
    }

    const salesMap = new Map<string, { units: number, revenue: number }>();

    allOrders.forEach(order => {
      order.items.forEach(item => {
        const current = salesMap.get(item.id) || { units: 0, revenue: 0 };
        salesMap.set(item.id, {
          units: current.units + item.quantity,
          revenue: current.revenue + (item.price * item.quantity)
        });
      });
    });

    let bestSellerId = products[0]?.id;
    let maxRevenue = -1;

    salesMap.forEach((stats, id) => {
      if (stats.revenue > maxRevenue) {
        maxRevenue = stats.revenue;
        bestSellerId = id;
      }
    });

    const winner = products.find(p => p.id === bestSellerId) || products[0];
    const stats = salesMap.get(winner?.id || '') || { units: 0, revenue: 0 };

    return { topProduct: winner, topProductStats: stats };
  }, [allOrders, products]);

  // Initial Data Generation - REMOVED for Clean Slate
  useEffect(() => {
    setMarketData([]);
  }, [timeRange]);

  // Real Data Integration


  // ... inside component ...
  // Real Data Integration
  // Real Data Integration from CartContext

  useEffect(() => {
    if (allOrders.length > 0) {
      const processed = processOrdersToGraph(allOrders);
      setMarketData(processed);
    }
  }, [allOrders, timeRange]);

  // Handle Range Change
  const handleRangeChange = (range: TimeRange) => {
    setIsUpdating(true);
    setTimeRange(range);
    setHoverIndex(null);
    setTimeout(() => setIsUpdating(false), 500);
  };

  // Banner Dismissal Logic (Session Memory Only)
  useEffect(() => {
    // No persistence requested
  }, []);

  const handleDismissBanner = () => {
    setShowLowStockBanner(false);
  };

  // Helper to process orders into graph points
  const processOrdersToGraph = (orders: any[]) => {
    // Sort by date
    const sorted = [...orders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // If no orders, return empty or zero line
    if (sorted.length === 0) return Array(10).fill(0).map((_, i) => ({ time: `${i}:00`, shoes: 0, bags: 0, vol: 0 }));

    // Map to data points (simplified)
    return sorted.map(o => ({
      time: new Date(o.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      shoes: o.total, // Using total as value for now
      bags: o.items.length * 100, // Dummy secondary metric
      vol: 100
    })).slice(-20); // Last 20 orders
  };

  // Real KPI Calculations
  const totalRevenue = useMemo(() => allOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0), [allOrders]);
  const revenueDisplay = `Rs. ${totalRevenue.toLocaleString()}`;
  const totalOrders = allOrders.length;

  // ... Update dashboardData to use these reals ...
  const dashboardData = useMemo(() => {
    return {
      stats: [
        {
          label: 'Total Revenue',
          value: revenueDisplay,
          trend: '+100%', // Placeholder trend
          up: true,
          icon: DollarSign,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          subtext: `${totalOrders} Orders`
        },
        {
          label: 'Inventory',
          value: `${totalStock} Units`,
          trend: lowStockCount > 0 ? `${lowStockCount} Low` : 'Stable',
          up: lowStockCount === 0,
          icon: Package,
          color: lowStockCount > 0 ? 'text-amber-600' : 'text-blue-600',
          bg: lowStockCount > 0 ? 'bg-amber-50' : 'bg-blue-50',
          subtext: 'Stock Level'
        },
        {
          label: 'Pending Orders',
          value: allOrders.filter(o => o.status === 'Processing').length.toString(),
          trend: 'Action Needed',
          up: false,
          icon: Activity,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50',
          subtext: 'To Ship'
        },
      ]
    };
  }, [totalRevenue, totalStock, lowStockCount, allOrders]);

  // Use allOrders for the recent orders list instead of context orders (which might be user specific)
  // Check if we duplicate logic or replace. User context 'orders' is "My Orders".
  // For Admin Dashboard, we want 'allOrders'.

  // Chart Data Processing
  const processedChart = useMemo(() => {
    if (marketData.length === 0) return null;

    const maxVal = Math.max(...marketData.map(d => Math.max(d.shoes, d.bags))) * 1.1;
    const minVal = Math.min(...marketData.map(d => Math.min(d.shoes, d.bags))) * 0.9;

    // Normalize data for SVG (0-100 coordinate system)
    const points = marketData.map((d, i) => ({
      x: (i / (marketData.length - 1)) * 100,
      yShoes: 100 - ((d.shoes - minVal) / (maxVal - minVal)) * 100,
      yBags: 100 - ((d.bags - minVal) / (maxVal - minVal)) * 100,
      valShoes: d.shoes,
      valBags: d.bags,
      time: d.time,
      vol: d.vol
    }));

    // Generate Paths
    const shoesPath = generateSmoothPath(points.map(p => ({ x: p.x, y: p.yShoes })));
    const bagsPath = generateSmoothPath(points.map(p => ({ x: p.x, y: p.yBags })));

    const shoesArea = `${shoesPath} L 100,100 L 0,100 Z`;
    const bagsArea = `${bagsPath} L 100,100 L 0,100 Z`;

    // Calculate Current Stats
    const current = marketData[marketData.length - 1];
    const previous = marketData[marketData.length - 2] || current;

    const shoesChange = previous.shoes ? ((current.shoes - previous.shoes) / previous.shoes) * 100 : 0;
    const bagsChange = previous.bags ? ((current.bags - previous.bags) / previous.bags) * 100 : 0;

    return {
      points, shoesPath, bagsPath, shoesArea, bagsArea,
      maxVal, minVal, current, shoesChange, bagsChange
    };
  }, [marketData]);

  // recentOrders removed

  const handleChartHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartContainerRef.current || !processedChart) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.round(percentage * (processedChart.points.length - 1));
    setHoverIndex(index);
  };

  // Cast motion components
  const MotionDiv = (motion as any).div;
  // MotionPath removed
  const MotionImg = (motion as any).img;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative px-2">
      <AnimatePresence>
        {notification && (
          <MotionDiv
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed top-10 left-1/2 z-[200] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border ${notification.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-white'
              }`}
          >
            {notification.type === 'success' ? <CheckCircle2 size={16} /> : <Activity size={16} className="animate-pulse" />}
            <span className="text-[10px] font-black uppercase tracking-widest">{notification.msg}</span>
            <button onClick={() => setNotification(null)}><X size={14} /></button>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Executive Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">AS</div>
            <p className="text-slate-500 text-xs font-medium">Welcome back, <span className="text-slate-900 font-bold">Akash</span></p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm overflow-hidden w-full md:w-auto">
            {(['Today', '7 Days', '30 Days'] as const).map((range) => (
              <button
                key={range}
                onClick={() => handleRangeChange(range)}
                className={`flex-1 md:flex-none px-4 py-1.5 text-[11px] font-bold transition-all rounded-md ${timeRange === range ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 self-end">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wide">
                Online: 42
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Dismissible Alert Banner */}
      <AnimatePresence>
        {showLowStockBanner && lowStockCount > 0 && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between shadow-sm group overflow-hidden"
          >
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin/stock')}>
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shadow-sm">
                <AlertTriangle size={16} />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-900 uppercase tracking-tight">Stock Warning</h4>
                <p className="text-[10px] text-amber-700 font-bold leading-none">
                  {lowStockCount} items critical. <span className="underline decoration-amber-400 decoration-2">Restock now</span>.
                </p>
              </div>
            </div>
            <button onClick={handleDismissBanner} className="p-2 text-amber-400 hover:text-amber-700 hover:bg-amber-100 rounded-full transition-colors">
              <X size={14} />
            </button>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence mode="wait">
          {isUpdating && (
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-3xl">
              <Loader2 className="animate-spin text-fario-purple" size={24} />
            </MotionDiv>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* HERO SPOTLIGHT */}
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-gradient-to-br from-[#7a51a0] to-[#2e1065] p-6 rounded-[2rem] shadow-lg relative overflow-hidden group text-white flex flex-col justify-center min-h-[180px]"
          >
            <div className="relative z-10 max-w-[65%]">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold uppercase tracking-wider border border-white/10 text-white">Top Performer</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight leading-none mb-3 truncate">{topProduct?.name}</h3>

              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Sales</p>
                  <p className="text-lg font-bold leading-none">{topProductStats?.units || 0} Units</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Revenue</p>
                  <p className="text-lg font-bold leading-none">Rs. {(topProductStats?.revenue || 0).toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/products/${topProduct?.id}`);
                }}
                className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 text-white/90 hover:text-white transition-colors group-hover:translate-x-1 duration-300"
              >
                View Product Details <ArrowRight size={12} />
              </button>
            </div>

            <MotionImg
              src={topProduct?.image}
              alt="Hero"
              className="absolute top-1/2 -right-2 -translate-y-1/2 w-48 h-48 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:rotate-[-5deg] transition-transform duration-500"
            />
          </MotionDiv>

          {/* KPI Cards */}
          {dashboardData.stats.map((stat, idx) => (
            <MotionDiv
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={20} /></div>
                <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-tight py-1 px-2 rounded-md ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.trend} <ArrowUpRight size={10} className={!stat.up ? 'rotate-180' : ''} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">{stat.value}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-[8px] font-bold text-gray-300 uppercase">{stat.subtext}</p>
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-Time Stock Market Style Graph */}
        <div className="lg:col-span-8 bg-[#0B1221] p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col min-h-[420px] relative overflow-hidden text-white">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-2 relative z-10">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Traffic & Sales Analytics</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Real-time Data Stream</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Legend */}
              <div className="flex items-center gap-3 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#7a51a0] rounded-full shadow-[0_0_8px_#7a51a0]"></div>
                  <span className="text-[10px] font-bold text-slate-300">Footwear</span>
                </div>
                <div className="w-px h-3 bg-slate-700"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#10b981] rounded-full shadow-[0_0_8px_#10b981]"></div>
                  <span className="text-[10px] font-bold text-slate-300">Accessories</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live</span>
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div
            ref={chartContainerRef}
            className="flex-grow w-full relative h-[250px] cursor-crosshair group select-none"
            onMouseMove={handleChartHover}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Background Grid */}
            <div className="absolute inset-0 z-0">
              {[0, 25, 50, 75, 100].map(y => (
                <div key={y} className="absolute w-full h-px bg-slate-800/50" style={{ top: `${y}%` }} />
              ))}
              {[0, 20, 40, 60, 80, 100].map(x => (
                <div key={x} className="absolute h-full w-px bg-slate-800/30" style={{ left: `${x}%` }} />
              ))}
            </div>

            {processedChart && (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible relative z-10">
                <defs>
                  <linearGradient id="purpleFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7a51a0" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7a51a0" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Volume Bars (Simulated at bottom) */}
                {processedChart.points.map((p, i) => (
                  <rect
                    key={`vol-${i}`}
                    x={p.x - 0.5}
                    y={85}
                    width={1}
                    height={(p.vol / 500) * 15}
                    fill={i % 2 === 0 ? "#10b981" : "#ef4444"}
                    opacity="0.3"
                  />
                ))}

                {/* Areas */}
                <path d={processedChart.bagsArea} fill="url(#greenFill)" />
                <path d={processedChart.shoesArea} fill="url(#purpleFill)" />

                {/* Lines */}
                <path d={processedChart.bagsPath} fill="none" stroke="#10b981" strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <path d={processedChart.shoesPath} fill="none" stroke="#7a51a0" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                {/* Live Endpoint Pulses */}
                {processedChart.points.length > 0 && (
                  <>
                    <circle cx={processedChart.points[processedChart.points.length - 1].x} cy={processedChart.points[processedChart.points.length - 1].yShoes} r="2" fill="#7a51a0" className="animate-pulse" />
                    <circle cx={processedChart.points[processedChart.points.length - 1].x} cy={processedChart.points[processedChart.points.length - 1].yBags} r="2" fill="#10b981" className="animate-pulse" />
                  </>
                )}

                {/* Interactive Hover Crosshair & Tooltip */}
                {hoverIndex !== null && hoverIndex < processedChart.points.length && (
                  <g>
                    <line x1={processedChart.points[hoverIndex].x} y1="0" x2={processedChart.points[hoverIndex].x} y2="100" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 2" />
                    <circle cx={processedChart.points[hoverIndex].x} cy={processedChart.points[hoverIndex].yShoes} r="3" fill="#7a51a0" stroke="#0B1221" strokeWidth="1.5" />
                    <circle cx={processedChart.points[hoverIndex].x} cy={processedChart.points[hoverIndex].yBags} r="3" fill="#10b981" stroke="#0B1221" strokeWidth="1.5" />
                  </g>
                )}
              </svg>
            )}

            {/* Dark Mode Tooltip */}
            {hoverIndex !== null && processedChart && hoverIndex < processedChart.points.length && (
              <div
                className="absolute bg-slate-900/90 backdrop-blur-md rounded-lg p-3 shadow-2xl border border-slate-700 z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 min-w-[120px]"
                style={{
                  left: `${processedChart.points[hoverIndex].x}%`,
                  top: '40%'
                }}
              >
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 pb-1 border-b border-slate-700 whitespace-nowrap flex justify-between">
                  <span>{processedChart.points[hoverIndex].time}</span>
                  <span className="text-slate-500">Vol: {processedChart.points[hoverIndex].vol}</span>
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] font-bold text-[#7a51a0]">Shoes</span>
                    <span className="text-xs font-mono font-bold text-white">Rs. {processedChart.points[hoverIndex].valShoes.toFixed(1)}k</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] font-bold text-[#10b981]">Bags</span>
                    <span className="text-xs font-mono font-bold text-white">Rs. {processedChart.points[hoverIndex].valBags.toFixed(1)}k</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Footer */}
          {processedChart && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 mt-2 border-t border-slate-800">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Shoes (Current)</p>
                <p className="text-lg font-mono font-bold text-white flex items-center gap-2">
                  Rs. {processedChart.current.shoes.toFixed(1)}k
                  <span className={`text-[9px] px-1.5 rounded ${processedChart.shoesChange >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {processedChart.shoesChange >= 0 ? '+' : ''}{processedChart.shoesChange.toFixed(1)}%
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bags (Current)</p>
                <p className="text-lg font-mono font-bold text-white flex items-center gap-2">
                  Rs. {processedChart.current.bags.toFixed(1)}k
                  <span className={`text-[9px] px-1.5 rounded ${processedChart.bagsChange >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {processedChart.bagsChange >= 0 ? '+' : ''}{processedChart.bagsChange.toFixed(1)}%
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">24h High</p>
                <p className="text-lg font-mono font-bold text-slate-300">Rs. {(processedChart.maxVal * 0.9).toFixed(1)}k</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">24h Low</p>
                <p className="text-lg font-mono font-bold text-slate-300">Rs. {(processedChart.minVal * 1.1).toFixed(1)}k</p>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel: Urgent Tasks & Recent Orders */}
        <div className="lg:col-span-4 flex flex-col gap-4">

          {/* Urgent Tasks */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap size={14} className="text-fario-purple" /> Urgent Tasks
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => navigate('/admin/orders')}>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-amber-200 text-amber-700 rounded-lg"><Truck size={12} /></div>
                  <div>
                    <p className="text-[11px] font-bold text-amber-900">3 Orders Pending</p>
                  </div>
                </div>
                <ChevronRight size={12} className="text-amber-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-100 rounded-xl cursor-pointer hover:bg-rose-100 transition-colors" onClick={() => navigate('/admin/orders')}>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-rose-200 text-rose-700 rounded-lg"><RotateCcw size={12} /></div>
                  <div>
                    <p className="text-[11px] font-bold text-rose-900">2 Returns</p>
                  </div>
                </div>
                <ChevronRight size={12} className="text-rose-400" />
              </div>
            </div>
          </div>

          {/* Recent Orders Panel (Collapsible & Auto-Updating) */}
          <div className={`bg-white border border-gray-100 shadow-sm overflow-hidden transition-all duration-500 ease-in-out ${isOrdersExpanded ? 'rounded-[2.5rem] flex-grow' : 'rounded-[2rem] h-auto'}`}>
            <div
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsOrdersExpanded(!isOrdersExpanded)}
            >
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-emerald-500" /> Recent Activity
              </h3>
              {isOrdersExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </div>

            <AnimatePresence>
              {isOrdersExpanded && (
                <MotionDiv
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5"
                >
                  <div className="space-y-2 mb-4">
                    {orders.slice(0, 3).map((order) => {
                      const isHighlighted = false;
                      return (
                        <MotionDiv
                          key={order.id}
                          initial={isHighlighted ? { scale: 0.95, backgroundColor: '#ecfdf5' } : {}}
                          animate={isHighlighted ? { scale: 1, backgroundColor: '#ecfdf5' } : { backgroundColor: '#ffffff' }}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isHighlighted ? 'border-emerald-200' : 'border-slate-100 hover:border-slate-200'}`}
                          onClick={() => navigate('/admin/orders')}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${isHighlighted ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                              <ShoppingBag size={12} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-900 uppercase">#{order.id}</p>
                              <p className="text-[9px] text-gray-400 font-bold truncate max-w-[80px]">{order.shippingAddress?.fullName || 'Guest'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-900">Rs. {order.total.toLocaleString()}</p>
                            <p className={`text-[8px] font-bold uppercase tracking-wide ${isHighlighted ? 'text-emerald-600' : 'text-gray-300'}`}>
                              {isHighlighted ? 'Just Now' : order.date}
                            </p>
                          </div>
                        </MotionDiv>
                      );
                    })}
                    {orders.length === 0 && (
                      <div className="text-center py-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">No Recent Orders</div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate('/admin/orders')}
                    className="w-full py-3 bg-gray-50 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-gray-100"
                  >
                    View All Orders
                  </button>
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
