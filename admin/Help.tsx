import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, MessageSquare, FileText, ExternalLink,
  BookOpen, Mail, Smartphone, ChevronDown, Loader2,
  Search, PlayCircle, LifeBuoy, ArrowRight
} from 'lucide-react';

const AdminHelp: React.FC = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        // Fetch from Supabase
        const { data } = await supabase.from('settings').select('value').eq('key', 'admin_faqs').single();

        if (data?.value) {
          setFaqs(data.value);
        } else {
          // Fallback Mock data
          const mockFaqs = [
            { q: 'How do I handle bulk inventory imports?', a: 'Navigate to the Inventory section and select "Bulk Action". You can upload a CSV or Excel file. Ensure your headers match our template for seamless mapping.' },
            { q: 'Can I customize the commission rates for vendors?', a: 'Yes, this can be managed in the Settings > Financials section. You can set global rates or override them for specific vendor accounts.' },
            { q: 'How do I generate tax-ready sales reports?', a: 'Go to Insights (Analytics), select your desired date range, and click "Export Archive". The system will generate a comprehensive PDF and CSV breakdown.' },
            { q: 'What should I do if a payment fails but the order is placed?', a: 'Check the Audit Logs for that specific transaction ID. If the payment status is "Pending", you can manually verify with the gateway or cancel the order if verification fails.' },
          ];
          setFaqs(mockFaqs);
        }
      } catch (err) {
        console.error('FAQ fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-24 animate-slide-up">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="admin-h1">Knowledge & Support</h1>
          <p className="admin-subtitle">Find answers to common questions and access technical documentation.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fario-purple/20 transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">

          {/* FAQ SECTION */}
          <div className="admin-card">
            <div className="flex items-center gap-3 mb-8">
              <LifeBuoy className="text-fario-purple" size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                  <Loader2 className="animate-spin text-fario-purple" size={32} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fetching Knowledge Base...</p>
                </div>
              ) : filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, i) => (
                  <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm group">
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                      className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-slate-800">{faq.q}</span>
                      <div className={`p-1.5 rounded-lg transition-all ${expandedIndex === i ? 'bg-fario-purple text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                        <ChevronDown size={18} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50/30"
                        >
                          <div className="p-6 pt-2 text-sm text-slate-500 leading-relaxed border-t border-slate-50">
                            {faq.a}
                            <div className="mt-4 flex gap-4">
                              <button className="text-[10px] font-black uppercase tracking-widest text-fario-purple hover:underline flex items-center gap-1">
                                Read Full Article <ArrowRight size={12} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="text-center p-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-400 italic">No matching articles found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* DOCUMENTATION GRID */}
          <div className="admin-card">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="text-slate-400" size={20} />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Platform Documentation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'API Integration Guide', type: 'PDF • 2.4MB', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                { title: 'Vendor Onboarding', type: 'VIDEO • 12MIN', icon: PlayCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
                { title: 'Inventory Schema v4', type: 'JSON • 120KB', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { title: 'Brand Guidelines', type: 'PDF • 15MB', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
              ].map(doc => (
                <div key={doc.title} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer group shadow-sm bg-white">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${doc.bg} ${doc.color} group-hover:scale-110 transition-transform`}>
                      <doc.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{doc.title}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{doc.type}</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-slate-300 group-hover:text-fario-purple transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR SUPPORT */}
        <div className="lg:col-span-4 space-y-6">
          <div className="admin-card bg-slate-900 text-white border-none shadow-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-fario-purple/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-fario-purple/30 transition-all duration-1000" />

            <div className="relative z-10">
              <div className="p-4 bg-white/10 rounded-2xl w-max mb-6 backdrop-blur-md border border-white/10">
                <MessageSquare className="text-fario-purple" size={32} />
              </div>
              <h3 className="text-2xl font-black font-heading italic uppercase tracking-tighter mb-4 leading-none text-white">Direct <span className="text-fario-purple">Assistance</span></h3>
              <p className="text-white/60 text-xs leading-relaxed mb-10">Our enterprise support team is available 24/7 for critical platform issues and technical guidance.</p>

              <div className="space-y-4">
                <button className="w-full py-4 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all shadow-xl">
                  <Mail size={16} className="text-fario-purple" /> Raise Support Ticket
                </button>
                <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                  <Smartphone size={16} className="text-emerald-400" /> WhatsApp Business Line
                </button>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 flex items-start gap-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><HelpCircle size={20} /></div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-1">Status: All Clear</h4>
              <p className="text-[11px] text-emerald-600 leading-relaxed font-bold">Platform systems are currently operational at peak velocity. No active incidents reported.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHelp;