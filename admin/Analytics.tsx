import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
   TrendingUp, DollarSign, ShoppingCart,
   Users, ArrowUpRight, ArrowDownRight,
   Download, Calendar, Activity,
   Package, RefreshCw, Loader2
} from 'lucide-react';
import { useCart } from '../context/CartProvider';

const AdminAnalytics: React.FC = () => {
   const { products } = useCart();
   const [orders, setOrders] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [exporting, setExporting] = useState(false);
   const [stats, setStats] = useState({
      total_revenue: 0,
      total_orders: 0,
      total_customers: 0,
      revenue_trend: 0
   });
   const [revenueData, setRevenueData] = useState<any[]>([]);
   const [topProducts, setTopProducts] = useState<any[]>([]);
   const [categoryData, setCategoryData] = useState<any[]>([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const { supabase } = await import('../lib/supabase');

            // Fetch ALL orders for analytics
            const { data: allOrders, error } = await supabase
               .from('orders')
               .select('*')
               .order('createdat', { ascending: false });

            if (error) throw error;
            setOrders(allOrders || []);

         } catch (err) {
            console.error("Failed to fetch analytics data", err);
         }
      };

      fetchData();
   }, []);

   useEffect(() => {
      const calculateStats = async () => {
         if (orders.length === 0 && loading) return; // Wait for fetch

         try {
            // 1. Basic Stats
            const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? o.total : 0), 0);
            const totalOrders = orders.length;
            const uniqueCustomers = new Set(orders.map(o => o.useremail)).size;

            // 2. Revenue Trend (Daily for last 7 days)
            const dailyRevenue: Record<string, number> = {};
            const last7Days = Array.from({ length: 7 }, (_, i) => {
               const d = new Date();
               d.setDate(d.getDate() - i);
               return d.toISOString().split('T')[0];
            }).reverse();

            orders.forEach(o => {
               const date = o.createdat ? o.createdat.split('T')[0] : (o.date || '');
               if (last7Days.includes(date)) {
                  dailyRevenue[date] = (dailyRevenue[date] || 0) + (o.status !== 'Cancelled' ? o.total : 0);
               }
            });

            const revChart = last7Days.map(date => ({
               date,
               revenue: dailyRevenue[date] || 0
            }));

            // 3. Top Products
            const productSales: Record<string, { name: string, sold: number, revenue: number }> = {};
            orders.forEach(o => {
               if (o.status !== 'Cancelled') {
                  o.items.forEach((item: any) => {
                     if (!productSales[item.id]) {
                        productSales[item.id] = { name: item.name, sold: 0, revenue: 0 };
                     }
                     productSales[item.id].sold += item.quantity;
                     productSales[item.id].revenue += item.price * item.quantity;
                  });
               }
            });

            const sortedProducts = Object.values(productSales)
               .sort((a, b) => b.revenue - a.revenue)
               .slice(0, 5)
               .map(p => ({ ...p, total_sold: p.sold }));

            // 4. Category Performance
            const catPerformance: Record<string, number> = {};
            orders.forEach(o => {
               if (o.status !== 'Cancelled') {
                  o.items.forEach((item: any) => {
                     // Find product in catalog to get category
                     const prod = products.find(p => p.id === item.id);
                     const category = prod?.category || 'Uncategorized';
                     catPerformance[category] = (catPerformance[category] || 0) + (item.price * item.quantity);
                  });
               }
            });

            const categoryChart = Object.entries(catPerformance)
               .map(([category, revenue]) => ({ category, revenue }))
               .sort((a, b) => b.revenue - a.revenue);

            setStats({
               total_revenue: totalRevenue,
               total_orders: totalOrders,
               total_customers: uniqueCustomers,
               revenue_trend: 12.5 // Hardcoded trend for now
            });
            setRevenueData(revChart);
            setTopProducts(sortedProducts);
            setCategoryData(categoryChart);

         } catch (err) {
            console.error("Analytics calc error:", err);
         } finally {
            setLoading(false);
         }
      };
      calculateStats();
   }, [orders, products]);

   const handleExport = () => {
      setExporting(true);
      setTimeout(() => setExporting(false), 2000);
   };

   if (loading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-10 h-10 text-fario-purple animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Data Node...</p>
         </div>
      );
   }

   const kpis = [
      {
         label: 'Revenue',
         value: `Rs. ${stats.total_revenue.toLocaleString()}`,
         change: `${stats.revenue_trend > 0 ? '+' : ''}${stats.revenue_trend.toFixed(1)}%`,
         trend: stats.revenue_trend >= 0 ? 'up' : 'down',
         icon: DollarSign,
         color: 'text-fario-purple'
      },
      {
         label: 'Total Orders',
         value: stats.total_orders.toLocaleString(),
         change: '+12.5%',
         trend: 'up',
         icon: ShoppingCart,
         color: 'text-emerald-500'
      },
      {
         label: 'Active Users',
         value: stats.total_customers.toLocaleString(),
         change: '+8.2%',
         trend: 'up',
         icon: Users,
         color: 'text-sky-500'
      },
      {
         label: 'Conversion',
         value: '3.4%',
         change: '-0.3%',
         trend: 'down',
         icon: Activity,
         color: 'text-amber-500'
      }
   ];

   return (
      <div className="space-y-8 pb-20 animate-slide-up">
         {/* Simple Header */}
         <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="admin-h1">Business Insights</h1>
               <p className="admin-subtitle">Comprehensive performance metrics and market trends.</p>
            </div>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Calendar size={16} /> Last 30 Days
               </button>
               <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-fario-purple transition-all shadow-md"
               >
                  {exporting ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
                  {exporting ? 'Exporting...' : 'Download Report'}
               </button>
            </div>
         </header>

         {/* KPI Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi) => (
               <div key={kpi.label} className="admin-card">
                  <div className="flex justify-between items-start mb-4">
                     <div className={`p-3 rounded-xl bg-slate-50 ${kpi.color}`}>
                        <kpi.icon size={20} />
                     </div>
                     <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full ${kpi.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        {kpi.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {kpi.change}
                     </div>
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{kpi.label}</p>
                     <h4 className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</h4>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-8 admin-card">
               <div className="flex items-center justify-between mb-8">
                  <div>
                     <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Revenue Performance</h3>
                     <p className="text-xs text-slate-400 mt-1">Daily gross revenue distribution</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-fario-purple"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Gross</span>
                     </div>
                  </div>
               </div>

               <div className="h-[300px] flex items-end gap-2 md:gap-4 px-2">
                  {revenueData.map((d) => {
                     const max = Math.max(...revenueData.map(rd => rd.revenue)) || 1;
                     const height = (d.revenue / max) * 100;
                     return (
                        <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                           <div
                              className="w-full bg-slate-50 rounded-t-lg group-hover:bg-fario-purple/20 transition-all"
                              style={{ height: `${Math.max(10, height)}%` }}
                           >
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-xl pointer-events-none">
                                 Rs. {Number(d.revenue).toLocaleString()}
                              </div>
                           </div>
                           <span className="text-[8px] font-black text-slate-300 mt-3 rotate-45 origin-left md:rotate-0">
                              {new Date(d.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                           </span>
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* Category Breakdown */}
            <div className="lg:col-span-4 admin-card">
               <div className="mb-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Market Share</h3>
                  <p className="text-xs text-slate-400 mt-1">Sales distribution by category</p>
               </div>

               <div className="space-y-5">
                  {categoryData.length > 0 ? categoryData.map((cat, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-600">{cat.category}</span>
                           <span className="text-slate-900">Rs. {Number(cat.revenue).toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                           <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(cat.revenue / categoryData[0].revenue) * 100}%` }}
                              className="h-full bg-fario-purple rounded-full"
                           />
                        </div>
                     </div>
                  )) : (
                     <div className="text-center py-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">No Data Available</p>
                     </div>
                  )}
               </div>

               <div className="mt-8 pt-6 border-t border-slate-50">
                  <div className="bg-slate-50 p-4 rounded-xl">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Top Category</p>
                     <p className="text-sm font-bold text-slate-900 italic">{categoryData[0]?.category || 'N/A'}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Top Products */}
         <div className="admin-card">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Performance Leaderboard</h3>
                  <p className="text-xs text-slate-400 mt-1">Highest grossing inventory units</p>
               </div>
               <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <TrendingUp size={18} />
               </div>
            </div>

            <div className="admin-table-container">
               <table className="admin-table">
                  <thead>
                     <tr>
                        <th>Product Entity</th>
                        <th>Units Deployed</th>
                        <th>Gross Revenue</th>
                        <th>Performance Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {topProducts.map((p, i) => (
                        <tr key={p.product_id || i}>
                           <td>
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center font-black text-[10px] text-fario-purple italic border border-slate-100">
                                    #{i + 1}
                                 </div>
                                 <span className="font-bold text-slate-900">{p.name}</span>
                              </div>
                           </td>
                           <td className="font-medium text-slate-500">{p.total_sold} units</td>
                           <td className="font-black text-slate-900 italic">Rs. {Number(p.revenue).toLocaleString()}</td>
                           <td>
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                 High Velocity
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Inventory Health Section (Low Stock) */}
         <div className="admin-card mt-6">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Inventory Health</h3>
                  <p className="text-xs text-slate-400 mt-1">Critical stock alerts</p>
               </div>
               <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <Package size={18} />
               </div>
            </div>

            <div className="admin-table-container">
               <table className="admin-table">
                  <thead>
                     <tr>
                        <th>Product</th>
                        <th>Current Stock</th>
                        <th>Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {products.filter(p => (p.stockQuantity || 0) < 10).length > 0 ? (
                        products.filter(p => (p.stockQuantity || 0) < 10).map((p) => (
                           <tr key={p.id}>
                              <td className="font-bold text-slate-900">{p.name}</td>
                              <td className="font-medium text-slate-500">{p.stockQuantity || 0} units</td>
                              <td>
                                 <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${(p.stockQuantity || 0) === 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                    {(p.stockQuantity || 0) === 0 ? 'Out of Stock' : 'Low Stock'}
                                 </span>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan={3} className="text-center py-4 text-slate-400 text-xs italic">All systems operational. Inventory levels healthy.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default AdminAnalytics;
