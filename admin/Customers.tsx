
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Search, UserPlus, Mail, Phone,
   Download, X, Trash2, Eye,
   TrendingUp, Activity,
   Crown, Users
} from 'lucide-react';

interface Customer {
   id: string;
   name: string;
   email: string;
   phone: string;
   totalSpent: number;
   orders: number;
   status: 'Active' | 'Inactive' | 'Suspended';
   joined: string;
   tier?: 'Standard' | 'Gold' | 'Platinum';
}

// Helper for Tier Logic
const calculateTier = (total: number) => {
   if (total > 50000) return 'Platinum';
   if (total > 10000) return 'Gold';
   return 'Standard';
};

const Customers: React.FC = () => {
   const [customers, setCustomers] = useState<Customer[]>([]);
   // Removed unused isLoading

   // Fetch from Supabase customer_stats_view
   useEffect(() => {
      const fetchCustomers = async () => {
         try {
            const { supabase } = await import('../lib/supabase');

            const { data, error } = await supabase
               .from('customer_stats_view')
               .select('*');

            if (error) throw error;

            const mapped: Customer[] = (data || []).map(row => ({
               id: row.id,
               name: row.name || 'Unknown',
               email: row.email || 'No Email',
               phone: row.phone || 'No Phone',
               totalSpent: row.total_spent || 0,
               orders: row.order_count || 0,
               status: 'Active' as const,
               joined: new Date(row.joined || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
               tier: calculateTier(row.total_spent || 0)
            }));

            setCustomers(mapped);

         } catch (err) {
            console.error("Failed to load customers:", err);
         }
      };

      fetchCustomers();
   }, []);

   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Suspended'>('All');
   const [isAdding, setIsAdding] = useState(false);
   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);

   // Form State
   const [formData, setFormData] = useState<Partial<Customer>>({ name: '', email: '', phone: '' });

   // Derived Stats
   const stats = useMemo(() => {
      const total = customers.length;
      const active = customers.filter(c => c.status === 'Active').length;
      const totalRev = customers.reduce((acc, c) => acc + c.totalSpent, 0);
      const avgLtv = total > 0 ? totalRev / total : 0;
      const highValueCount = customers.filter(c => c.totalSpent > 10000).length;
      const highValuePct = total > 0 ? Math.round((highValueCount / total) * 100) : 0;

      return [
         { label: 'Total Customers', value: total, sub: 'Registered Accounts', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
         { label: 'Active Users', value: active, sub: 'Currently Active', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
         { label: 'Avg LTV', value: `Rs. ${avgLtv.toFixed(0)}`, sub: 'Revenue Per User', icon: TrendingUp, color: 'text-fario-purple', bg: 'bg-fario-purple/5' },
         { label: 'High Value %', value: `${highValuePct}%`, sub: 'Spend > 10k', icon: Crown, color: 'text-amber-600', bg: 'bg-amber-50' },
      ];
   }, [customers]);

   const filtered = useMemo(() => {
      return customers.filter(c => {
         const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toLowerCase().includes(searchTerm.toLowerCase());
         const matchesFilter = statusFilter === 'All' || c.status === statusFilter;
         return matchesSearch && matchesFilter;
      });
   }, [customers, searchTerm, statusFilter]);

   // --- REAL-TIME SUBSCRIPTION ---
   useEffect(() => {
      let channel: any;
      let supabaseInstance: any;

      const subscribeToCustomers = async () => {
         const { supabase } = await import('../lib/supabase');
         supabaseInstance = supabase;
         channel = supabase
            .channel('customer_changes')
            .on(
               'postgres_changes',
               { event: '*', schema: 'public', table: 'profiles' },
               () => {
                  window.location.reload();
               }
            )
            .subscribe();
      };
      subscribeToCustomers();
      return () => {
         if (channel && supabaseInstance) supabaseInstance.removeChannel(channel);
      };
   }, []);

   const handleDelete = async (id: string) => {
      if (window.confirm('CRITICAL: Purge this identity from the global registry? Action is irreversible.')) {
         try {
            const { supabase } = await import('../lib/supabase');
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (error) throw error;

            setCustomers(prev => prev.filter(c => c.id !== id));
            if (selectedCustomer?.id === id) setSelectedCustomer(null);
         } catch (err) {
            console.error('Failed to delete customer:', err);
            alert('Failed to delete customer. Ensure no dependent orders exist.');
         }
      }
   };

   const toggleStatus = async (id: string) => {
      alert('Status toggling requires "status" column in profiles table. Only local state updated for now.');
      setCustomers(prev => prev.map(c => {
         if (c.id === id) {
            const nextStatus = c.status === 'Active' ? 'Suspended' : 'Active';
            return { ...c, status: nextStatus };
         }
         return c;
      }));
   };

   const handleAddSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);
      try {
         alert('Note: Creating a customer manually usually requires an associated Auth Account. This feature is limited in client-side admin panels.');
         setIsProcessing(false);
         setIsAdding(false);
      } catch (err) {
         console.error(err);
         setIsProcessing(false);
      }
   };

   const handleExport = () => {
      // CSV Export Logic
      const csvContent = "data:text/csv;charset=utf-8,"
         + "ID,Name,Email,Phone,Total Spent,Orders,Status\n"
         + customers.map(c => `${c.id},${c.name},${c.email},${c.phone},${c.totalSpent},${c.orders},${c.status}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "fario_customers_registry.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const getTierStyle = (tier: string = 'Standard') => {
      switch (tier) {
         case 'Platinum': return 'bg-fario-purple text-white';
         case 'Gold': return 'bg-amber-100 text-amber-700';
         default: return 'bg-gray-100 text-gray-600';
      }
   };

   // Cast motion components
   const MotionDiv = (motion as any).div;

   return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-24 max-w-7xl mx-auto px-6">
         {/* HEADER */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8">
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-fario-purple" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-fario-purple">Customer Database</p>
               </div>
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Management</h1>
               <p className="text-slate-500 text-sm font-medium mt-1">
                  View, analyze, and manage customer accounts, orders, and loyalty tiers.
               </p>
            </div>

            <button
               onClick={() => setIsAdding(true)}
               className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md"
            >
               <UserPlus size={16} />
               Add New Customer
            </button>
         </div>

         {/* STATS */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
               <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                     <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={20} />
                     </div>
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                     <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mt-1">{stat.label}</p>
                     <p className={`text-[10px] font-bold mt-1 ${stat.color}`}>{stat.sub}</p>
                  </div>
               </div>
            ))}
         </div>

         {/* FILTER BAR */}
         <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 sticky top-24 z-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                     type="text"
                     placeholder="Search Identity, Email, Phone..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-fario-purple/10 transition-all"
                  />
               </div>

               <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  {/* Status Tabs */}
                  <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-50">
                     {(['All', 'Active', 'Inactive', 'Suspended'] as const).map(status => (
                        <button
                           key={status}
                           onClick={() => setStatusFilter(status)}
                           className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === status
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-gray-400 hover:text-slate-600'
                              }`}
                        >
                           {status}
                        </button>
                     ))}
                  </div>

                  <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

                  <button
                     onClick={handleExport}
                     className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                     <Download size={14} /> Export
                  </button>
               </div>
            </div>
         </div>

         {/* TABLE/LIST GRID */}
         <div className="flex flex-col gap-3">
            <AnimatePresence>
               {filtered.map((c) => (
                  <MotionDiv
                     key={c.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all group"
                  >
                     <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">

                        {/* Avatar & ID */}
                        <div className="flex items-center gap-4 w-full lg:w-[25%]">
                           <div className="w-12 h-12 rounded-xl bg-slate-100 border border-white shadow-sm flex items-center justify-center text-sm font-black text-slate-500">
                              {c.name.substring(0, 2).toUpperCase()}
                           </div>
                           <div>
                              <h3 className="text-sm font-bold text-slate-900 group-hover:text-fario-purple transition-colors">{c.name}</h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                 <span className="text-[10px] font-mono text-slate-400">{c.id}</span>
                                 <span className="text-[10px] text-slate-400">• Joined {c.joined}</span>
                              </div>
                           </div>
                        </div>

                        {/* Contact (Email/Phone) */}
                        <div className="flex flex-col gap-1 w-full lg:w-[25%]">
                           <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                              <Mail size={12} className="text-slate-300" /> {c.email}
                           </div>
                           <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                              <Phone size={12} className="text-slate-300" /> {c.phone}
                           </div>
                        </div>

                        {/* Stats (Rev/Orders) */}
                        <div className="flex items-center gap-8 w-full lg:w-[25%]">
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lifetime Val</p>
                              <p className="text-sm font-black text-slate-900">Rs. {c.totalSpent.toLocaleString()}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Orders</p>
                              <p className="text-sm font-black text-slate-900">{c.orders}</p>
                           </div>
                        </div>

                        {/* Status & Tier */}
                        <div className="flex items-center gap-4 w-full lg:w-[25%] justify-between lg:justify-end">
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${getTierStyle(c.tier)}`}>
                              {c.tier || 'Standard'}
                           </span>

                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setSelectedCustomer(c)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-fario-purple">
                                 <Eye size={16} />
                              </button>
                              <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </div>

                     </div>
                  </MotionDiv>
               ))}
            </AnimatePresence>

            {filtered.length === 0 && (
               <div className="py-20 text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">No customers found</p>
               </div>
            )}
         </div>

         {/* --- ADD CUSTOMER MODAL (Simple Center) --- */}
         <AnimatePresence>
            {isAdding && (
               <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
                  <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                  <MotionDiv
                     initial={{ scale: 0.95, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.95, opacity: 0 }}
                     className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
                  >
                     <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Add Customer</h2>
                        <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-900"><X size={18} /></button>
                     </div>

                     <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                           <input
                              required
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-fario-purple/10"
                              placeholder="Name"
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
                           <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-fario-purple/10"
                              placeholder="Email"
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                           <input
                              required
                              value={formData.phone}
                              onChange={e => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-fario-purple/10"
                              placeholder="Phone"
                           />
                        </div>

                        <button
                           type="submit"
                           disabled={isProcessing}
                           className="w-full py-3 bg-fario-dark text-white rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-slate-800 transition-all mt-4"
                        >
                           {isProcessing ? 'Processing...' : 'Create Account'}
                        </button>
                     </form>
                  </MotionDiv>
               </div>
            )}
         </AnimatePresence>

         {/* --- DOSSIER SLIDE-OVER (Refined) --- */}
         <AnimatePresence>
            {selectedCustomer && (
               <div className="fixed inset-0 z-[3000] flex justify-end">
                  <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
                  <MotionDiv
                     initial={{ x: '100%' }}
                     animate={{ x: 0 }}
                     exit={{ x: '100%' }}
                     transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                     className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
                  >
                     <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div>
                           <h2 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h2>
                           <p className="text-xs font-medium text-slate-500">{selectedCustomer.id}</p>
                        </div>
                        <button onClick={() => setSelectedCustomer(null)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-400 hover:text-slate-900"><X size={16} /></button>
                     </div>

                     <div className="p-6 space-y-6 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 rounded-xl bg-slate-50 border border-gray-100">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lifetime Value</p>
                              <p className="text-xl font-black text-slate-900 mt-1">Rs. {selectedCustomer.totalSpent.toLocaleString()}</p>
                           </div>
                           <div className="p-4 rounded-xl bg-slate-50 border border-gray-100">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                              <p className="text-xl font-black text-slate-900 mt-1">{selectedCustomer.orders}</p>
                           </div>
                        </div>

                        <div>
                           <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2">Contact Details</h3>
                           <div className="space-y-3">
                              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                 <Mail size={16} className="text-slate-300" /> {selectedCustomer.email}
                              </div>
                              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                 <Phone size={16} className="text-slate-300" /> {selectedCustomer.phone}
                              </div>
                           </div>
                        </div>

                        <div>
                           <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2">Actions</h3>
                           <div className="flex gap-3">
                              <button onClick={() => toggleStatus(selectedCustomer.id)} className="flex-1 py-3 border border-gray-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-gray-50">
                                 {selectedCustomer.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                              </button>
                              <button onClick={() => handleDelete(selectedCustomer.id)} className="flex-1 py-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-100">Delete</button>
                           </div>
                        </div>
                     </div>
                  </MotionDiv>
               </div>
            )}
         </AnimatePresence>

      </div>
   );
};

export default Customers;
