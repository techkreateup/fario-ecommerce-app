
import React, { useEffect } from 'react';
import * as RouterDOM from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
   Shield, FileText, Cookie, Accessibility,
   Lock, Scale, Eye, Mail, Phone, ArrowRight,
   CheckCircle2, AlertTriangle, Globe,
   Cpu, Layers, Sparkles, ShieldCheck, CreditCard,
   Package, Smartphone, MousePointer2, User,
   Fingerprint, Database, ScanFace, ScrollText
} from 'lucide-react';
import PageNav from '../components/PageNav';
import { ASSETS } from '../constants';

// Fix missing members in react-router-dom by casting module
const { useParams, useNavigate } = RouterDOM as any;

const InfoPage: React.FC = () => {
   const { slug } = useParams();
   const navigate = useNavigate();
   const { scrollY } = useScroll();

   // Parallax effect for visual elements
   const y1 = useTransform(scrollY, [0, 500], [0, 50]);
   const rotate1 = useTransform(scrollY, [0, 500], [0, 10]);

   // Default to privacy if no slug or invalid slug
   const activeId = ['privacy', 'terms', 'cookie', 'accessibility'].includes(slug) ? slug : 'privacy';

   const handleNav = (id: string) => {
      navigate(`/info/${id}`);
   };

   // Scroll to top of window when tab changes
   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   }, [activeId]);

   // Cast motion components
   const MotionDiv = (motion as any).div;
   const MotionImg = (motion as any).img;

   // --- CONFIGURATION ---
   const CONFIG: any = {
      privacy: {
         id: 'privacy',
         color: 'from-violet-500 to-fario-purple',
         accent: 'text-violet-600',
         bg: 'bg-violet-50',
         border: 'border-violet-200',
         icon: Lock,
         title: 'Privacy Policy',
         subtitle: 'Data Protection Standards',
      },
      terms: {
         id: 'terms',
         color: 'from-orange-400 to-rose-500',
         accent: 'text-orange-600',
         bg: 'bg-orange-50',
         border: 'border-orange-200',
         icon: Scale,
         title: 'Terms of Service',
         subtitle: 'Legal Framework',
      },
      cookie: {
         id: 'cookie',
         color: 'from-emerald-400 to-teal-600',
         accent: 'text-emerald-600',
         bg: 'bg-emerald-50',
         border: 'border-emerald-200',
         icon: Cookie,
         title: 'Cookie Policy',
         subtitle: 'Digital Tracking Logic',
      },
      accessibility: {
         id: 'accessibility',
         color: 'from-blue-400 to-cyan-500',
         accent: 'text-blue-600',
         bg: 'bg-blue-50',
         border: 'border-blue-200',
         icon: Accessibility,
         title: 'Accessibility',
         subtitle: 'Inclusive Design',
      }
   };

   const activeConfig = CONFIG[activeId];

   return (
      <div className="min-h-screen bg-slate-50/50 relative overflow-x-hidden selection:bg-fario-purple selection:text-white pb-20">

         {/* --- DYNAMIC AURA BACKGROUND --- */}
         <AnimatePresence mode="wait">
            <MotionDiv
               key={activeId}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1.5 }}
               className="fixed inset-0 pointer-events-none z-0"
            >
               <div className={`absolute top-[-20%] right-[-10%] w-[90vw] h-[90vw] bg-gradient-to-b ${activeConfig.color} rounded-full blur-[180px] opacity-[0.08]`} />
               <div className={`absolute top-[30%] left-[-20%] w-[70vw] h-[70vw] bg-gradient-to-r ${activeConfig.color} rounded-full blur-[180px] opacity-[0.08]`} />
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </MotionDiv>
         </AnimatePresence>

         <div className="relative z-10 pt-28 container mx-auto px-6 max-w-7xl">
            <PageNav />

            {/* --- HERO HEADER --- */}
            <div className="mb-24 relative max-w-4xl mx-auto text-center">
               <MotionDiv
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest mb-10 ${activeConfig.bg} ${activeConfig.accent} border ${activeConfig.border}`}
               >
                  <activeConfig.icon size={16} />
                  <span>{activeConfig.subtitle}</span>
               </MotionDiv>

               <h1 className="text-6xl md:text-8xl font-black font-heading text-slate-900 tracking-tighter uppercase leading-[0.9] mb-10">
                  {activeConfig.title.split(' ')[0]} <br />
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeConfig.color}`}>
                     {activeConfig.title.split(' ').slice(1).join(' ')}
                  </span>
               </h1>

               <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-10 border-t border-slate-200 pt-8 mt-10">
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                     Last Updated: <span className="text-slate-900">January 2025</span>
                  </p>
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <span className="flex items-center gap-2"><Globe size={14} /> India (IN)</span>
                     <span className="w-1 h-1 bg-slate-300 rounded-full" />
                     <span className="flex items-center gap-2"><ShieldCheck size={14} /> Verified</span>
                  </div>
               </div>
            </div>

            {/* --- FLOATING NAVIGATION PILLS --- */}
            <div className="sticky top-6 z-50 mb-28 flex justify-center pointer-events-none">
               <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] p-1.5 rounded-2xl flex gap-1 overflow-x-auto max-w-full pointer-events-auto ring-1 ring-black/5">
                  {Object.keys(CONFIG).map((key) => {
                     const item = CONFIG[key];
                     const isActive = activeId === key;
                     return (
                        <button
                           key={key}
                           onClick={() => handleNav(key)}
                           className={`
                      relative px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                      ${isActive ? 'text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                        >
                           {isActive && (
                              <MotionDiv
                                 layoutId="nav-pill"
                                 className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color}`}
                                 transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                           )}
                           <span className="relative z-10 flex items-center gap-2">
                              {item.title.split(' ')[0]}
                           </span>
                        </button>
                     )
                  })}
               </div>
            </div>

            {/* --- MAIN CONTENT AREA (CENTERED SINGLE COLUMN) --- */}
            <AnimatePresence mode="wait">
               <MotionDiv
                  key={activeId}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
               >

                  {/* 1. PRIVACY POLICY */}
                  {activeId === 'privacy' && (
                     <section className="max-w-3xl mx-auto text-center space-y-20">
                        <div>
                           <h2 className="text-4xl text-slate-900 mb-6 font-heading font-bold uppercase tracking-tighter">Privacy Commitment</h2>
                           <p className="text-lg text-slate-600 leading-loose font-medium mb-8">
                              Your trust is our most valuable asset. At FARIO, we implement military-grade encryption and strict data sovereignty protocols to ensure your personal information remains exactly that—personal.
                           </p>

                           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm inline-block w-full text-left">
                              <h4 className="text-xs font-black text-fario-purple uppercase tracking-widest mb-6 flex items-center justify-center gap-2 border-b border-gray-50 pb-4">
                                 <ShieldCheck size={14} /> Core Privacy Pillars
                              </h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {['Zero-selling policy on personal data', 'End-to-end encrypted transactions', 'Anonymized analytics processing', 'Request-to-delete data transparency'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-xl">
                                       <div className="w-1.5 h-1.5 rounded-full bg-fario-purple shrink-0" /> {item}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </div>

                        <div className="space-y-12">
                           <h2 className="text-3xl text-slate-900 font-heading font-bold uppercase tracking-tight">Data Collection Framework</h2>

                           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10 text-left">
                              <div>
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center"><User size={24} /></div>
                                    <h4 className="text-lg font-bold uppercase tracking-widest text-slate-900 leading-none">Identity Data</h4>
                                 </div>
                                 <p className="text-sm text-slate-500 mb-4 font-medium pl-4">We collect information that identifies you as an individual to facilitate premium delivery and service:</p>
                                 <ul className="space-y-4 pl-4">
                                    {[
                                       'Legal Name & Verified Email Address',
                                       'Global Shipping Coordinates (lat/long precision for delivery)',
                                       'Encrypted Payment Tokens (PCI-DSS compliant via Stripe/PayU)',
                                       'Biometric authentication signals (where enabled by device)'
                                    ].map((item, i) => (
                                       <li key={i} className="flex items-start gap-4 text-sm font-medium text-slate-600">
                                          <CheckCircle2 size={18} className="text-violet-400 shrink-0 mt-0.5" /> {item}
                                       </li>
                                    ))}
                                 </ul>
                              </div>

                              <div className="h-px bg-slate-100 w-full" />

                              <div>
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Cpu size={24} /></div>
                                    <h4 className="text-lg font-bold uppercase tracking-widest text-slate-900 leading-none">Technical Telemetry</h4>
                                 </div>
                                 <p className="text-sm text-slate-500 mb-4 font-medium pl-4">To optimize the Fario engineering lab and web experience, we analyze anonymized signals:</p>
                                 <ul className="space-y-4 pl-4">
                                    {[
                                       'IP Address & Geolocation (Country level)',
                                       'Browser Archetype & OS Version',
                                       'Holographic session heatmaps (UI interaction points)',
                                       'System latency and error frequency logs'
                                    ].map((item, i) => (
                                       <li key={i} className="flex items-start gap-4 text-sm font-medium text-slate-600">
                                          <CheckCircle2 size={18} className="text-indigo-400 shrink-0 mt-0.5" /> {item}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </div>
                        </div>

                        <div>
                           <h2 className="text-3xl text-slate-900 mb-10 font-heading font-bold uppercase tracking-tight">Processing Purpose</h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                              {[
                                 'Fulfilling high-precision logistics requests',
                                 'Predictive inventory management via ML',
                                 'Automated fraud detection algorithms',
                                 'Personalized bespoke shoe configuration',
                                 'Priority customer engineering support',
                                 'Selective product drop notifications'
                              ].map((usage, i) => (
                                 <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-fario-purple font-black text-xs border border-slate-100">{i + 1}</div>
                                    <span className="text-sm font-bold text-slate-700">{usage}</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden text-center">
                           <div className="relative z-10 space-y-8">
                              <div>
                                 <h3 className="text-xl font-heading font-bold mb-4 text-fario-purple flex items-center justify-center gap-3"><ShieldCheck size={24} /> AES-256 Sovereignty</h3>
                                 <p className="text-slate-300 leading-relaxed text-sm font-medium max-w-xl mx-auto">
                                    Fario utilizes decentralized server architecture and AES-256 disk-level encryption. Your data is stored in isolated vaults, inaccessible to external third-parties without cryptographic clearance.
                                 </p>
                              </div>

                              <div className="pt-8 border-t border-white/10">
                                 <h3 className="text-xl font-heading font-bold mb-6 text-fario-purple">The Right to Erasure</h3>
                                 <div className="flex flex-wrap justify-center gap-3">
                                    {['Data Access Request', 'Dynamic Correction', 'Permanent Account Purge', 'Portability Export', 'Consent Revocation'].map((right, i) => (
                                       <span key={i} className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-colors">
                                          {right}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="text-center pt-10">
                           <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2 uppercase italic tracking-tighter">Privacy Nexus</h2>
                           <p className="text-slate-500 text-sm mb-8 font-medium">Direct inquiries to our Data Protection Officer.</p>
                           <a href="mailto:privacy@fario.in" className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-fario-purple transition-all shadow-xl shadow-fario-purple/10 border border-white/10">
                              <Mail size={18} /> privacy@fario.in
                           </a>
                        </div>
                     </section>
                  )}

                  {/* 2. TERMS OF SERVICE */}
                  {activeId === 'terms' && (
                     <section className="max-w-3xl mx-auto space-y-16">
                        <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                           <div className="p-4 bg-orange-100 rounded-full text-orange-600"><Scale size={32} /></div>
                           <div>
                              <h4 className="text-lg font-bold text-orange-900 mb-2 uppercase tracking-tighter">Binding Agreement</h4>
                              <p className="text-orange-800/80 text-sm leading-relaxed font-medium">
                                 By accessing the Fario digital ecosystem, you acknowledge and agree to be bound by these Terms of Service. This constitutes a legally binding contract between you and Fario Retail Pvt Ltd.
                              </p>
                           </div>
                        </div>

                        <div className="text-center">
                           <h2 className="text-3xl text-slate-900 mb-6 font-heading font-bold uppercase tracking-tight">1. Services & Eligibility</h2>
                           <p className="text-lg text-slate-600 text-center font-medium">Fario provides a premium commerce platform for curated fashion. Users must be 18+ or have parental consent to execute transactions.</p>
                        </div>

                        <div className="space-y-8">
                           <h2 className="text-3xl text-slate-900 font-heading font-bold text-center uppercase tracking-tight">2. Intellectual Architecture</h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm text-center">
                                 <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Proprietary Assets</h4>
                                 <p className="text-slate-500 text-xs leading-relaxed font-medium">All designs, codebases, and brand typography are the exclusive intellectual property of Fario. Unauthorized replication is strictly prohibited.</p>
                              </div>
                              <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm text-center">
                                 <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">User License</h4>
                                 <p className="text-slate-500 text-xs leading-relaxed font-medium">We grant a limited, non-exclusive license to use the Fario platform for personal, non-commercial procurement of goods.</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <h2 className="text-3xl text-slate-900 font-heading font-bold text-center uppercase tracking-tight">3. Procurement & Logistics</h2>
                           <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                 <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center justify-center gap-2 border-b border-slate-200/50 pb-2"><Package size={16} /> Transaction Protocol</h4>
                                    <ul className="space-y-3">
                                       {['Order placement constitutes an offer to purchase', 'Verification required for high-value drops', 'Fario reserves right to void suspicious orders', 'Stock availability is real-time but subject to sync'].map((item, i) => (
                                          <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                             <div className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0" /> {item}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                                 <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center justify-center gap-2 border-b border-slate-200/50 pb-2"><CreditCard size={16} /> Financial Settlement</h4>
                                    <ul className="space-y-3">
                                       {['Prices exclusive of regional delivery surcharges', 'Encrypted 2FA authentication required', 'Wallet funds are non-transferable', 'Discounts cannot be stacked with high-drops'].map((item, i) => (
                                          <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                             <div className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0" /> {item}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="text-center">
                           <h2 className="text-3xl text-slate-900 mb-8 font-heading font-bold uppercase tracking-tight">4. Returns & Reversals</h2>
                           <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
                              <div className="flex flex-col mb-8 gap-2 text-center">
                                 <h3 className="text-2xl font-bold text-slate-900 uppercase italic">The 30-Day Guarantee</h3>
                                 <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-4 py-1.5 rounded-full w-max mx-auto border border-slate-100">Pristine condition required for full reimbursement.</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                                 <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-4 text-center">Approved for Return</span>
                                    <ul className="space-y-3">
                                       {['Unworn footwear/apparel', 'Original holographic tags intact', 'Valid within 30 days of arrival', 'Digital receipt authentication'].map((item, i) => (
                                          <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-700 justify-center">
                                             <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> {item}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                                 <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 block mb-4 text-center">Non-Reversible</span>
                                    <ul className="space-y-3">
                                       {['Modified or custom bespoke items', 'Washed or altered materials', 'Final-sale clearance inventory', 'Undergarments and hygiene categories'].map((item, i) => (
                                          <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-700 justify-center">
                                             <X size={14} className="text-rose-500 shrink-0" /> {item}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="text-center">
                           <h2 className="text-3xl text-slate-900 mb-6 font-heading font-bold uppercase tracking-tight">5. Liabilities</h2>
                           <p className="text-sm text-slate-600 font-medium leading-loose bg-slate-50 p-8 rounded-[2rem] border border-slate-100 italic">
                              "Fario Retail Pvt Ltd shall not be liable for the indirect consequences of platform downtime or the performance of third-party logistics agents beyond the scope of original shipping fees. Our liability remains capped at the verified purchase price of the specific technical asset in question."
                           </p>
                        </div>
                     </section>
                  )}

                  {/* 3. COOKIE POLICY */}
                  {activeId === 'cookie' && (
                     <section className="max-w-3xl mx-auto space-y-16 text-center">
                        <div>
                           <h2 className="text-4xl text-slate-900 mb-6 font-heading font-bold uppercase tracking-tighter">Digital Footprints</h2>
                           <p className="text-lg text-slate-600 leading-loose font-medium mb-6">
                              Fario uses 'Session Tokens' and 'Persistent identifiers' (collectively known as Cookies) to maintain the integrity of your shopping experience and optimize our technical rendering engine.
                           </p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-6 py-3 rounded-full inline-block border border-slate-100">Zero third-party tracking cookies enabled by default.</p>
                        </div>

                        <div>
                           <h2 className="text-3xl text-slate-900 mb-10 font-heading font-bold uppercase tracking-tight">Taxonomy of Cookies</h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                              {[
                                 { title: 'Essential Core', desc: 'Critical for cart persistence and secure checkout gateway.', items: ['auth_token', 'cart_session', 'csrf_protection'], color: 'border-l-fario-purple', icon: Shield },
                                 { title: 'UX Optimization', desc: 'Memorizes UI preferences like Admin accent and theme.', items: ['fario_theme_accent', 'sidebar_state', 'last_visited'], color: 'border-l-indigo-500', icon: Layers },
                                 { title: 'Performance Lab', desc: 'Analyzes Vercel deployment latency and edge routing.', items: ['latency_probe', 'load_balancer_tag'], color: 'border-l-blue-400', icon: Cpu },
                                 { title: 'Drop Alerts', desc: 'Manages push notifications for limited sneaker releases.', items: ['notification_consent', 'flash_drop_sync'], color: 'border-l-slate-900', icon: Smartphone }
                              ].map((c, i) => (
                                 <div key={i} className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ${c.color} border-l-[6px] hover:translate-y-[-4px] transition-all duration-300`}>
                                    <div className="flex items-center gap-4 mb-4">
                                       <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                          <c.icon size={18} />
                                       </div>
                                       <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">{c.title}</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold mb-6 italic">{c.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                       {c.items.map((item, idx) => (
                                          <span key={idx} className="px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black text-slate-400 border border-slate-100 uppercase tracking-tighter">
                                             {item}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="bg-slate-900 text-white p-10 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl">
                           <h2 className="text-2xl font-bold text-white mb-4 font-heading uppercase italic tracking-tighter">Consent Management</h2>
                           <p className="text-slate-400 mb-8 max-w-lg mx-auto font-medium text-sm leading-relaxed">
                              You maintain full control over your digital identity. Adjusting these settings may impact the real-time synchronization of your bespoke Fario footwear.
                           </p>
                           <div className="flex flex-col sm:flex-row justify-center gap-4">
                              <button className="bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                                 Browser Audit Guide
                              </button>
                              <button className="bg-fario-purple text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-fario-dark transition-all shadow-xl shadow-fario-purple/20">
                                 Reset Tracking Consent
                              </button>
                           </div>
                        </div>
                     </section>
                  )}

                  {/* 4. ACCESSIBILITY */}
                  {activeId === 'accessibility' && (
                     <section className="max-w-3xl mx-auto space-y-16 text-center">
                        <div>
                           <div className="inline-flex items-center gap-4 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-sm mb-8">
                              <div className="w-2 h-2 bg-fario-purple rounded-full animate-ping" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">WCAG 2.1 AA Framework</span>
                           </div>
                           <h2 className="text-4xl text-slate-900 mb-6 font-heading font-bold uppercase tracking-tighter">Radical Inclusion</h2>
                           <p className="text-lg text-slate-600 leading-loose font-medium">
                              Fashion has no barriers. Fario is engineered to be accessible by default, ensuring that every interaction—from product drop to checkout—is intuitive for everyone, regardless of physical or cognitive ability.
                           </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {[
                              { icon: MousePointer2, title: 'Spatial UI', desc: 'Predictive focus management for keyboard-only navigation.' },
                              { icon: Smartphone, title: 'Adaptive View', desc: 'Context-aware layout shifts for assistive mobile technologies.' },
                              { icon: Layers, title: 'Color Contrast', desc: 'Synthesized 7:1 contrast ratio across all high-engagement nodes.' }
                           ].map((item, i) => (
                              <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center gap-6 text-center hover:border-fario-purple/20 transition-colors group">
                                 <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-3xl flex items-center justify-center shrink-0 group-hover:bg-fario-purple group-hover:text-white transition-all">
                                    <item.icon size={28} />
                                 </div>
                                 <div>
                                    <h4 className="text-sm font-black text-slate-900 mb-2 uppercase tracking-widest">{item.title}</h4>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed italic">{item.desc}</p>
                                 </div>
                              </div>
                           ))}
                        </div>

                        <div>
                           <h2 className="text-3xl text-slate-900 mb-8 font-heading font-bold uppercase tracking-tight">Engineering Solutions</h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-left">
                                 <h4 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-widest">
                                    <CheckCircle2 className="text-fario-purple" size={18} /> Navigation Logic
                                 </h4>
                                 <ul className="space-y-4">
                                    {['Dynamic Skip-to-content links', 'Non-trapped tab indexing', 'Visible focus rings on interaction', 'Predictive keyboard shortcuts'].map((feat, i) => (
                                       <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-white/50 p-2 rounded-lg border border-slate-100/50">
                                          <div className="w-1 h-1 bg-fario-purple rounded-full shrink-0" /> {feat}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-left">
                                 <h4 className="text-sm font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-widest">
                                    <Eye className="text-fario-purple" size={18} /> Screen Optimization
                                 </h4>
                                 <ul className="space-y-4">
                                    {['Semantic ARIA landmark structure', 'Haptic feedback for screen readers', 'Alt-text generated by Fario AI', 'Responsive font-scale architecture'].map((feat, i) => (
                                       <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-white/50 p-2 rounded-lg border border-slate-100/50">
                                          <div className="w-1 h-1 bg-fario-purple rounded-full shrink-0" /> {feat}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-sm">
                           <div>
                              <h3 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tighter">Future-Proofing</h3>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-fario-purple">V3.0 Roadmap Targets:</p>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {['Neural Voice Checkout', 'Bionic Sight Optimization', 'Global Braille Integration'].map((issue, i) => (
                                 <span key={i} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{issue}</span>
                              ))}
                           </div>
                        </div>

                        <div className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
                           <div className="relative z-10">
                              <h2 className="text-2xl font-heading font-bold mb-4 uppercase italic tracking-tighter">Accessibility Lab</h2>
                              <p className="text-white/60 mb-8 max-w-md mx-auto text-sm font-medium leading-loose">
                                 Help us build the most inclusive fashion platform in the world. Reporting a barrier takes less than 60 seconds.
                              </p>
                              <div className="flex flex-col sm:flex-row justify-center gap-4">
                                 <a href="mailto:accessibility@fario.in" className="flex items-center justify-center gap-3 bg-white text-slate-900 rounded-2xl px-10 py-5 font-black uppercase text-xs tracking-widest hover:bg-fario-purple hover:text-white transition-all shadow-xl shadow-white/5">
                                    <Mail size={16} /> Open Feedback Node
                                 </a>
                                 <a href="tel:+919876543210" className="flex items-center justify-center gap-3 bg-white/10 border border-white/10 text-white rounded-2xl px-10 py-5 font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all">
                                    <Phone size={16} /> Voice Portal
                                 </a>
                              </div>
                           </div>
                        </div>
                     </section>
                  )}

               </MotionDiv>
            </AnimatePresence>

            {/* --- GLOBAL FOOTER FOR INFO PAGES --- */}
            <div className="mt-32 pt-16 border-t border-slate-200 text-center space-y-10">
               <div className="space-y-4">
                  <h4 className="text-2xl font-black font-heading text-slate-900 uppercase italic tracking-tight">Fario Secure Product</h4>
                  <div className="flex items-center justify-center gap-3 text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 py-2 px-6 rounded-full w-max mx-auto border border-emerald-100">
                     <ShieldCheck size={16} /> End-to-End Encrypted
                  </div>
                  <p className="text-slate-500 text-sm font-medium">Your digital footprint is anonymized & secured.</p>
               </div>

               <div className="flex flex-col items-center gap-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                     © 2025 FARIO. All Rights Reserved.
                  </p>
                  <div className="flex gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                     <span>Privacy</span>
                     <span>•</span>
                     <span>Terms</span>
                     <span>•</span>
                     <span>Security</span>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

// Helper components for icons
const BarChart3 = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>;
const Megaphone = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>;
const X = ({ size, className }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;

export default InfoPage;
