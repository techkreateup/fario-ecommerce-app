
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Printer, Package, X,
  Loader2, Trash2, CheckCircle2,
  FileDown, Filter, Truck, Clock,
  MapPin, DollarSign, RotateCcw,
  ChevronDown, Box
} from 'lucide-react';
import { useCart } from '../context/CartProvider';
import { Order } from '../types';
import { orderService } from '../services/orderService';
import { supabase } from '../lib/supabase';

const AdminOrders: React.FC = () => {
  const { purgeOrder, updateOrderStatus } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch all orders real-time for admin
  React.useEffect(() => {
    const fetchAllOrders = async () => {
      const allOrders = await orderService.getAllOrders();
      // Map properties consistently (specifically checking isArchived and mapped schema)
      const mappedOrders = allOrders.map((o: any) => ({
        id: o.id,
        date: o.createdat ? new Date(o.createdat).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
        createdat: o.createdat,
        total: Number(o.total),
        status: o.status || 'Processing',
        items: Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items) : []),
        shippingAddress: o.shippingaddress,
        paymentMethod: o.paymentmethod,
        isArchived: o.isarchived || false,
        user_id: o.user_id,
        useremail: o.useremail,
        timeline: o.timeline || [],
        returns_info: o.returns_info
      }));
      setOrders(mappedOrders);
    };
    fetchAllOrders();

    const channel = supabase.channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchAllOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const tabs = ['All', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Returns'];

  // Status mapping for UI display
  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    'Processing': { label: 'Processing', color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
    'Shipped': { label: 'Shipped', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Truck },
    'Out for Delivery': { label: 'Delivery on the way', color: 'text-amber-600', bg: 'bg-amber-50', icon: MapPin },
    'Delivered': { label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
    'Cancelled': { label: 'Cancelled', color: 'text-slate-500', bg: 'bg-slate-100', icon: X },
    'Return Requested': { label: 'Return Req', color: 'text-rose-600', bg: 'bg-rose-50', icon: RotateCcw },
    'Returned': { label: 'Returned', color: 'text-rose-800', bg: 'bg-rose-100', icon: RotateCcw },
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // ... same logic
      const customerName = order.shippingAddress?.fullName || 'Guest';
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.shippingaddress || '').includes(searchQuery);

      if (!matchesSearch) return false;

      if (selectedTab === 'All') return true;
      if (selectedTab === 'Returns') return order.status === 'Return Requested' || order.status === 'Returned';

      return order.status === selectedTab;
    });
  }, [orders, selectedTab, searchQuery]);

  // Quick Stats
  const stats = useMemo(() => {
    const totalRevenue = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Returned').reduce((acc, o) => acc + o.total, 0);
    const pendingCount = orders.filter(o => o.status === 'Processing').length;
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
    return [
      { label: 'Total Volume', value: `Rs. ${(totalRevenue / 1000).toFixed(1)}k`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Pending Dispatch', value: pendingCount, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Completed', value: deliveredCount, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];
  }, [orders]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, newStatus as Order['status']);
      await orderService.updateOrderStatus(id, newStatus);
    } catch (e) {
      console.error("Update failed", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePurge = (id: string) => {
    if (confirm('Permanently delete this order record? This cannot be undone.')) {
      purgeOrder(id);
    }
  };

  // Cast motion components
  const MotionDiv = (motion as any).div;
  const MotionTr = (motion as any).tr;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header & Stats */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-fario-purple shadow-[0_0_12px_#7a51a0] animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-fario-purple italic">Logistics Control</p>
          </div>
          <h1 className="text-4xl font-black font-heading italic tracking-tighter text-slate-900 leading-none">Order Management</h1>
          <p className="text-gray-400 text-sm font-medium mt-2">Monitor shipment lifecycles and update delivery protocols.</p>
        </div>

        <div className="flex flex-wrap gap-4 w-full xl:w-auto">
          {stats.map((stat, i) => (
            <div key={i} className="flex-1 min-w-[140px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-slate-900 leading-none mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redesigned Toolbar - Dropdown Style */}
      <div className="bg-white rounded-[2rem] p-3 shadow-sm border border-gray-100 sticky top-24 z-30">
        <div className="flex flex-col md:flex-row gap-3">

          {/* Search Input - Expands */}
          <div className="relative flex-grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Order ID, Customer, Zip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-fario-purple/10 transition-all placeholder:text-gray-400 h-full"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Dropdown */}
            <div className="relative z-50">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between gap-4 px-6 py-4 bg-gray-50 border border-transparent hover:border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-white hover:shadow-md transition-all min-w-[200px] h-full"
              >
                <span className="flex items-center gap-2">
                  <Filter size={14} className="text-fario-purple" />
                  <span className="text-gray-400">Status:</span>
                  <span>{selectedTab}</span>
                </span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                    <MotionDiv
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-full min-w-[220px] bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden p-2 z-50"
                    >
                      {tabs.map(tab => (
                        <button
                          key={tab}
                          onClick={() => { setSelectedTab(tab); setIsFilterOpen(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 flex items-center justify-between group ${selectedTab === tab ? 'bg-fario-purple text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'
                            }`}
                        >
                          {tab}
                          {selectedTab === tab && <CheckCircle2 size={14} />}
                        </button>
                      ))}
                    </MotionDiv>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Export Button */}
            <button className="h-full aspect-square flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:text-slate-900 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all" title="Export CSV">
              <FileDown size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">
                <th className="px-8 py-6">Manifest ID</th>
                <th className="px-6 py-6">Identity</th>
                <th className="px-6 py-6">Value</th>
                <th className="px-6 py-6">Status Protocol</th>
                <th className="px-8 py-6 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredOrders.map(order => {
                  const status = statusConfig[order.status] || statusConfig['Processing'];
                  const isUpdating = updatingId === order.id;

                  return (
                    <MotionTr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-gray-50/30 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:border-fario-purple/20 transition-colors">
                            <Box size={20} className="text-gray-300 group-hover:text-fario-purple" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">#{order.id}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock size={10} className="text-gray-400" />
                              <p className="text-[9px] font-bold text-gray-400 uppercase">{order.date}</p>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{order.shippingAddress?.fullName || order.useremail || 'Guest User'}</span>
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {order.shippingAddress?.city || 'Unknown'}, {order.shippingAddress?.zipCode || '-'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-slate-900 italic">Rs. {order.total.toLocaleString()}</span>
                        <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">{order.items.length} Units</p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="relative">
                          {isUpdating ? (
                            <div className="flex items-center gap-2 text-fario-purple px-3 py-2 bg-fario-purple/5 rounded-xl w-max border border-fario-purple/10">
                              <Loader2 size={14} className="animate-spin" />
                              <span className="text-[10px] font-black uppercase tracking-wider">Syncing...</span>
                            </div>
                          ) : (
                            <div className="relative group/status inline-block">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                className={`appearance-none pl-10 pr-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 cursor-pointer outline-none transition-all hover:shadow-lg hover:scale-105 ${status.bg} ${status.color} border-transparent hover:border-current`}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Delivery on the way</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Return Requested">Return Req</option>
                                <option value="Returned">Returned</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${status.color}`}>
                                <status.icon size={14} />
                              </div>
                              <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${status.color}`}>
                                <ChevronDown size={12} strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 rounded-xl text-gray-400 hover:text-slate-900 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200" title="Print Invoice">
                            <Printer size={16} />
                          </button>
                          <button
                            onClick={() => handlePurge(order.id)}
                            className="p-2.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </MotionTr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="py-32 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 uppercase italic">No Orders Found</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Adjust your filters or wait for new data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
