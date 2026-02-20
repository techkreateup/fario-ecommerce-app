/*
 * ═══════════════════════════════════════════════════════════════
 * FARIO — GRAND HOME PAGE  (Purple Edition)
 * ═══════════════════════════════════════════════════════════════
 * Video  : /fario-brand.mp4  (self-hosted, 100 % real)
 * Images : Google Drive HL3 folder via lh3.googleusercontent.com
 * Colors : fario-purple #7a51a0 · fario-dark #0f172a · fario-lime #d9f99d
 * NO Header code. NO Footer code.
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  Variants,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Award,
  Zap,
  Leaf,
  Gift,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────
// ASSET VAULT  — HL3 Google Drive IDs → lh3.googleusercontent.com
// ─────────────────────────────────────────────────────────────────

const d = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;

const IMGS = {
  // 7 verified HL3 Drive product images
  aeroStride: d('1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-'),
  urbanGlide: d('1pc6UNVFR889igs7LbnQml_DpWpVd5AP2'),
  midnightForce: d('1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU'),
  velocityElite: d('19UKGRbcIZHffq1xs56MekmVpgF90H2kr'),
  stealthCommuter: d('1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC'),
  modularTote: d('1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ'),
  techSling: d('1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i'),
  // Fario-logo from public
  logo: '/fario-logo.png',
};

// Self-hosted Fario brand video — 100 % reliable
const BRAND_VIDEO = '/fario-brand.mp4';

// ─────────────────────────────────────────────────────────────────
// ANIMATION CONFIG
// ─────────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};
const maskReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.2, ease: EASE } },
};

// ─────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 'p1', name: 'AeroStride Pro', price: 12_999, originalPrice: 15_999, badge: 'New', category: 'Shoes', tagline: 'Performance Redefined', img: IMGS.aeroStride, alt: IMGS.midnightForce },
  { id: 'p2', name: 'Urban Glide', price: 8_499, originalPrice: 10_999, badge: 'Bestseller', category: 'Shoes', tagline: 'City Comfort', img: IMGS.urbanGlide, alt: IMGS.velocityElite },
  { id: 'p3', name: 'Midnight Force', price: 14_499, originalPrice: 18_999, badge: 'Limited', category: 'Shoes', tagline: 'Stealth & Power', img: IMGS.midnightForce, alt: IMGS.aeroStride },
  { id: 'p4', name: 'Velocity Elite', price: 11_999, originalPrice: 14_999, category: 'Shoes', tagline: 'Speed Unleashed', img: IMGS.velocityElite, alt: IMGS.urbanGlide },
  { id: 'p5', name: 'Stealth Commuter', price: 5_999, originalPrice: 7_999, category: 'Bags', tagline: 'Organized Efficiency', img: IMGS.stealthCommuter, alt: IMGS.modularTote },
  { id: 'p6', name: 'Modular Tote', price: 4_499, originalPrice: 5_999, category: 'Bags', tagline: 'Versatile Utility', img: IMGS.modularTote, alt: IMGS.stealthCommuter },
  { id: 'p7', name: 'Tech Sling', price: 2_999, originalPrice: 3_999, category: 'Accessories', tagline: 'Essential Carry', img: IMGS.techSling, alt: IMGS.aeroStride },
];

const MARQUEE = [
  '★ Free Shipping on ₹999+', '★ New Collection 2026', '★ Handcrafted Luxury',
  '★ Carbon-Neutral Packaging', '★ Exclusive Members Sale', '★ 30-Day Returns',
];

const TESTIMONIALS = [
  { name: 'Rajesh Kumar', role: 'Retired — Delhi', rating: 5, text: 'My grand-children gifted me the AeroStride Pro. I can walk the park for two hours now without any pain. Brilliant quality!' },
  { name: 'Priya Mehra', role: 'Fashion Stylist, Mumbai', rating: 5, text: 'Fario shoes are in a class apart. The stitching, the sole, the comfort — my clients notice them every single time.' },
  { name: 'Anand Shetty', role: 'Business Owner, Bangalore', rating: 5, text: 'Midnight Force is my everyday shoe. Zero compromise on elegance or comfort. Worth every rupee.' },
];

const GALLERY_ITEMS = [
  { img: IMGS.aeroStride, label: 'AeroStride Pro', size: 'col-span-2 row-span-2' },
  { img: IMGS.urbanGlide, label: 'Urban Glide', size: 'col-span-1 row-span-1' },
  { img: IMGS.midnightForce, label: 'Midnight Force', size: 'col-span-1 row-span-1' },
  { img: IMGS.velocityElite, label: 'Velocity Elite', size: 'col-span-1 row-span-2' },
  { img: IMGS.stealthCommuter, label: 'Stealth Bag', size: 'col-span-1 row-span-1' },
  { img: IMGS.modularTote, label: 'Modular Tote', size: 'col-span-1 row-span-1' },
  { img: IMGS.techSling, label: 'Tech Sling', size: 'col-span-1 row-span-1' },
];

// ─────────────────────────────────────────────────────────────────
// ATOM: Stars
// ─────────────────────────────────────────────────────────────────

const Stars = ({ n }: { n: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={13} className={i <= n ? 'text-fario-lime fill-fario-lime' : 'text-fario-purple/30'} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// SECTION 1: HERO — fario-brand.mp4 full-screen
// ─────────────────────────────────────────────────────────────────

const Hero = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], ['0%', '30%']);
  const textY = useTransform(scrollY, [0, 600], ['0%', '55%']);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end pb-28 md:pb-40 bg-fario-dark">
      {/* Self-hosted video — guaranteed to work */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 pointer-events-none scale-110">
        <video
          autoPlay muted loop playsInline
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
          poster={IMGS.aeroStride}
        >
          <source src={BRAND_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-fario-dark/90 via-fario-dark/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-fario-dark/60 via-transparent to-transparent" />
      </motion.div>

      {/* Logo watermark */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 opacity-20">
        <img src={IMGS.logo} alt="Fario" className="h-12 w-auto object-contain" />
      </div>

      {/* Hero text */}
      <motion.div style={{ y: textY, opacity }} className="relative z-10 w-full px-6 md:px-20">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.span variants={fadeIn}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-fario-purple/30 backdrop-blur border border-fario-purple text-fario-lime text-[10px] font-bold uppercase tracking-widest"
          >
            ✦ Collection 2026 · Handcrafted Luxury
          </motion.span>

          <div className="overflow-hidden mb-1">
            <motion.h1 variants={maskReveal}
              className="font-heading text-[16vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.82] text-white"
            >Walk</motion.h1>
          </div>
          <div className="overflow-hidden mb-1">
            <motion.h1 variants={maskReveal}
              className="font-heading text-[16vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.82] text-fario-purple"
            >In</motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1 variants={maskReveal}
              className="font-heading text-[16vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.82]"
              style={{ WebkitTextStroke: '2px #d9f99d', color: 'transparent' }}
            >Luxury</motion.h1>
          </div>

          <motion.p variants={fadeUp} className="text-white/70 text-base md:text-lg max-w-md leading-relaxed mb-10">
            Handcrafted footwear for every generation. Premium quality. Unbeatable comfort.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <Link to="/products"
              className="group inline-flex items-center gap-2 bg-fario-purple hover:bg-fario-lime hover:text-fario-dark text-white px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-fario-purple/40"
            >
              Shop Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/story"
              className="border border-white/40 text-white hover:bg-white/10 px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300"
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className="absolute bottom-8 right-10 z-20 flex flex-col items-center gap-2 text-fario-lime/80"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronRight size={20} className="rotate-90" />
        </motion.div>
        <span className="text-[9px] uppercase tracking-widest writing-mode-vertical">Scroll</span>
      </motion.div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────
// SECTION 2: MARQUEE BAND
// ─────────────────────────────────────────────────────────────────

const MarqueeBand = () => (
  <div className="bg-fario-lime py-4 overflow-hidden border-y border-fario-lime/30">
    <motion.div
      animate={{ x: ['0%', '-50%'] }}
      transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
      className="flex gap-12 whitespace-nowrap w-max"
    >
      {[...MARQUEE, ...MARQUEE].map((item, i) => (
        <span key={i} className="text-fario-dark font-black text-sm uppercase tracking-widest">
          {item}
        </span>
      ))}
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// SECTION 3: CATEGORY GRID — parallax columns
// ─────────────────────────────────────────────────────────────────

const CategoryGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const col1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const col2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const cats = [
    { label: 'Shoes', sub: '12 styles', img: IMGS.aeroStride },
    { label: 'Sneakers', sub: '8 styles', img: IMGS.urbanGlide },
    { label: 'Bags', sub: '6 styles', img: IMGS.stealthCommuter },
    { label: 'Accessories', sub: '10 styles', img: IMGS.techSling },
  ];

  return (
    <section ref={ref} className="py-28 bg-fario-dark overflow-hidden">
      <div className="container mx-auto px-6 md:px-14">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="flex justify-between items-end mb-16"
        >
          <div>
            <motion.p variants={fadeUp} className="text-fario-lime text-xs font-bold uppercase tracking-widest mb-3">Shop by Category</motion.p>
            <motion.h2 variants={fadeUp}
              className="font-heading text-white text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none"
            >Our<br />Collections</motion.h2>
          </div>
          <motion.div variants={fadeIn}>
            <Link to="/products"
              className="hidden md:inline-flex items-center gap-2 text-fario-purple hover:text-fario-lime text-xs font-bold uppercase tracking-widest transition-colors"
            >View All <ArrowUpRight size={14} /></Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[70vh]">
          {cats.map((c, i) => (
            <motion.div
              key={c.label}
              style={{ y: i % 2 === 0 ? col1 : col2 }}
              className="relative group overflow-hidden cursor-pointer h-full"
            >
              <img src={c.img} alt={c.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fario-dark/80 via-fario-dark/10 to-transparent" />
              <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-fario-lime transition-all duration-300" />
              <div className="absolute bottom-5 left-5">
                <span className="text-white font-heading font-black uppercase text-xl block drop-shadow-lg">{c.label}</span>
                <span className="text-fario-lime/80 text-xs">{c.sub}</span>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }}
                className="absolute inset-x-5 bottom-16"
              >
                <span className="inline-flex items-center gap-1 text-fario-lime text-xs font-bold uppercase">
                  Explore <ArrowRight size={11} />
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────
// SECTION 4: PRODUCT CAROUSEL
// ─────────────────────────────────────────────────────────────────

const ProductCard = ({ p }: { p: typeof PRODUCTS[0] }) => {
  const [hov, setHov] = useState(false);
  const [wish, setWish] = useState(false);

  const discount = Math.round((1 - p.price / p.originalPrice) * 100);

  return (
    <div className="min-w-[270px] md:min-w-[300px] group flex-shrink-0"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-fario-dark/30 mb-4 border border-fario-purple/20">
        {p.badge && (
          <span className="absolute top-3 left-3 z-20 bg-fario-purple text-white text-[9px] font-bold uppercase px-3 py-1 tracking-wider">
            {p.badge}
          </span>
        )}
        <span className="absolute top-3 right-10 z-20 bg-fario-lime text-fario-dark text-[9px] font-black px-2 py-0.5">
          -{discount}%
        </span>

        <img src={p.img} alt={p.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hov ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
          onError={e => { (e.target as HTMLImageElement).src = IMGS.aeroStride; }}
        />
        <img src={p.alt} alt={p.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hov ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          onError={e => { (e.target as HTMLImageElement).src = IMGS.urbanGlide; }}
        />
        <div className={`absolute inset-0 transition-all duration-300 ${hov ? 'ring-2 ring-fario-lime shadow-[inset_0_0_40px_rgba(217,249,157,0.1)]' : ''}`} />

        <button onClick={() => setWish(w => !w)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-fario-dark/70 backdrop-blur flex items-center justify-center hover:bg-fario-purple transition-colors"
        >
          <Heart size={14} className={wish ? 'fill-red-400 text-red-400' : 'text-white'} />
        </button>

        <motion.div
          initial={{ y: '100%' }} animate={{ y: hov ? '0%' : '100%' }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute bottom-0 inset-x-0 z-20"
        >
          <button className="w-full bg-fario-purple hover:bg-fario-lime hover:text-fario-dark text-white py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </motion.div>
      </div>

      <div>
        <p className="text-fario-purple text-[10px] uppercase tracking-widest mb-0.5">{p.category}</p>
        <h3 className="text-fario-dark font-heading font-black uppercase text-sm tracking-wide">{p.name}</h3>
        <p className="text-fario-dark/50 text-xs italic mb-1">{p.tagline}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-fario-dark font-bold">₹{p.price.toLocaleString('en-IN')}</span>
          <span className="text-gray-400 line-through text-xs">₹{p.originalPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

const ProductCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);
  const onScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanL(scrollLeft > 0);
    setCanR(scrollLeft + clientWidth < scrollWidth - 5);
  };
  const scroll = (d: 'left' | 'right') =>
    trackRef.current?.scrollBy({ left: d === 'left' ? -340 : 340, behavior: 'smooth' });

  return (
    <section className="py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-14">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="flex justify-between items-end mb-14"
        >
          <div>
            <motion.p variants={fadeUp} className="text-fario-purple text-xs font-bold uppercase tracking-widest mb-2">Fresh Drops</motion.p>
            <motion.h2 variants={fadeUp} className="font-heading text-fario-dark text-4xl md:text-6xl font-black uppercase tracking-tighter">New Arrivals</motion.h2>
          </div>
          <div className="flex gap-2">
            {[{ d: 'left', icon: <ChevronLeft size={18} />, can: canL },
            { d: 'right', icon: <ChevronRight size={18} />, can: canR }].map(b => (
              <button key={b.d} onClick={() => scroll(b.d as 'left' | 'right')} disabled={!b.can}
                className="w-10 h-10 rounded-full border-2 border-fario-purple text-fario-purple flex items-center justify-center hover:bg-fario-purple hover:text-white disabled:opacity-30 transition-all"
              >{b.icon}</button>
            ))}
          </div>
        </motion.div>

        <div ref={trackRef} onScroll={onScroll}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' } as React.CSSProperties}
        >
          {PRODUCTS.map(p => (
            <div key={p.id} className="snap-start"><ProductCard p={p} /></div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────
// SECTION 5: VIDEO EDITORIAL — fario-brand.mp4 (second use)
// ─────────────────────────────────────────────────────────────────

const Editorial = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={ref} className="flex flex-col md:flex-row min-h-screen bg-fario-dark">
      {/* Sticky self-hosted video */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-screen md:sticky md:top-0 overflow-hidden relative">
        <video autoPlay muted loop playsInline
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
          poster={IMGS.midnightForce}
        >
          <source src={BRAND_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-fario-purple/20 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-fario-dark/60 pointer-events-none" />
      </div>

      {/* Text side */}
      <motion.div style={{ y: textY }} className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-20 bg-fario-dark">
        <div className="max-w-md">
          <motion.span initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="text-fario-lime text-xs font-bold uppercase tracking-[0.35em] block mb-8"
          >— The Fario Philosophy</motion.span>

          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="font-heading text-white text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8"
          >Every<br />Step<br /><span className="text-fario-purple">Counts</span></motion.h2>

          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="text-white/60 text-base md:text-lg leading-loose mb-4"
          >
            We build from the ground up. Each pair begins as a sketch, evolves through 14 prototype stages,
            and arrives at your doorstep only when it is perfect.
          </motion.p>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="text-white/40 leading-loose mb-12"
          >
            Crafted by artisans. Tested by athletes. Loved by everyone in between.
          </motion.p>

          <motion.div initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
            <Link to="/story"
              className="inline-flex items-center gap-2 bg-fario-purple hover:bg-fario-lime hover:text-fario-dark text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              Read Our Story <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────
// SECTION 6: IMAGE GALLERY WALL — 7 HL3 images
// ─────────────────────────────────────────────────────────────────

const GalleryWall = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="container mx-auto px-6 md:px-14">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        className="text-center mb-16"
      >
        <motion.p variants={fadeUp} className="text-fario-purple text-xs font-bold uppercase tracking-widest mb-3">Gallery</motion.p>
        <motion.h2 variants={fadeUp}
          className="font-heading text-fario-dark text-4xl md:text-6xl font-black uppercase tracking-tighter"
        >The Full<br />Collection</motion.h2>
      </motion.div>

      {/* Masonry-style grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[200px]">
        {GALLERY_ITEMS.map((g, i) => (
          <motion.div
            key={g.label}
            className={`relative group overflow-hidden cursor-pointer ${g.size}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: EASE }}
            whileHover={{ scale: 1.02 }}
          >
            <img src={g.img} alt={g.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={e => { (e.target as HTMLImageElement).src = IMGS.aeroStride; }}
            />
            <div className="absolute inset-0 bg-fario-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white font-heading font-black uppercase text-lg">{g.label}</span>
            </div>
            <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-fario-lime transition-all duration-300" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// SECTION 7: TRUST STRIP
// ─────────────────────────────────────────────────────────────────

const TrustStrip = () => {
  const features = [
    { icon: <Truck size={28} />, title: 'Free Delivery', sub: 'On orders ₹999+' },
    { icon: <ShieldCheck size={28} />, title: '2-Year Warranty', sub: 'Genuine leather' },
    { icon: <RefreshCcw size={28} />, title: '30-Day Returns', sub: 'Hassle free' },
    { icon: <Award size={28} />, title: 'Certified Craft', sub: 'ISO 9001 Artisans' },
  ];

  return (
    <div className="bg-fario-purple/10 border-y border-fario-purple/20">
      <div className="container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center gap-2 group"
          >
            <div className="text-fario-purple group-hover:text-fario-lime transition-colors">{f.icon}</div>
            <p className="text-fario-dark font-bold text-sm uppercase tracking-wide">{f.title}</p>
            <p className="text-fario-dark/50 text-xs">{f.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// SECTION 8: BRAND VIDEO FULLSCREEN BREAK
// ─────────────────────────────────────────────────────────────────

const VideoBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <section ref={ref} className="relative h-[70vh] overflow-hidden flex items-center justify-center">
      <motion.div style={{ scale }} className="absolute inset-0">
        <video autoPlay muted loop playsInline
          className="w-full h-full object-cover"
          poster={IMGS.velocityElite}
        >
          <source src={BRAND_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-fario-dark/60" />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        className="relative z-10 text-center px-6"
      >
        <motion.p variants={fadeUp} className="text-fario-lime text-xs font-bold uppercase tracking-widest mb-4">
          Fario — Est. 2024 · New Delhi
        </motion.p>
        <motion.h2 variants={maskReveal}
          className="font-heading text-white text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8"
        >Born to<br />Move</motion.h2>
        <motion.div variants={fadeUp}>
          <Link to="/products"
            className="inline-flex items-center gap-2 bg-fario-lime text-fario-dark px-10 py-4 font-black text-sm uppercase tracking-widest hover:bg-white transition-colors shadow-xl"
          >
            Explore All <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────
// SECTION 9: TESTIMONIALS
// ─────────────────────────────────────────────────────────────────

const Testimonials = () => (
  <section className="py-28 bg-fario-dark overflow-hidden">
    <div className="container mx-auto px-6 md:px-14">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        className="text-center mb-16"
      >
        <motion.p variants={fadeUp} className="text-fario-lime text-xs font-bold uppercase tracking-widest mb-3">Customer Love</motion.p>
        <motion.h2 variants={fadeUp}
          className="font-heading text-white text-4xl md:text-6xl font-black uppercase tracking-tighter"
        >What They Say</motion.h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.8, ease: EASE }}
            className="relative p-8 border border-fario-purple/30 bg-fario-purple/5 hover:bg-fario-purple/10 hover:border-fario-lime/40 transition-all duration-400 group"
          >
            {/* Decorative quote */}
            <span className="absolute top-4 right-6 text-fario-purple/20 text-7xl font-serif leading-none select-none">"</span>
            <Stars n={t.rating} />
            <p className="text-white/70 text-base leading-relaxed my-6">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-fario-purple/40 flex items-center justify-center text-white font-black text-lg">
                {t.name[0]}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-fario-lime/60 text-xs">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// SECTION 10: INFOGRAPHIC — "Science in Motion" (user-provided)
// ─────────────────────────────────────────────────────────────────

const INFOGRAPHIC_FEATURES = [
  {
    id: 'fit',
    title: 'Adaptive Fit',
    description: 'Smart mesh fibres expand and contract to mould perfectly to unique foot shapes.',
    visual: (
      <svg viewBox="0 0 200 200" className="w-full h-full stroke-fario-lime fill-none stroke-2">
        <motion.path
          d="M40,100 C40,60 160,60 160,100 C160,140 40,140 40,100 Z"
          animate={{ d: ['M40,100 C40,60 160,60 160,100 C160,140 40,140 40,100 Z', 'M30,100 C30,40 170,40 170,100 C170,160 30,160 30,100 Z', 'M40,100 C40,60 160,60 160,100 C160,140 40,140 40,100 Z'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M50,100 C50,70 150,70 150,100 C150,130 50,130 50,100 Z"
          animate={{ d: ['M50,100 C50,70 150,70 150,100 C150,130 50,130 50,100 Z', 'M45,100 C45,60 155,60 155,100 C155,140 45,140 45,100 Z', 'M50,100 C50,70 150,70 150,100 C150,130 50,130 50,100 Z'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          opacity="0.6"
        />
        {[...Array(5)].map((_, i) => (
          <motion.line key={i} x1={60 + i * 20} y1="60" x2={60 + i * 20} y2="140" strokeDasharray="4 4"
            animate={{ y1: [60, 50, 60], y2: [140, 150, 140] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
          />
        ))}
      </svg>
    ),
  },
  {
    id: 'cushion',
    title: 'Cushioned Comfort',
    description: 'High-density memory foam absorbs impact and returns energy with every step.',
    visual: (
      <svg viewBox="0 0 200 200" className="w-full h-full fill-none">
        <motion.line x1="20" y1="150" x2="180" y2="150" stroke="#4b5563" strokeWidth="2" />
        {[0, 10, 20].map((offset, i) => (
          <motion.path key={i}
            d={`M40,${140 - offset} Q100,${140 - offset} 160,${140 - offset}`}
            stroke="#7a51a0" strokeWidth="4"
            animate={{ d: [`M40,${140 - offset} Q100,${140 - offset} 160,${140 - offset}`, `M40,${140 - offset} Q100,${160 - offset} 160,${140 - offset}`, `M40,${140 - offset} Q100,${140 - offset} 160,${140 - offset}`] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'circInOut' }}
          />
        ))}
        <motion.circle cx="100" cy="100" r="15" fill="#d9f99d"
          animate={{ cy: [60, 120, 60], scaleY: [1, 0.8, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'circInOut' }}
        />
        <motion.ellipse cx="100" cy="140" rx="10" ry="2" stroke="#d9f99d"
          animate={{ rx: [10, 40], opacity: [1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
      </svg>
    ),
  },
  {
    id: 'grip',
    title: 'Anti-Skid Grip',
    description: 'Advanced tread patterns lock onto surfaces for maximum traction and safety.',
    visual: (
      <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-fario-lime stroke-2">
        <defs>
          <pattern id="tread" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0,20 L20,0 L40,20 M0,40 L20,20 L40,40" fill="none" stroke="currentColor" strokeWidth="2" />
          </pattern>
          <mask id="circleMask2">
            <circle cx="100" cy="100" r="80" fill="white" />
          </mask>
        </defs>
        <motion.rect x="0" y="0" width="200" height="200" fill="url(#tread)"
          animate={{ y: [0, 40] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          mask="url(#circleMask2)"
        />
        <motion.circle cx="100" cy="100" r="85" stroke="#0f172a" strokeWidth="10"
          animate={{ stroke: ['#0f172a', '#d9f99d', '#0f172a'] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" strokeDasharray="10 5" />
      </svg>
    ),
  },
  {
    id: 'fresh',
    title: 'Freshness Control',
    description: 'Antimicrobial lining promotes airflow and prevents odours all day long.',
    visual: (
      <svg viewBox="0 0 200 200" className="w-full h-full fill-none">
        <path d="M100,30 L160,50 V100 C160,140 100,180 100,180 C100,180 40,140 40,100 V50 L100,30 Z" stroke="#7a51a0" strokeWidth="2" />
        {[...Array(8)].map((_, i) => (
          <motion.circle key={i} r={Math.random() * 3 + 2} fill="#d9f99d"
            initial={{ x: 70 + Math.random() * 60, y: 160, opacity: 0 }}
            animate={{ y: 40, opacity: [0, 1, 0] }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
          />
        ))}
        {[1, 2, 3].map(i => (
          <motion.path key={`line-${i}`}
            d={`M${80 + i * 10},150 Q${90 + i * 10},120 ${80 + i * 10},90 T${80 + i * 10},30`}
            stroke="white" strokeOpacity="0.2" strokeDasharray="5 5"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </svg>
    ),
  },
];

const InfographicSection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % INFOGRAPHIC_FEATURES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-14 relative z-10">
        <div className="text-center mb-16">
          <span className="px-3 py-1 bg-fario-dark text-fario-lime text-xs font-bold uppercase tracking-widest rounded-sm mb-4 inline-block font-heading">
            Engineering Lab
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-black text-fario-dark uppercase tracking-tighter mt-3">
            Science in{' '}
            <span style={{ WebkitTextStroke: '2px #7a51a0', color: 'transparent' }}>Motion</span>
          </h2>
        </div>

        <div className="bg-fario-dark rounded-3xl p-6 md:p-12 overflow-hidden flex flex-col lg:flex-row gap-10 border border-fario-purple/20 relative">
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-fario-lime/5 rounded-full blur-[80px] pointer-events-none" />

          {/* Feature list */}
          <div className="lg:w-1/2 flex flex-col justify-center gap-2 relative z-10">
            {INFOGRAPHIC_FEATURES.map((f, idx) => (
              <motion.button key={f.id} onClick={() => setActive(idx)}
                className={`text-left p-6 rounded-xl transition-all duration-300 border-l-4 ${active === idx ? 'bg-white/10 border-fario-lime' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                whileHover={{ x: 8 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-heading text-xl font-bold ${active === idx ? 'text-fario-lime' : 'text-white'}`}>{f.title}</h3>
                  {active === idx && <motion.div layoutId="dot" className="w-2 h-2 bg-fario-lime rounded-full" />}
                </div>
                <p className={`text-sm ${active === idx ? 'text-gray-300' : 'text-gray-500'}`}>{f.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Visual */}
          <div className="lg:w-1/2 min-h-[300px] lg:min-h-[400px] bg-black/40 rounded-[2.5rem] border border-white/10 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-fario-lime rounded-tl-3xl opacity-40" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-fario-lime rounded-br-3xl opacity-40" />
            <div className="absolute top-8 right-8 text-xs font-bold text-fario-lime opacity-60 tracking-widest font-heading">
              MATERIAL.LAB // 0{active + 1}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={active}
                className="w-full h-full p-12 max-w-xs"
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
              >
                {INFOGRAPHIC_FEATURES[active].visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────
// SECTION 11: NEWSLETTER
// ─────────────────────────────────────────────────────────────────

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section className="relative py-32 overflow-hidden bg-fario-purple">
      {/* Decorative circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-fario-lime/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fario-dark/30 rounded-full blur-3xl pointer-events-none" />
      {/* Background product silhouette */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none overflow-hidden">
        <img src={IMGS.aeroStride} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-14 text-center max-w-2xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-fario-lime text-xs font-bold uppercase tracking-widest mb-4">Inner Circle</motion.p>
          <motion.h2 variants={fadeUp}
            className="font-heading text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4"
          >Join the<br />Movement</motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 mb-12">
            Early access. Exclusive drops. Member-only pricing. Be the first to know.
          </motion.p>

          <motion.form variants={fadeUp} onSubmit={e => { e.preventDefault(); if (email) setDone(true); }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            {!done ? (
              <>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border border-white/30 text-white placeholder:text-white/40 px-6 py-4 text-sm outline-none focus:border-fario-lime focus:ring-1 focus:ring-fario-lime transition"
                />
                <button type="submit"
                  className="bg-fario-lime hover:bg-white text-fario-dark px-8 py-4 text-xs font-black uppercase tracking-widest transition-all"
                >Subscribe</button>
              </>
            ) : (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-white text-lg font-bold"
              >✓ Welcome to Fario Inner Circle!</motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────
// PAGE ORCHESTRATION — NO Header. NO Footer.
// ─────────────────────────────────────────────────────────────────

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white min-h-screen font-sans selection:bg-fario-purple selection:text-fario-lime"
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-fario-lime z-[200] shadow-[0_0_12px_rgba(217,249,157,0.7)]"
      />

      <Hero />
      <MarqueeBand />
      <CategoryGrid />
      <ProductCarousel />
      <TrustStrip />
      <Editorial />
      <GalleryWall />
      <VideoBanner />
      <Testimonials />
      <InfographicSection />
      <Newsletter />
    </motion.div>
  );
}
