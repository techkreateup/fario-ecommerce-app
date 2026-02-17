
import React from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../../constants';
import * as RouterDOM from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Fix missing NavLink in react-router-dom
const { NavLink } = RouterDOM as any;

const categories = [
  {
    id: 1,
    title: 'School Shoes',
    subtitle: 'Built Tough',
    image: ASSETS.products.shoe1,
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-2',
    bg: 'bg-[#F4F4F5]',
    textColor: 'text-fario-dark',
    // Fixed: Centered layout that fills the 2x2 space naturally
    imgWrapper: 'absolute inset-0 flex items-center justify-center pt-24 pb-8 px-8',
    imgClass: 'w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700'
  },
  {
    id: 2,
    title: 'Sport',
    subtitle: 'Performance',
    image: ASSETS.products.shoe2,
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    bg: 'bg-[#d9f99d]',
    textColor: 'text-fario-dark',
    // Fixed: Matched exactly to the "Bags" layout which works well
    imgWrapper: 'absolute inset-0 top-16 p-6 flex items-center justify-center',
    imgClass: 'object-contain w-full h-full group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500 ease-out'
  },
  {
    id: 3,
    title: 'Bags',
    subtitle: 'Ergonomic',
    image: ASSETS.products.bag1,
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    bg: 'bg-[#e0e7ff]',
    textColor: 'text-fario-dark',
    // Reference: This is the "Good" one, kept as baseline
    imgWrapper: 'absolute inset-0 top-16 p-6 flex items-center justify-center',
    imgClass: 'object-contain w-full h-full group-hover:-rotate-6 group-hover:scale-110 transition-transform duration-500 ease-out'
  },
  {
    id: 4,
    title: 'Accessories',
    subtitle: 'Essentials',
    image: ASSETS.products.socks1,
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-1',
    bg: 'bg-white',
    textColor: 'text-fario-dark',
    // Fixed: Increased width to 55% and adjusted centering to reduce whitespace
    imgWrapper: 'absolute inset-y-0 right-0 w-[55%] flex items-center justify-center p-4',
    imgClass: 'object-contain h-[90%] w-full group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700 ease-out origin-center'
  },
];

const CategoryGrid: React.FC = () => {
  // Cast motion components to any to bypass prop errors
  const MotionDiv = (motion as any).div;
  const MotionImg = (motion as any).img;

  return (
    <section className="py-24 bg-fario-dark relative">
      {/* Torn Edge Top */}
      <div className="absolute top-0 left-0 w-full h-20 -mt-1 z-10 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-full fill-white" style={{ transform: 'rotate(180deg)' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <MotionDiv
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-semibold font-heading text-white uppercase tracking-tighter italic leading-none">
              Explore <br /> <span className="text-fario-lime">The Gear</span>
            </h2>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-right"
          >
            <p className="text-gray-400 max-w-xs ml-auto text-xs font-bold leading-relaxed uppercase tracking-[0.2em]">
              Modules engineered for <br />next-gen academic performance.
            </p>
          </MotionDiv>
        </div>

        {/* Compact Grid with 280px row height to reduce boxiness */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-6">
          {categories.map((cat, idx) => (
            <MotionDiv
              key={cat.id}
              className={`relative rounded-[2.5rem] overflow-hidden group cursor-pointer ${cat.bg} ${cat.colSpan} ${cat.rowSpan} shadow-2xl ring-1 ring-black/5`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, ease: "easeOut" }}
            >
              <NavLink to="/products" className="block w-full h-full relative">

                {/* 1. TEXT LAYER (Highest Z-Index, absolute positioning) */}
                <div className="absolute top-0 left-0 p-8 z-30 w-full pointer-events-none">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-2xl md:text-3xl font-bold font-heading ${cat.textColor} tracking-tight leading-none mb-2 transition-transform duration-500 group-hover:translate-x-2`}>
                        {cat.title}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/40 backdrop-blur-md rounded-full border border-white/20">
                        <span className={`w-1.5 h-1.5 rounded-full ${idx % 2 === 0 ? 'bg-fario-purple' : 'bg-fario-dark'}`}></span>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
                          {cat.subtitle}
                        </p>
                      </div>
                    </div>
                    {/* Index Number */}
                    <span className="text-sm font-black text-black/10 font-heading">0{idx + 1}</span>
                  </div>
                </div>

                {/* 2. IMAGE LAYER (Middle Z-Index, specifically positioned per card type) */}
                <div className={`${cat.imgWrapper} z-10 transition-all pointer-events-none`}>
                  <MotionImg
                    src={cat.image}
                    alt={cat.title}
                    onError={(e) => {
                      console.error(`Failed to load ${cat.title} image:`, cat.image);
                      (e.target as HTMLImageElement).style.opacity = '0.2';
                    }}
                    className={`${cat.imgClass} drop-shadow-xl`}
                  />
                </div>

                {/* 3. ACTION LAYER (Bottom Left, slides up) */}
                <div className="absolute bottom-6 left-8 z-30">
                  <div className="overflow-hidden">
                    <div className="translate-y-[150%] group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <span className="inline-flex items-center gap-3 bg-fario-dark text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-fario-purple transition-colors">
                        Deploy Archive <ArrowRight size={12} className="text-fario-lime" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. ARROW ICON (Bottom Right, Static fallback) */}
                <div className="absolute bottom-6 right-8 z-20 w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-fario-purple group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>

                {/* 5. BACKGROUND DECORATION */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
              </NavLink>
            </MotionDiv>
          ))}
        </div>
      </div>

      {/* Visual Spacer at the bottom */}
      <div className="mt-20 w-full h-px bg-white/5 mx-auto max-w-7xl"></div>
    </section>
  );
};

export default CategoryGrid;
