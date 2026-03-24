import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HomeTicker } from './HomeTicker';

// Import Hero Assets
import heroMens from '../assets/hero/hero_mens.png';
import heroWomens from '../assets/hero/hero_womens.png';
import heroBackpack from '../assets/hero/hero_backpack.png';
import heroKids from '../assets/hero/hero_kids.png';

// ═══════════════════════════════════════════════════════
// PREMIUM 3D STATIC FOCUS DESIGN
// ═══════════════════════════════════════════════════════

interface FocusSlideProps {
  title: string;
  sub: string;
  desc: string;
  bg: string;
  color: string;
  accent: string;
  image: string;
  link: string;
  badge?: string;
}

const FocusSlide = ({ title, sub, desc, bg, color, accent, image, link, badge }: FocusSlideProps) => {
  return (
    <div 
      className="relative flex flex-col items-center justify-center overflow-hidden w-full"
      style={{ minHeight: '82vh', background: bg }}
    >
      {/* Background Decorative Element */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ background: accent }} 
      />

      <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-30">
        {/* TOP TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-[10px] lg:text-xs font-black uppercase tracking-[0.5em] mb-4" style={{ color: accent }}>
            ✦ {sub}
          </p>
          <h1 
            className="font-black uppercase leading-[0.9] tracking-tighter mb-4"
            style={{ color: color, fontSize: 'clamp(48px, 12vw, 120px)' }}
          >
            {title}
          </h1>
          <p 
            className="text-[11px] lg:text-sm leading-relaxed max-w-[320px] lg:max-w-md mx-auto opacity-70"
            style={{ color: color }}
          >
            {desc}
          </p>
        </motion.div>

        {/* CENTER 3D IMAGE */}
        <div className="relative w-full max-w-[90vw] lg:max-w-[800px] flex items-center justify-center mt-4 lg:mt-8">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-auto object-contain z-20 transition-transform duration-700 hover:scale-105"
            style={{ 
              filter: `drop-shadow(0 40px 80px ${accent}44) drop-shadow(0 10px 20px rgba(0,0,0,0.1))` 
            }}
          />
          
          {badge && (
            <div className="absolute top-[10%] right-[5%] bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-2xl z-30 hidden md:block">
              <p className="text-[9px] font-black uppercase tracking-tighter text-white">{badge}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 lg:mt-16"
        >
          <Link 
            to={link}
            className="inline-block px-12 lg:px-16 py-4 lg:py-5 rounded-full font-black text-[12px] lg:text-sm uppercase tracking-[0.2em] text-white transition-all hover:scale-110 active:scale-95 shadow-2xl"
            style={{ background: accent, boxShadow: `0 20px 40px ${accent}55` }}
          >
            Explore Store
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const SLIDES = [
  {
    id: '1',
    title: "PERFORMANCE",
    sub: "Black Edition",
    desc: "Unmatched 3D engineered propulsion for the elite athlete. Stiffer, faster, stronger.",
    bg: "#0a0a0b",
    color: "#ffffff",
    accent: "#3b82f6",
    image: heroMens,
    link: "/products?gender=Male",
    badge: "2026 PRO SERIES"
  },
  {
    id: '2',
    title: "LUXE ELITE",
    sub: "Designer Series",
    desc: "Experience the fusion of soft leather textures and rose gold accents in a shoe that defines elegance.",
    bg: "#faf5f2",
    color: "#1e293b",
    accent: "#db2777",
    image: heroWomens,
    link: "/products?gender=Female",
    badge: "LIMITED DROP"
  },
  {
    id: '3',
    title: "STEALTH PACK",
    sub: "Urban Tech",
    desc: "Matte black technical precision. The ultimate urban backpack for the tech-conscious commuter.",
    bg: "#1a1c23",
    color: "#ffffff",
    accent: "#7c3aed",
    image: heroBackpack,
    link: "/products?category=Bags",
    badge: "TECHWEAR COLLAB"
  },
  {
    id: '4',
    title: "ACTIVE CORE",
    sub: "Junior Series",
    desc: "High-octane colors for the next generation of speed. Built for play, engineered for motion.",
    bg: "#f0f9f9",
    color: "#0f766e",
    accent: "#fb923c",
    image: heroKids,
    link: "/products?category=Kids",
    badge: "KIDS FAVORITE"
  }
];

export const HomeHero = () => {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 8000);
        return () => clearInterval(t);
    }, []);

    const currentSlide = SLIDES[idx];

    return (
        <section className="relative overflow-hidden w-full bg-white">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentSlide.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <FocusSlide {...currentSlide} />
                </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button 
                onClick={() => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)}
                className="absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/5 hover:bg-black/20 backdrop-blur-xl flex items-center justify-center transition-all border border-white/10 group"
            >
                <ChevronLeft size={20} className="text-current group-hover:scale-125 transition-transform" style={{ color: currentSlide.color }} />
            </button>
            <button 
                onClick={() => setIdx(i => (i + 1) % SLIDES.length)}
                className="absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/5 hover:bg-black/20 backdrop-blur-xl flex items-center justify-center transition-all border border-white/10 group"
            >
                <ChevronRight size={20} className="text-current group-hover:scale-125 transition-transform" style={{ color: currentSlide.color }} />
            </button>

            {/* Dot nav */}
            <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
                {SLIDES.map((s, i) => (
                    <button 
                        key={s.id} 
                        onClick={() => setIdx(i)}
                        className="rounded-full transition-all duration-700 ease-out"
                        style={{
                            width: idx === i ? '40px' : '12px', 
                            height: '6px',
                            background: idx === i ? s.accent : 'rgba(128,128,128,0.2)',
                            boxShadow: idx === i ? `0 0 15px ${s.accent}88` : 'none'
                        }} 
                    />
                ))}
            </div>

            <div className="relative z-30 w-full mt-[-1px]">
                <HomeTicker isFooter={true} />
            </div>
        </section>
    );
};
