/*
 * FARIO — MAX ANIMATION HOME PAGE
 * Video: /fario-brand.mp4 (self-hosted × 5 sections)
 * Images: HL3 Google Drive via lh3.googleusercontent.com
 * Every image: scroll-parallax + 3D-tilt + touch-ripple
 * NO Header. NO Footer.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, AnimatePresence, Variants,
} from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, ShoppingBag, Heart, Star,
  ChevronLeft, ChevronRight, Truck, ShieldCheck, RefreshCcw, Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── ASSETS ──────────────────────────────────────────────────────
const d = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;
const IMGS = {
  aeroStride: d('1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-'),
  urbanGlide: d('1pc6UNVFR889igs7LbnQml_DpWpVd5AP2'),
  midnightForce: d('1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU'),
  velocityElite: d('19UKGRbcIZHffq1xs56MekmVpgF90H2kr'),
  stealthCommuter: d('1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC'),
  modularTote: d('1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ'),
  techSling: d('1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i'),
  logo: '/fario-logo.png',
};
const VID = '/fario-brand.mp4';
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── ANIMATION VARIANTS ─────────────────────────────────────────
const fadeUp: Variants = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const maskReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.2, ease: EASE } },
};

// ── DATA ────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 'p1', name: 'AeroStride Pro', price: 12999, orig: 15999, badge: 'New', cat: 'Shoes', img: IMGS.aeroStride, alt: IMGS.midnightForce },
  { id: 'p2', name: 'Urban Glide', price: 8499, orig: 10999, badge: 'Bestseller', cat: 'Shoes', img: IMGS.urbanGlide, alt: IMGS.velocityElite },
  { id: 'p3', name: 'Midnight Force', price: 14499, orig: 18999, badge: 'Limited', cat: 'Shoes', img: IMGS.midnightForce, alt: IMGS.aeroStride },
  { id: 'p4', name: 'Velocity Elite', price: 11999, orig: 14999, cat: 'Shoes', img: IMGS.velocityElite, alt: IMGS.urbanGlide },
  { id: 'p5', name: 'Stealth Commuter', price: 5999, orig: 7999, cat: 'Bags', img: IMGS.stealthCommuter, alt: IMGS.modularTote },
  { id: 'p6', name: 'Modular Tote', price: 4499, orig: 5999, cat: 'Bags', img: IMGS.modularTote, alt: IMGS.stealthCommuter },
  { id: 'p7', name: 'Tech Sling', price: 2999, orig: 3999, cat: 'Accessories', img: IMGS.techSling, alt: IMGS.aeroStride },
];
const MARQUEE = ['★ Free Shipping ₹999+', '★ New Collection 2026', '★ Handcrafted Luxury', '★ 30-Day Returns', '★ Members Exclusive', '★ Carbon Neutral'];
const TESTIMONIALS = [
  { name: 'Rajesh Kumar', role: 'Retired, Delhi', rating: 5, text: 'My grandchildren gifted me the AeroStride Pro. I can walk the park for two hours without pain. Brilliant quality!' },
  { name: 'Priya Mehra', role: 'Fashion Stylist, Mumbai', rating: 5, text: 'Fario shoes are in a class apart. The stitching, the sole, the comfort — clients notice them every time.' },
  { name: 'Anand Shetty', role: 'Business Owner, BLR', rating: 5, text: 'Midnight Force is my everyday shoe. Zero compromise on elegance or comfort. Worth every rupee.' },
];
const GALLERY = [
  { img: IMGS.aeroStride, label: 'AeroStride', cls: 'col-span-2 row-span-2' },
  { img: IMGS.urbanGlide, label: 'Urban Glide', cls: 'col-span-1 row-span-1' },
  { img: IMGS.midnightForce, label: 'Midnight', cls: 'col-span-1 row-span-1' },
  { img: IMGS.velocityElite, label: 'Velocity', cls: 'col-span-1 row-span-2' },
  { img: IMGS.stealthCommuter, label: 'Stealth Bag', cls: 'col-span-1 row-span-1' },
  { img: IMGS.modularTote, label: 'Mod. Tote', cls: 'col-span-1 row-span-1' },
  { img: IMGS.techSling, label: 'Tech Sling', cls: 'col-span-1 row-span-1' },
];
const INFOGRAPHIC_FEATURES = [
  { id: 'fit', title: 'Adaptive Fit', desc: 'Smart mesh fibres expand and contract to mould perfectly to unique foot shapes.' },
  { id: 'cushion', title: 'Cushioned Comfort', desc: 'High-density memory foam absorbs impact and returns energy with every step.' },
  { id: 'grip', title: 'Anti-Skid Grip', desc: 'Advanced tread patterns lock onto surfaces for maximum traction and safety.' },
  { id: 'fresh', title: 'Freshness Control', desc: 'Antimicrobial lining promotes airflow and prevents odours all day long.' },
];

// ── ATOMS ───────────────────────────────────────────────────────
const Stars = ({ n }: { n: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={13} className={i <= n ? 'text-fario-lime fill-fario-lime' : 'text-fario-purple/30'} />
    ))}
  </div>
);

// 3D Magnetic Tilt Card wrapper
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set((e.clientX - left) / width - 0.5);
    y.set((e.clientY - top) / height - 0.5);
  }, [x, y]);

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll-parallax image wrapper
const ParallaxImg = ({ src, alt, strength = 40, className = '' }: { src: string; alt: string; strength?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src} alt={alt} style={{ y, scale: 1.15 }}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.22, filter: 'brightness(1.1)' }}
        whileTap={{ scale: 1.05, filter: 'brightness(1.2)' }}
        transition={{ duration: 0.5, ease: EASE }}
        onError={e => { (e.target as HTMLImageElement).src = IMGS.aeroStride; }}
      />
    </div>
  );
};

// Background video helper
const BgVideo = ({ poster }: { poster: string }) => (
  <video autoPlay muted loop playsInline poster={poster}
    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
  >
    <source src={VID} type="video/mp4" />
  </video>
);

// ── HERO ────────────────────────────────────────────────────────
const Hero = () => {
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 900], ['0%', '30%']);
  const textY = useTransform(scrollY, [0, 600], ['0%', '55%']);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-screen overflow-hidden flex items-end pb-28 md:pb-40 bg-fario-dark">
      <motion.div style={{ y: videoY }} className="absolute inset-0 scale-110">
        <BgVideo poster={IMGS.aeroStride} />
        <div className="absolute inset-0 bg-gradient-to-t from-fario-dark/90 via-fario-dark/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-fario-dark/60 via-transparent to-transparent" />
      </motion.div>

      <motion.div style={{ y: textY, opacity }} className="relative z-10 w-full px-6 md:px-20">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.span variants={fadeUp}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-fario-purple/30 backdrop-blur border border-fario-purple/50 text-fario-lime text-[10px] font-bold uppercase tracking-widest"
          >✦ Collection 2026 · Handcrafted Luxury</motion.span>

          <div className="overflow-hidden mb-1">
            <motion.h1 variants={maskReveal} className="font-heading text-[16vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.82] text-white">Walk</motion.h1>
          </div>
          <div className="overflow-hidden mb-1">
            <motion.h1 variants={maskReveal} className="font-heading text-[16vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.82] text-fario-purple">In</motion.h1>
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/products"
                className="inline-flex items-center gap-2 bg-fario-purple hover:bg-fario-lime hover:text-fario-dark text-white px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-fario-purple/40"
              >Shop Now <ArrowRight size={16} /></Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/story" className="border border-white/40 text-white hover:bg-white/10 px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300">
                Our Story
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-fario-lime/80">
          <ChevronRight size={22} className="rotate-90" />
        </motion.div>
        <span className="text-white/30 text-[9px] uppercase tracking-widest">Scroll</span>
      </motion.div>
    </section>
  );
};

// ── MARQUEE ─────────────────────────────────────────────────────
const MarqueeBand = () => (
  <div className="bg-fario-lime py-4 overflow-hidden border-y border-fario-lime/30">
    <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
      className="flex gap-12 whitespace-nowrap w-max"
    >
      {[...MARQUEE, ...MARQUEE].map((item, i) => (
        <span key={i} className="text-fario-dark font-black text-sm uppercase tracking-widest">{item}</span>
      ))}
    </motion.div>
  </div>
);

// ── CATEGORY GRID ───────────────────────────────────────────────
const CategoryGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const col1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const col2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);

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
            <motion.h2 variants={fadeUp} className="font-heading text-white text-5xl md:text-7xl font-black uppercase tracking-tighter">Our<br />Collections</motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link to="/products" className="hidden md:inline-flex items-center gap-2 text-fario-purple hover:text-fario-lime text-xs font-bold uppercase tracking-widest transition-colors">
              View All <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[70vh]">
          {cats.map((c, i) => (
            <TiltCard key={c.label} className="h-full">
              <motion.div
                style={{ y: i % 2 === 0 ? col1 : col2 }}
                className="relative group overflow-hidden cursor-pointer h-full"
              >
                <motion.img src={c.img} alt={c.label}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 1.05, brightness: 1.2 } as any}
                  transition={{ duration: 0.6, ease: EASE }}
                  onError={e => { (e.target as HTMLImageElement).src = IMGS.aeroStride; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fario-dark/80 via-fario-dark/10 to-transparent" />
                <motion.div className="absolute inset-0 ring-0 group-hover:ring-2 ring-fario-lime transition-all duration-300" />
                <div className="absolute bottom-5 left-5">
                  <span className="text-white font-heading font-black uppercase text-xl block drop-shadow-lg">{c.label}</span>
                  <span className="text-fario-lime/80 text-xs">{c.sub}</span>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── VIDEO BREAK 1 ── (NEW full-width cinematic break)
const VideoCinematic = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative h-[60vh] overflow-hidden flex items-center justify-center">
      <motion.div style={{ scale }} className="absolute inset-0">
        <BgVideo poster={IMGS.velocityElite} />
        <div className="absolute inset-0 bg-fario-dark/55" />
      </motion.div>
      <motion.div style={{ opacity }} className="relative z-10 text-center px-6">
        <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-fario-lime text-xs font-bold uppercase tracking-[0.4em] mb-4"
        >Crafted for Champions</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1 }}
          className="font-heading text-white text-5xl md:text-8xl font-black uppercase tracking-tighter"
        >Feel the<br /><span className="text-fario-purple">Difference</span></motion.h2>
      </motion.div>
    </section>
  );
};

// ── PRODUCT CAROUSEL ─────────────────────────────────────────────
const ProductCard = ({ p }: { p: typeof PRODUCTS[0] }) => {
  const [hov, setHov] = useState(false);
  const [wish, setWish] = useState(false);
  const disc = Math.round((1 - p.price / p.orig) * 100);

  return (
    <TiltCard className="min-w-[270px] md:min-w-[300px] flex-shrink-0">
      <div className="group"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-fario-dark/20 mb-4 border border-fario-purple/20">
          {p.badge && (
            <span className="absolute top-3 left-3 z-20 bg-fario-purple text-white text-[9px] font-bold uppercase px-3 py-1">{p.badge}</span>
          )}
          <span className="absolute top-3 right-10 z-20 bg-fario-lime text-fario-dark text-[9px] font-black px-2 py-0.5">-{disc}%</span>

          <motion.img src={p.img} alt={p.name}
            animate={{ opacity: hov ? 0 : 1, scale: hov ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = IMGS.aeroStride; }}
          />
          <motion.img src={p.alt} alt={p.name + ' alt'}
            animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = IMGS.urbanGlide; }}
          />
          <motion.div animate={{ opacity: hov ? 1 : 0 }}
            className="absolute inset-0 ring-2 ring-fario-lime shadow-[inset_0_0_40px_rgba(217,249,157,0.1)]"
          />

          <motion.button onClick={() => setWish(w => !w)} whileTap={{ scale: 0.8 }}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-fario-dark/70 backdrop-blur flex items-center justify-center hover:bg-fario-purple transition-colors"
          >
            <Heart size={14} className={wish ? 'fill-red-400 text-red-400' : 'text-white'} />
          </motion.button>

          <motion.div initial={{ y: '100%' }} animate={{ y: hov ? '0%' : '100%' }} transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute bottom-0 inset-x-0 z-20"
          >
            <button className="w-full bg-fario-purple hover:bg-fario-lime hover:text-fario-dark text-white py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
              <ShoppingBag size={14} /> Add to Cart
            </button>
          </motion.div>
        </div>

        <div>
          <p className="text-fario-purple text-[10px] uppercase tracking-widest mb-0.5">{p.cat}</p>
          <h3 className="text-fario-dark font-heading font-black uppercase text-sm tracking-wide">{p.name}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-fario-dark font-bold">₹{p.price.toLocaleString('en-IN')}</span>
            <span className="text-gray-400 line-through text-xs">₹{p.orig.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

const ProductCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);
  const onScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanL(scrollLeft > 0); setCanR(scrollLeft + clientWidth < scrollWidth - 5);
  };
  const scroll = (dir: 'left' | 'right') => trackRef.current?.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });

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
            {(['left', 'right'] as const).map(dir => (
              <motion.button key={dir} onClick={() => scroll(dir)}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                disabled={dir === 'left' ? !canL : !canR}
                className="w-10 h-10 rounded-full border-2 border-fario-purple text-fario-purple flex items-center justify-center hover:bg-fario-purple hover:text-white disabled:opacity-30 transition-all"
              >
                {dir === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div ref={trackRef} onScroll={onScroll}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' } as React.CSSProperties}
        >
          {PRODUCTS.map(p => <div key={p.id} className="snap-start"><ProductCard p={p} /></div>)}
        </div>
      </div>
    </section>
  );
};

// ── TRUST STRIP ──────────────────────────────────────────────────
const TrustStrip = () => {
  const items = [
    { icon: <Truck size={28} />, title: 'Free Delivery', sub: 'On orders ₹999+' },
    { icon: <ShieldCheck size={28} />, title: '2-Year Warranty', sub: 'Genuine leather' },
    { icon: <RefreshCcw size={28} />, title: '30-Day Returns', sub: 'Hassle free' },
    { icon: <Award size={28} />, title: 'ISO Certified', sub: 'Master artisans' },
  ];
  return (
    <div className="border-y border-fario-purple/20 bg-fario-purple/5">
      <div className="container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.96 }}
            className="flex flex-col items-center text-center gap-2 group cursor-default"
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

// ── EDITORIAL — sticky video + parallax text ──────────────────────
const Editorial = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={ref} className="flex flex-col md:flex-row min-h-screen bg-fario-dark">
      <div className="w-full md:w-1/2 h-[60vh] md:h-screen md:sticky md:top-0 overflow-hidden relative">
        <BgVideo poster={IMGS.midnightForce} />
        <div className="absolute inset-0 bg-fario-purple/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-fario-dark/60" />
      </div>
      <motion.div style={{ y: textY }} className="w-full md:w-1/2 flex items-center p-10 md:p-20 bg-fario-dark">
        <div className="max-w-md">
          <motion.span initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="text-fario-lime text-xs font-bold uppercase tracking-[0.35em] block mb-8"
          >— The Fario Philosophy</motion.span>
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="font-heading text-white text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8"
          >Every<br />Step<br /><span className="text-fario-purple">Counts</span></motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}
            className="text-white/60 text-lg leading-loose mb-12"
          >
            We build from the ground up. 14 prototype stages. Tested by athletes. Loved by everyone.
          </motion.p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link to="/story"
              className="inline-flex items-center gap-2 bg-fario-purple hover:bg-fario-lime hover:text-fario-dark text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >Read Our Story <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// ── GALLERY WALL — all 7 HL3 images with scroll parallax ─────────
const GalleryWall = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="container mx-auto px-6 md:px-14">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
        <motion.p variants={fadeUp} className="text-fario-purple text-xs font-bold uppercase tracking-widest mb-3">Gallery</motion.p>
        <motion.h2 variants={fadeUp} className="font-heading text-fario-dark text-4xl md:text-6xl font-black uppercase tracking-tighter">The Full<br />Collection</motion.h2>
      </motion.div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[200px]">
        {GALLERY.map((g, i) => (
          <motion.div key={g.label}
            className={`relative group cursor-pointer ${g.cls}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: EASE }}
          >
            <ParallaxImg src={g.img} alt={g.label} strength={30} className="w-full h-full" />
            <div className="absolute inset-0 bg-fario-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
              <span className="text-white font-heading font-black uppercase text-lg">{g.label}</span>
            </div>
            <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-fario-lime transition-all duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ── VIDEO BREAK 2 — fullscreen scale parallax ─────────────────────
const VideoBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  return (
    <section ref={ref} className="relative h-[70vh] overflow-hidden flex items-center justify-center">
      <motion.div style={{ scale }} className="absolute inset-0">
        <BgVideo poster={IMGS.aeroStride} />
        <div className="absolute inset-0 bg-fario-dark/60" />
      </motion.div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        className="relative z-10 text-center px-6"
      >
        <motion.p variants={fadeUp} className="text-fario-lime text-xs font-bold uppercase tracking-widest mb-4">Fario · Est. 2024 · New Delhi</motion.p>
        <div className="overflow-hidden mb-8">
          <motion.h2 variants={maskReveal}
            className="font-heading text-white text-5xl md:text-8xl font-black uppercase tracking-tighter"
          >Born to<br />Move</motion.h2>
        </div>
        <motion.div variants={fadeUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Link to="/products"
            className="inline-flex items-center gap-2 bg-fario-lime text-fario-dark px-10 py-4 font-black text-sm uppercase tracking-widest hover:bg-white transition-colors shadow-xl"
          >Explore All <ArrowRight size={16} /></Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ── VIDEO BREAK 3 (NEW) — side-by-side image + video ──────────────
const VideoImageSplit = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const leftY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rightY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className="py-0 bg-fario-dark overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh]">
        {/* Left: HL3 image with parallax */}
        <motion.div style={{ y: leftY }} className="relative overflow-hidden">
          <motion.img src={IMGS.velocityElite} alt="Velocity Elite"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 1.03 }}
            transition={{ duration: 0.6, ease: EASE }}
            onError={e => { (e.target as HTMLImageElement).src = IMGS.aeroStride; }}
          />
          <div className="absolute inset-0 bg-fario-purple/30 mix-blend-multiply pointer-events-none" />
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-8 left-8"
          >
            <span className="text-white font-heading font-black uppercase text-3xl drop-shadow-lg">Velocity Elite</span>
            <p className="text-fario-lime text-sm mt-1">Speed Unleashed</p>
          </motion.div>
        </motion.div>

        {/* Right: video with text overlay */}
        <motion.div style={{ y: rightY }} className="relative overflow-hidden">
          <BgVideo poster={IMGS.urbanGlide} />
          <div className="absolute inset-0 bg-fario-dark/50" />
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="absolute inset-0 flex flex-col items-start justify-end p-8"
          >
            <span className="text-fario-lime text-xs font-bold uppercase tracking-widest mb-2">Live · In Action</span>
            <span className="text-white font-heading font-black uppercase text-3xl">See the Craft</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ── TESTIMONIALS ─────────────────────────────────────────────────
