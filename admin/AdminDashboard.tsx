import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, Package, Users, ShoppingBag,
  Activity, ArrowUpRight, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchGlobalStats = async () => {
      try {
        // 1. Fetch Orders (Revenue & Count)
        const { data: ordersData } = await supabase.from('orders').select('id, total, createdat, status, useremail').order('createdat', { ascending: false });

        // 2. Fetch Products Count
        const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

        // 3. Fetch Customers Count
        const { count: customersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

        if (!mounted) return;

        const totalRevenue = (ordersData || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0);

        setStats({
          revenue: totalRevenue,
          orders: ordersData?.length || 0,
          products: productsCount || 0,
          customers: customersCount || 0
        });

        setRecentOrders((ordersData || []).slice(0, 5));
        setIsLoading(false);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchGlobalStats();

    // Realtime Subscriptions
    const channels = supabase.channel('admin-dashboard-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchGlobalStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchGlobalStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchGlobalStats)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channels);
    };
  }, []);

  const kpis = [
    { label: 'Total Revenue', value: `Rs. ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: stats.orders.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Products', value: stats.products.toString(), icon: Package, color: 'text-fario-purple', bg: 'bg-purple-50' },
    { label: 'Total Customers', value: stats.customers.toString(), icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-20 px-4 md:px-8 pt-6">
      <header className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="text-fario-purple" /> Global Overview
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Real-time Headquarters Data</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-wide">Live Connected</span>
        </div>
      </header>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-fario-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden group"
              >
                <div className={`p-4 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{kpi.value}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{kpi.label}</p>
                </div>
                <ArrowUpRight size={80} className={`absolute -right-4 -bottom-4 opacity-5 ${kpi.color} group-hover:scale-110 transition-transform`} />
              </motion.div>
            ))}
          </div>

          {/* Recent Orders List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mt-8 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Zap size={16} className="text-fario-purple" /> Latest Orders Stream
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">No orders found</div>
              ) : (
                recentOrders.map((order, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={order.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">#{order.id.split('-')[0]}</p>
                      <p className="text-[10px] font-bold text-slate-500">{order.useremail || 'Guest User'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600">Rs. {Number(order.total).toLocaleString()}</p>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">{order.status || 'Processing'}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
