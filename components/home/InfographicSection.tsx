import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BG_LIGHT, BG_DARK, LIME } from './HomeConstants';

const features = [
  {
    id: 'fit',
    title: 'Adaptive Fit',
    description: 'Smart mesh fibers expand and contract to mold perfectly to unique foot shapes.',
    visual: (
      <svg viewBox="0 0 200 200" className="w-full h-full stroke-fario-lime fill-none stroke-2">
        {/* Abstract Mesh that breathes */}
        <motion.path
          d="M40,100 C40,60 160,60 160,100 C160,140 40,140 40,100 Z"
          animate={{
            d: [
              "M40,100 C40,60 160,60 160,100 C160,140 40,140 40,100 Z",
              "M30,100 C30,40 170,40 170,100 C170,160 30,160 30,100 Z",
              "M40,100 C40,60 160,60 160,100 C160,140 40,140 40,100 Z"
            ],
            strokeWidth: [2, 4, 2],
            strokeOpacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M50,100 C50,70 150,70 150,100 C150,130 50,130 50,100 Z"
          animate={{
            d: [
              "M50,100 C50,70 150,70 150,100 C150,130 50,130 50,100 Z",
              "M45,100 C45,60 155,60 155,100 C155,140 45,140 45,100 Z",
              "M50,100 C50,70 150,70 150,100 C150,130 50,130 50,100 Z"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          opacity="0.6"
        />
        {/* Grid Lines */}
        {[...Array(5)].map((_, i) => (
          <motion.line
            key={i}
            x1={60 + i * 20} y1={60} x2={60 + i * 20} y2={140}
            strokeDasharray="4 4"
            animate={{ y1: [60, 50, 60], y2: [140, 150, 140] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
          />
        ))}
      </svg>
    )
  },
  {
    id: 'cushion',
    title: 'Cushioned Comfort',
    description: 'High-density memory foam absorbs impact and returns energy with every step.',
    visual: (
      <svg viewBox="0 0 200 200" className="w-full h-full fill-none">
        {/* Floor Lines */}
        <motion.line x1="20" y1="150" x2="180" y2="150" stroke="#4b5563" strokeWidth="2" />

        {/* Compressed Layers */}
        {[0, 10, 20].map((offset, i) => (
          <motion.path
            key={i}
            d={`M40,${140 - offset} Q100,${140 - offset} 160,${140 - offset}`}
            stroke="#7a51a0"
            strokeWidth="4"
            animate={{
              d: [
                `M40,${140 - offset} Q100,${140 - offset} 160,${140 - offset}`,
                `M40,${140 - offset} Q100,${160 - offset} 160,${140 - offset}`,
                `M40,${140 - offset} Q100,${140 - offset} 160,${140 - offset}`
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "circInOut" }}
          />
        ))}

        {/* Bouncing Energy Ball */}
        <motion.circle
          cx={100}
          cy={100}
          r={15}
          fill="#d9f99d"
          animate={{ cy: [60, 120, 60], scaleY: [1, 0.8, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "circInOut" }}
        />

        {/* Impact Rings */}
        <motion.ellipse
          cx={100} cy={140} rx={10} ry={2}
          stroke="#d9f99d"
          animate={{ rx: [10, 40], opacity: [1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      </svg>
    )
  },
  {
    id: 'grip',
    title: 'Anti-Skid Grip',
    description: 'Advanced tread patterns lock onto surfaces for maximum traction and safety.',
    visual: (
      <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-fario-lime stroke-2">
        {/* Moving Tread Pattern */}
        <defs>
          <pattern id="tread" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0,20 L20,0 L40,20 M0,40 L20,20 L40,40" fill="none" stroke="currentColor" strokeWidth="2" />
          </pattern>
        </defs>

        <motion.rect
          x={0} y={0} width={200} height={200} fill="url(#tread)"
          animate={{ y: [0, 40] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          mask="url(#circleMask)"
        />

        {/* Mask to keep it in circle */}
        <mask id="circleMask">
          <circle cx="100" cy="100" r="80" fill="white" />
        </mask>

        {/* Lock Icon Overlay */}
        <motion.circle
          cx="100" cy="100" r="85" stroke="#0e3039" strokeWidth="10"
          animate={{ stroke: ["#0e3039", "#d9f99d", "#0e3039"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" strokeDasharray="10 5" />
      </svg>
    )
  },
  {
    id: 'fresh',
    title: 'Freshness Control',
    description: 'Antimicrobial lining promotes airflow and prevents odors all day long.',
    visual: (
      <svg viewBox="0 0 200 200" className="w-full h-full fill-none">
        {/* Shield Boundary */}
        <path d="M100,30 L160,50 V100 C160,140 100,180 100,180 C100,180 40,140 40,100 V50 L100,30 Z" stroke="#7a51a0" strokeWidth="2" />

        {/* Particles Flowing Up */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            r={Math.random() * 3 + 2}
            fill="#d9f99d"
            initial={{ x: 70 + Math.random() * 60, y: 160, opacity: 0 }}
            animate={{ y: 40, opacity: [0, 1, 0] }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Wavy Air Lines */}
        {[1, 2, 3].map(i => (
          <motion.path
            key={`line-${i}`}
            d={`M${80 + i * 10},150 Q${90 + i * 10},120 ${80 + i * 10},90 T${80 + i * 10},30`}
            stroke="white"
            strokeOpacity="0.2"
            strokeDasharray="5 5"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    )
  }
];

const InfographicSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto rotate features every 5 seconds if user hasn't interacted recently
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: BG_LIGHT }}>

      {/* Jagged Top Edge */}
      <div className="absolute top-0 left-0 w-full h-12 clip-path-jagged-top rotate-180 translate-y-1 z-10" style={{ background: BG_LIGHT }}></div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="px-3 py-1 bg-fario-dark text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-4 inline-block font-heading">
            Engineering Lab
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold font-heading uppercase tracking-tight" style={{ color: BG_DARK }}>
            Science in <span className="text-outline">Motion</span>
          </h2>
        </div>

        {/* Interactive Lab Interface */}
        <div className="rounded-3xl p-6 md:p-12 shadow-2xl overflow-hidden flex flex-col lg:flex-row gap-12 text-white border relative"
          style={{ background: BG_DARK, borderColor: 'rgba(255,255,255,0.05)' }}
        >

          {/* Background Texture: Shoe Pattern (Sneakers/Prints) instead of software grid */}
          <div className="absolute inset-0 bg-shoe-pattern opacity-20 pointer-events-none"></div>

          {/* Abstract Shoe Sole Watermark */}
          <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-fario-lime/5 rounded-full blur-[80px] pointer-events-none"></div>

          {/* Controls (Left Side) */}
          <div className="lg:w-1/2 flex flex-col justify-center space-y-2 relative z-10">
            {features.map((feature, idx) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveIdx(idx)}
                className={`text-left p-6 rounded-xl transition-all duration-300 border-l-4 group relative overflow-hidden ${activeIdx === idx
                  ? 'bg-white/10 border-fario-lime'
                  : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                whileHover={{ x: 10 }}
              >
                <div className="flex justify-between items-center mb-1 relative">
                  <h3 className={`text-xl font-bold font-heading ${activeIdx === idx ? '' : 'text-white group-hover:text-gray-200'}`}
                    style={{ color: activeIdx === idx ? LIME : undefined }}
                  >
                    {feature.title}
                  </h3>
                  {activeIdx === idx && (
                    <motion.div layoutId="active-dot" className="w-2 h-2 rounded-full absolute right-0" style={{ background: LIME }} />
                  )}
                </div>
                <p className={`text-sm ${activeIdx === idx ? 'text-gray-300' : 'text-gray-500'}`}>
                  {feature.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Visualization Viewport (Right Side) */}
          <div className="lg:w-1/2 min-h-[300px] lg:min-h-[400px] bg-black/40 rounded-[2.5rem] border border-white/10 relative flex items-center justify-center overflow-hidden">

            {/* Tech Overlay Lines -> Rounded for Shoe Aesthetic */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 rounded-tl-2xl opacity-40" style={{ borderColor: LIME }}></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 rounded-br-2xl opacity-40" style={{ borderColor: LIME }}></div>

            <div className="absolute top-8 right-8 text-xs font-bold font-heading opacity-60 tracking-widest" style={{ color: LIME }}>
              MATERIAL.LAB // 0{activeIdx + 1}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                className="w-full h-full p-12 max-w-sm"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
              >
                {features[activeIdx].visual}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Jagged Bottom Edge */}
      <div className="absolute bottom-0 left-0 w-full h-12 clip-path-jagged-top z-10" style={{ background: BG_DARK }}></div>
    </section>
  );
};

export default InfographicSection;