const Testimonials = () => (
  <section className="py-28 bg-fario-dark overflow-hidden">
    <div className="container mx-auto px-6 md:px-14">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
        <motion.p variants={fadeUp} className="text-fario-lime text-xs font-bold uppercase tracking-widest mb-3">Customer Love</motion.p>
        <motion.h2 variants={fadeUp} className="font-heading text-white text-4xl md:text-6xl font-black uppercase tracking-tighter">What They Say</motion.h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <TiltCard key={i}>
            <motion.div
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.8, ease: EASE }}
              whileTap={{ scale: 0.98 }}
              className="relative p-8 border border-fario-purple/30 bg-fario-purple/5 hover:bg-fario-purple/10 hover:border-fario-lime/40 transition-all duration-300 group h-full"
            >
              <span className="absolute top-4 right-6 text-fario-purple/20 text-7xl font-serif select-none">"</span>
              <Stars n={t.rating} />
              <p className="text-white/70 text-base leading-relaxed my-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}
                  className="w-10 h-10 rounded-full bg-fario-purple/40 flex items-center justify-center text-white font-black text-lg"
                >
                  {t.name[0]}
                </motion.div>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-fario-lime/60 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </TiltCard>
        ))}
      </div>
    </div>
  </section>
);

// ── INFOGRAPHIC ──────────────────────────────────────────────────
const InfographicSection = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % INFOGRAPHIC_FEATURES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const visuals = [
    // Adaptive Fit
    <svg key="fit" viewBox="0 0 200 200" className="w-full h-full stroke-fario-lime fill-none stroke-2">
      <motion.path d="M40,100 C40,60 160,60 160,100 C160,140 40,140 40,100 Z"
        animate={{ d: ['M40,100 C40,60 160,60 160,100 C160,140 40,140 40,100 Z', 'M30,100 C30,40 170,40 170,100 C170,160 30,160 30,100 Z', 'M40,100 C40,60 160,60 160,100 C160,140 40,140 40,100 Z'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {[...Array(5)].map((_, i) => (
        <motion.line key={i} x1={60 + i * 20} y1="60" x2={60 + i * 20} y2="140" strokeDasharray="4 4"
          animate={{ y1: [60, 50, 60], y2: [140, 150, 140] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
        />
      ))}
    </svg>,
    // Cushion
    <svg key="cushion" viewBox="0 0 200 200" className="w-full h-full fill-none">
      {[0, 10, 20].map((offset, i) => (
        <motion.path key={i} d={`M40,${140 - offset} Q100,${140 - offset} 160,${140 - offset}`} stroke="#7a51a0" strokeWidth="4"
          animate={{ d: [`M40,${140 - offset} Q100,${140 - offset} 160,${140 - offset}`, `M40,${140 - offset} Q100,${160 - offset} 160,${140 - offset}`, `M40,${140 - offset} Q100,${140 - offset} 160,${140 - offset}`] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'circInOut' }}
        />
      ))}
      <motion.circle cx="100" cy="100" r="15" fill="#d9f99d"
        animate={{ cy: [60, 125, 60], scaleY: [1, 0.75, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'circInOut' }}
      />
    </svg>,
    // Grip
    <svg key="grip" viewBox="0 0 200 200" className="w-full h-full fill-none stroke-fario-lime stroke-2">
      <defs>
        <pattern id="tread2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0,20 L20,0 L40,20 M0,40 L20,20 L40,40" fill="none" stroke="currentColor" strokeWidth="2" />
        </pattern>
        <mask id="cm2"><circle cx="100" cy="100" r="80" fill="white" /></mask>
      </defs>
      <motion.rect x="0" y="0" width="200" height="200" fill="url(#tread2)"
        animate={{ y: [0, 40] }} transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }} mask="url(#cm2)"
      />
      <motion.circle cx="100" cy="100" r="85" stroke="#0f172a" strokeWidth="10"
        animate={{ stroke: ['#0f172a', '#d9f99d', '#0f172a'] }} transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>,
    // Fresh
    <svg key="fresh" viewBox="0 0 200 200" className="w-full h-full fill-none">
      <path d="M100,30 L160,50 V100 C160,140 100,180 100,180 C100,180 40,140 40,100 V50 L100,30 Z" stroke="#7a51a0" strokeWidth="2" />
      {[...Array(8)].map((_, i) => (
        <motion.circle key={i} r={Math.random() * 3 + 2} fill="#d9f99d"
          initial={{ x: 70 + Math.random() * 60, y: 160, opacity: 0 }}
          animate={{ y: 40, opacity: [0, 1, 0] }}
          transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
        />
      ))}
    </svg>,
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-14">
        <div className="text-center mb-16">
          <span className="px-3 py-1 bg-fario-dark text-fario-lime text-xs font-bold uppercase tracking-widest rounded-sm mb-4 inline-block font-heading">Engineering Lab</span>
          <h2 className="font-heading text-4xl md:text-5xl font-black text-fario-dark uppercase tracking-tighter mt-3">
            Science in <span style={{ WebkitTextStroke: '2px #7a51a0', color: 'transparent' }}>Motion</span>
          </h2>
        </div>

        <div className="bg-fario-dark rounded-3xl p-6 md:p-12 flex flex-col lg:flex-row gap-10 border border-fario-purple/20 relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-fario-lime/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="lg:w-1/2 flex flex-col justify-center gap-2 relative z-10">
            {INFOGRAPHIC_FEATURES.map((f, idx) => (
              <motion.button key={f.id} onClick={() => setActive(idx)}
                className={`text-left p-6 rounded-xl transition-all duration-300 border-l-4 ${active === idx ? 'bg-white/10 border-fario-lime' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                whileHover={{ x: 8 }} whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-heading text-xl font-bold ${active === idx ? 'text-fario-lime' : 'text-white'}`}>{f.title}</h3>
                  {active === idx && <motion.div layoutId="infodot" className="w-2 h-2 bg-fario-lime rounded-full" />}
                </div>
                <p className={`text-sm ${active === idx ? 'text-gray-300' : 'text-gray-500'}`}>{f.desc}</p>
              </motion.button>
            ))}
          </div>

          <div className="lg:w-1/2 min-h-[300px] lg:min-h-[400px] bg-black/40 rounded-[2.5rem] border border-white/10 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-fario-lime rounded-tl-3xl opacity-40" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-fario-lime rounded-br-3xl opacity-40" />
            <div className="absolute top-8 right-8 text-xs font-bold text-fario-lime opacity-60 tracking-widest font-heading">MATERIAL.LAB // 0{active + 1}</div>
            <AnimatePresence mode="wait">
              <motion.div key={active} className="w-full h-full p-12 max-w-xs"
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
              >
                {visuals[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── NEWSLETTER ───────────────────────────────────────────────────
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section className="relative py-32 overflow-hidden bg-fario-purple">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-fario-lime/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fario-dark/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none overflow-hidden">
        <img src={IMGS.aeroStride} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-14 text-center max-w-2xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-fario-lime text-xs font-bold uppercase tracking-widest mb-4">Inner Circle</motion.p>
          <motion.h2 variants={fadeUp} className="font-heading text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Join the<br />Movement</motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 mb-12">Early access. Exclusive drops. Member-only pricing.</motion.p>
          <motion.form variants={fadeUp} onSubmit={e => { e.preventDefault(); if (email) setDone(true); }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            {!done ? (
              <>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border border-white/30 text-white placeholder:text-white/40 px-6 py-4 text-sm outline-none focus:border-fario-lime transition"
                />
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="bg-fario-lime hover:bg-white text-fario-dark px-8 py-4 text-xs font-black uppercase tracking-widest transition-all"
                >Subscribe</motion.button>
              </>
            ) : (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-white text-lg font-bold">
                ✓ Welcome to Fario Inner Circle!
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

// ── PAGE ────────────────────────────────────────────────────────
export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
      className="bg-white min-h-screen font-sans selection:bg-fario-purple selection:text-fario-lime"
    >
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-fario-lime z-[200] shadow-[0_0_12px_rgba(217,249,157,0.7)]"
      />

      <Hero />
      <MarqueeBand />
      <CategoryGrid />
      <VideoCinematic />
      <ProductCarousel />
      <TrustStrip />
      <Editorial />
      <GalleryWall />
      <VideoImageSplit />
      <VideoBanner />
      <Testimonials />
      <InfographicSection />
      <Newsletter />
    </motion.div>
  );
}
