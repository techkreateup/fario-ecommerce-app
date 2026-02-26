
import React, { useState, useEffect, useRef } from 'react';
import * as RouterDOM from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ChevronLeft, Wand2, Sparkles, Rotate3d, 
  ZoomIn, ZoomOut, Maximize2, RefreshCcw,
  ShoppingCart, Info, Settings, MousePointer2,
  ShieldCheck, Loader2, Cpu, Terminal
} from 'lucide-react';
import { PRODUCTS } from '../constants';
import { ShoeCustomization } from '../types';

const { useParams, useNavigate } = RouterDOM as any;

const CustomizerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'color' | 'laces' | 'material' | 'sole'>('color');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStage, setDeploymentStage] = useState(0);
  
  const [customization, setCustomization] = useState<ShoeCustomization>({
    baseColor: '#ffffff',
    lacesColor: '#ffffff',
    lacesType: 'Flat',
    soleColor: '#ffffff',
    soleType: 'EVA',
    material: 'Mesh',
    accentColor: '#BA55D3',
    idTag: ''
  });
  const [selectedSize, setSelectedSize] = useState('');

  // ADVANCED KINETIC 3D STATE
  const rotationY = useMotionValue(0);
  const rotationX = useMotionValue(0);
  const scaleValue = useMotionValue(1);

  const springConfig = { stiffness: 40, damping: 20, mass: 0.5 };
  const springRotY = useSpring(rotationY, springConfig);
  const springRotX = useSpring(rotationX, springConfig);
  const springScale = useSpring(scaleValue, springConfig);

  const shadowOpacity = useTransform(scaleValue, [0.5, 3], [0.4, 0.05]);
  const shadowScale = useTransform(scaleValue, [0.5, 3], [0.8, 1.5]);

  // Cast motion components to any to bypass prop errors
  const MotionDiv = (motion as any).div;
  const MotionImg = (motion as any).img;

  const handleDrag = (event: any, info: any) => {
    rotationY.set(rotationY.get() + info.delta.x * 0.4);
    const newRotX = Math.min(Math.max(rotationX.get() - info.delta.y * 0.4, -25), 25);
    rotationX.set(newRotX);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return; 
      e.preventDefault();
      const delta = e.deltaY * -0.0012;
      const currentScale = scaleValue.get();
      const newScale = Math.min(Math.max(currentScale + delta, 0.6), 2.8);
      scaleValue.set(newScale);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => container?.removeEventListener('wheel', handleWheel);
  }, [scaleValue]);

  const resetView = () => {
    rotationY.set(0);
    rotationX.set(0);
    scaleValue.set(1);
  };

  const handleDeploy = () => {
    if (!selectedSize) return;
    setIsDeploying(true);
    
    const stages = [
      "Initializing Handshake...",
      "Syncing Color Matrix...",
      "Validating Material Integrity...",
      "Generating Unique Asset Hash...",
      "Committing to Archive..."
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDeploymentStage(current);
      if (current >= stages.length) {
        clearInterval(interval);
        setTimeout(() => {
          // In a real app we'd dispatch to a cart store
          navigate('/orders');
        }, 800);
      }
    }, 600);
  };

  const colors = ['#0b0b0d', '#ffffff', '#7a51a0', '#d9f99d', '#1D4ED8', '#DC2626'];
  const materials = ['Mesh', 'Leather', 'Suede', 'Knit'];
  const laces = ['Flat', 'Round', 'Reflective', 'Speed'];
  const soles = ['EVA', 'Rubber', 'Grip-Tech', 'Cloud'];

  if (!product) return null;

  return (
    <div className="bg-[#f0f2f5] h-screen w-full flex flex-col overflow-hidden text-fario-dark font-sans selection:bg-fario-purple/30">
      <AnimatePresence>
        {isDeploying && (
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12"
          >
            <div className="max-w-xl w-full space-y-16 text-center">
               <div className="relative inline-block">
                  <MotionDiv 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 rounded-full border-[2px] border-fario-purple/10 border-t-fario-purple shadow-[0_0_50px_rgba(122,81,160,0.2)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Cpu size={40} className="text-fario-purple animate-pulse" />
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic font-heading text-fario-dark">ARCHIVE <span className="text-fario-purple">SYNCHRONIZATION.</span></h2>
                    <div className="flex items-center justify-center gap-3">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Protocol v4.2 Deployment Active</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 p-8 rounded-[2rem] font-mono text-left space-y-3 relative overflow-hidden shadow-xl">
                     <div className="flex items-center gap-3 text-fario-purple mb-4">
                        <Terminal size={14} />
                        <span className="text-[10px] uppercase font-black tracking-widest">System Logs</span>
                     </div>
                     <div className="space-y-2">
                        {[
                          "Initializing Handshake...",
                          "Syncing Color Matrix...",
                          "Validating Material Integrity...",
                          "Generating Unique Asset Hash...",
                          "Committing to Archive..."
                        ].map((log, i) => (
                          <MotionDiv 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                              opacity: deploymentStage >= i ? 1 : 0.2, 
                              x: deploymentStage >= i ? 0 : -10,
                              color: deploymentStage === i ? '#7a51a0' : deploymentStage > i ? '#0e3039' : '#9ca3af'
                            } as any}
                            className="text-[11px] font-bold flex items-center gap-3"
                          >
                             {deploymentStage > i ? <ShieldCheck size={12} className="text-green-500" /> : <Loader2 size={12} className={deploymentStage === i ? "animate-spin" : "opacity-0"} />}
                             {log}
                          </MotionDiv>
                        ))}
                     </div>
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
                        <MotionDiv 
                          className="h-full bg-fario-purple shadow-[0_0_15px_#7a51a0]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(deploymentStage / 5) * 100}%` }}
                        />
                     </div>
                  </div>
               </div>

               <p className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-400 italic">DO NOT TERMINATE SESSION. ARCHIVE RECONCILIATION IN PROGRESS.</p>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <header className="h-20 px-6 md:px-12 flex items-center justify-between border-b border-gray-200 bg-white/90 backdrop-blur-2xl z-[100] flex-shrink-0">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-gray-400 hover:text-fario-purple transition-all uppercase font-black tracking-[0.3em] text-[8px] md:text-[9px] group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Abort Session</span>
        </button>
        
        <div className="flex flex-col items-center">
           <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic leading-none font-heading text-fario-dark">
             FARIO <span className="text-fario-purple animate-pulse">BESPOKE</span>
           </h1>
           <div className="flex items-center gap-2 mt-1">
             <span className="w-1 h-1 rounded-full bg-fario-purple animate-ping"></span>
             <span className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.5em] text-gray-400">Stage 04: Component Synthesis</span>
           </div>
        </div>

        <button 
          disabled={!selectedSize || isDeploying}
          onClick={handleDeploy} 
          className={`h-11 md:h-12 px-5 md:px-10 rounded-full font-black uppercase tracking-[0.2em] text-[9px] transition-all flex items-center gap-3 active:scale-95 ${
            selectedSize 
            ? 'bg-fario-purple text-white hover:bg-fario-dark hover:text-white shadow-[0_10px_40px_rgba(122,81,160,0.3)]' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          <ShoppingCart size={14} /> 
          <span className="hidden sm:inline">{selectedSize ? 'Deploy Config' : 'Dimension Required'}</span>
          <span className="sm:hidden">{selectedSize ? 'Deploy' : 'Size'}</span>
        </button>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row relative">
        <div 
          ref={containerRef}
          className="flex-grow relative flex items-center justify-center overflow-hidden bg-[#f0f2f5] cursor-grab active:cursor-grabbing"
        >
          <div className="absolute top-8 left-8 flex flex-col gap-5 z-[80]">
             <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-2.5 rounded-2xl flex flex-col gap-3 shadow-2xl">
                <button onClick={() => scaleValue.set(Math.min(scaleValue.get() + 0.25, 2.8))} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-fario-purple hover:text-white transition-all active:scale-90"><ZoomIn size={18} /></button>
                <div className="h-[1px] bg-gray-200 mx-2"></div>
                <button onClick={() => scaleValue.set(Math.max(scaleValue.get() - 0.25, 0.6))} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-fario-purple hover:text-white transition-all active:scale-90"><ZoomOut size={18} /></button>
             </div>
             <button onClick={resetView} className="w-12 h-12 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl flex items-center justify-center text-gray-600 hover:bg-fario-purple hover:text-white transition-all shadow-2xl group active:rotate-180">
                <RefreshCcw size={20} className="group-hover:rotate-45 transition-transform duration-500" />
             </button>
          </div>

          <div className="absolute bottom-8 left-8 z-[80] hidden lg:block">
             <div className="flex items-center gap-4 px-6 py-3.5 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm">
                <MousePointer2 size={16} className="text-fario-purple" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Drag to Orbit • Scroll to Zoom</span>
             </div>
          </div>

          <MotionDiv 
            style={{ 
              opacity: shadowOpacity as any, 
              scaleX: shadowScale as any, 
              scaleY: useTransform(shadowScale, s => (s as any) * 0.35) as any,
              translateY: '240%'
            } as any}
            className="absolute bottom-1/2 w-[45vw] h-20 bg-black/20 blur-[50px] rounded-[100%] pointer-events-none z-10"
          />

          <MotionDiv 
            drag
            onDrag={handleDrag as any}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0}
            style={{ 
              rotateY: springRotY as any, 
              rotateX: springRotX as any, 
              scale: springScale as any,
              transformStyle: 'preserve-3d',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            } as any} 
            className="relative z-20"
          >
             <div className="relative w-full max-w-[90%] md:max-w-[70%] lg:max-w-[60%] flex items-center justify-center pointer-events-none select-none">
                <MotionImg 
                    src={product.image} 
                    className="w-full h-auto object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.3)]" 
                    alt="Customizable Chassis"
                    style={{ 
                      filter: `drop-shadow(0 0 60px ${customization.baseColor}33)`
                    }}
                />
                
                <MotionDiv 
                  className="absolute inset-0 opacity-20 mix-blend-color transition-colors duration-1000" 
                  style={{ 
                    backgroundColor: customization.baseColor,
                    maskImage: 'url('+product.image+')',
                    WebkitMaskImage: 'url('+product.image+')',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center'
                  } as any}
                />

                {customization.idTag && (
                  <MotionDiv 
                    initial={{ scale: 0, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                    style={{ transformStyle: 'preserve-3d' } as any}
                  >
                    <div className="bg-fario-purple/90 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-[0_0_40px_rgba(122,81,160,0.5)]">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white whitespace-nowrap">ID: {customization.idTag}</span>
                    </div>
                  </MotionDiv>
                )}
             </div>
          </MotionDiv>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <h2 className="text-[25vw] font-black uppercase tracking-tighter italic text-fario-dark leading-none font-heading">
              PROTOTYPE
            </h2>
          </div>
        </div>

        <div className="w-full lg:w-[480px] bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col z-[90] flex-shrink-0 shadow-2xl">
          <div className="p-8 border-b border-gray-100">
             <div className="flex gap-1.5 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                {(['color', 'laces', 'material', 'sole'] as const).map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)} 
                    className={`flex-grow py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {activeTab === tab && (
                      <MotionDiv layoutId="activeTab" className="absolute inset-0 bg-fario-purple shadow-lg" />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="flex-grow overflow-y-auto p-10 space-y-12 scrollbar-hide">
            <AnimatePresence mode="wait">
              <MotionDiv 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                {activeTab === 'color' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Pigment Select</h3>
                       <span className="text-[8px] font-black text-fario-purple uppercase tracking-widest px-3 py-1 bg-fario-purple/10 rounded-full">Primary Chassis</span>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      {colors.map(c => (
                        <button 
                          key={c} 
                          onClick={() => setCustomization(p => ({ ...p, baseColor: c }))} 
                          className={`aspect-square rounded-[2rem] border-2 transition-all flex items-center justify-center relative group ${customization.baseColor === c ? 'border-fario-purple scale-95 ring-8 ring-fario-purple/10' : 'border-gray-100 hover:border-gray-200'}`} 
                          style={{ backgroundColor: c }}
                        >
                           <div className={`w-2 h-2 rounded-full bg-white transition-opacity ${customization.baseColor === c ? 'opacity-100 animate-pulse' : 'opacity-0 group-hover:opacity-40'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'laces' && (
                  <div className="space-y-8">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Binding Protocol</h3>
                     <div className="grid grid-cols-2 gap-4">
                      {laces.map(l => (
                        <button 
                          key={l} 
                          onClick={() => setCustomization(p => ({ ...p, lacesType: l as any }))} 
                          className={`py-8 rounded-3xl border-2 font-black uppercase text-[10px] tracking-widest transition-all ${customization.lacesType === l ? 'bg-fario-purple border-fario-purple shadow-xl text-white' : 'bg-white border-gray-100 hover:border-fario-purple/50 text-gray-400'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'material' && (
                  <div className="space-y-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Textile Matrix</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {materials.map(m => (
                        <button 
                          key={m} 
                          onClick={() => setCustomization(p => ({ ...p, material: m as any }))} 
                          className={`py-8 rounded-3xl border-2 font-black uppercase text-[10px] tracking-widest transition-all ${customization.material === m ? 'bg-fario-purple border-fario-purple shadow-xl text-white' : 'bg-white border-gray-100 hover:border-fario-purple/50 text-gray-400'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'sole' && (
                  <div className="space-y-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Traction Surface</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {soles.map(s => (
                        <button 
                          key={s} 
                          onClick={() => setCustomization(p => ({ ...p, soleType: s as any }))} 
                          className={`py-8 rounded-3xl border-2 font-black uppercase text-[10px] tracking-widest transition-all ${customization.soleType === s ? 'bg-fario-purple border-fario-purple shadow-xl text-white' : 'bg-white border-gray-100 hover:border-fario-purple/50 text-gray-400'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </MotionDiv>
            </AnimatePresence>

            <div className="pt-12 border-t border-gray-100 space-y-12">
              <div className="space-y-6">
                 <div className="flex justify-between items-center px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">ID Serialization</h3>
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">8 Chars Max</span>
                 </div>
                 <input 
                   type="text"
                   maxLength={8}
                   value={customization.idTag}
                   onChange={(e) => setCustomization(p => ({ ...p, idTag: e.target.value.toUpperCase() }))}
                   placeholder="ALPHA-01"
                   className="w-full h-18 bg-gray-50 border border-gray-200 rounded-[1.5rem] px-8 font-black text-xs uppercase tracking-[0.3em] text-fario-purple placeholder:text-gray-300 focus:ring-2 focus:ring-fario-purple outline-none transition-all"
                 />
              </div>

              <div className="space-y-6 pb-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic px-2">Dimension Specs</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSelectedSize(s)} 
                      className={`h-14 rounded-2xl border font-black text-[10px] transition-all ${selectedSize === s ? 'bg-fario-dark text-white border-fario-dark shadow-xl scale-[1.03]' : 'bg-white border-gray-100 text-gray-400 hover:text-fario-purple hover:border-fario-purple'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-white border-t border-gray-100 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.4em] text-gray-300 italic">
             <div className="flex items-center gap-3">
                <Settings size={12} className="text-fario-purple" />
                <span>Synthesis Active</span>
             </div>
             <span>Premium Grade: {customization.material}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomizerPage;
