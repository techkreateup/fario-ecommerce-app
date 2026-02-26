import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Package, Clock, Box, Satellite, RefreshCw } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types';

const Tracking: React.FC = () => {
   const [activeOrders, setActiveOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchOrders = async () => {
         try {
            const orders = await orderService.getAllOrders();
            // Filter for active orders (not Delivered or Cancelled)
            const active = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
            setActiveOrders(active);
         } catch (err) {
            console.error("Tracking fetch error:", err);
         } finally {
            setLoading(false);
         }
      };
      fetchOrders();
   }, []);

   const getProgressValue = (status: string) => {
      switch (status) {
         case 'Order Placed': return 25;
         case 'Processing': return 50;
         case 'Shipped': return 75;
         case 'Out for Delivery': return 90;
         case 'Delivered': return 100;
         default: return 10;
      }
   };

   const getETA = (createdAt: string) => {
      const date = new Date(createdAt);
      date.setDate(date.getDate() + 4); // Estimated 4 days
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
   };

   // Cast motion components to any to bypass prop errors
   const MotionDiv = (motion as any).div;

   return (
      <div className="space-y-12 pb-20">
         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <h1 className="text-4xl font-bold font-heading italic tracking-tighter text-deep-teal leading-none mb-3">Node Tracking</h1>
               <p className="text-[11px] font-black uppercase tracking-[0.4em] text-orchid">Global Fulfillment Logistics Matrix</p>
            </div>
            <div className="flex items-center gap-5 px-8 py-4 bg-white border border-glass-border rounded-2xl shadow-luxury transition-all hover:shadow-2xl">
               <Satellite size={20} className="text-orchid animate-pulse" />
               <div className="text-left border-l border-slate-100 pl-5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Satellite Uplink</p>
                  <p className="text-xs font-black text-deep-teal uppercase">Connected // Stable</p>
               </div>
            </div>
         </header>

         <div className="space-y-10">
            {loading ? (
               <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                  <RefreshCw className="text-orchid animate-spin mb-4" size={48} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronizing nodes...</p>
               </div>
            ) : activeOrders.length === 0 ? (
               <div className="grand-panel py-20 text-center opacity-60">
                  <Package size={64} className="mx-auto text-slate-100 mb-6" />
                  <h3 className="text-2xl font-black italic text-slate-300 uppercase tracking-tighter">All Nodes Delivered</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Logistics matrix is currently at rest.</p>
               </div>
            ) : (
               <AnimatePresence>
                  {activeOrders.map((order, idx) => {
                     const progress = getProgressValue(order.status);
                     return (
                        <MotionDiv
                           key={order.id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           transition={{ delay: idx * 0.1 }}
                           className="grand-panel relative group overflow-hidden"
                        >
                           <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                              <Box size={240} className="text-orchid" />
                           </div>

                           <div className="flex flex-col lg:flex-row gap-16 relative z-10">
                              <div className="lg:w-72 border-r border-slate-50 space-y-8 shrink-0">
                                 <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-3">Manifest ID</p>
                                    <h2 className="text-3xl font-heading font-black italic text-deep-teal group-hover:text-orchid transition-colors">#{order.id.slice(0, 12)}</h2>
                                    <p className="text-[10px] text-slate-400 font-medium mt-1 truncate">{order.useremail}</p>
                                 </div>

                                 <div className="space-y-5">
                                    <div className="flex items-center gap-3 text-slate-500">
                                       <MapPin size={16} className="text-orchid" />
                                       <span className="text-[11px] font-black uppercase tracking-widest truncate">{order.shippingaddress || 'Hub Storage'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400">
                                       <Clock size={16} />
                                       <span className="text-[11px] font-black uppercase tracking-widest">ETA Protocol: {getETA(order.createdat || new Date().toISOString())}</span>
                                    </div>
                                 </div>

                                 <div className="pt-6 border-t border-slate-50">
                                    <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] shadow-sm ${order.status === 'Delivered' ? 'bg-sage-green/10 text-sage-green border border-sage-green/20' : 'bg-orchid/10 text-orchid border border-orchid/20'}`}>
                                       {order.status}
                                    </span>
                                 </div>
                              </div>

                              <div className="flex-grow flex flex-col justify-center">
                                 <div className="flex justify-between items-end mb-6 px-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Logistics Progress Sequence</p>
                                    <span className="text-3xl font-black text-deep-teal italic tracking-tighter">{progress}%</span>
                                 </div>
                                 <div className="h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                                    <MotionDiv
                                       initial={{ width: 0 }}
                                       whileInView={{ width: `${progress}%` } as any}
                                       transition={{ duration: 1.5, ease: "easeOut" }}
                                       className="h-full bg-gradient-to-r from-orchid to-sage-green rounded-full shadow-[0_0_15px_rgba(238,130,238,0.4)]"
                                    />
                                 </div>

                                 <div className="grid grid-cols-4 gap-4 mt-12">
                                    {['Init Protocol', 'Hub Transfer', 'Sort Routing', 'Final Delivery'].map((step, i) => (
                                       <div key={i} className={`text-center space-y-3 transition-opacity duration-700 ${progress >= (i + 1) * 25 ? 'opacity-100' : 'opacity-20'}`}>
                                          <div className={`w-2.5 h-2.5 rounded-full mx-auto transition-all duration-700 ${progress >= (i + 1) * 25 ? 'bg-orchid shadow-[0_0_10px_#EE82EE] scale-110' : 'bg-slate-200'}`} />
                                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{step}</p>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="lg:w-64 flex flex-col gap-4 justify-center">
                                 <button onClick={() => window.location.hash = `#/admin/orders`} className="grand-btn btn-orchid-gradient w-full">Update Status</button>
                                 <button className="grand-btn btn-white-glass w-full">Trace Artifacts</button>
                              </div>
                           </div>
                        </MotionDiv>
                     );
                  })}
               </AnimatePresence>
            )}
         </div>
      </div>
   );
};

export default Tracking;