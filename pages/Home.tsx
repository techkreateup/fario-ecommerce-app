/*
 * FARIO HOME — YouTube Iframe Background Videos (100% reliable)
 * 4 YouTube videos in loop · All scroll + hover + touch animations
 * NO Header · NO Footer · NO Testimonials · NO fario.mp4
 *
 * VIDEO SOURCES (YouTube - always work, no CORS, no 403):
 *  V1 Hero:     Luxury fashion shoes close-up
 *  V2 Break:    Street fashion walking
 *  V3 Editorial:Sneaker product shots
 *  V4 Banner:   Urban fashion lifestyle
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, ShoppingBag, Heart,
  ChevronLeft, ChevronRight, Truck, ShieldCheck, RefreshCcw, Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── BASE PATH ──────────────────────────────────────────────────
const BASE = (import.meta as any).env.BASE_URL as string;

// ─── HL3 IMAGES ────────────────────────────────────────────────
const d = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;
const IMG = {
  aero: d('1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-'),
  urban: d('1pc6UNVFR889igs7LbnQml_DpWpVd5AP2'),
  mid: d('1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU'),
  vel: d('19UKGRbcIZHffq1xs56MekmVpgF90H2kr'),
  stealth: d('1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC'),
  tote: d('1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ'),
  sling: d('1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i'),
  logo: `${BASE}fario-logo.png`,
};

// ─── YOUTUBE BACKGROUND VIDEO IDs ─────────────────────────────
// All are popular public fashion/shoe videos, no copyright block on embeds
const YT = {
  hero: 'tLMzIQJfGVc', // Nike shoe campaign style – luxury footwear
  break1: 'JXP7y-oU0t0', // Urban street fashion walking loop
  editorial: '3GwjfUFyY6M', // Sneaker product video slow motion
  banner: 'dK3Iu5_KZHU', // Fashion lifestyle walking video
};

// YouTube iframe as background video — autoplay, muted, loop, no controls
const YTBg = ({
  videoId,
  overlay = 'rgba(15,23,42,0.55)',
  className = '',
}: {
  videoId: string;
  overlay?: string;
  className?: string;
}) => {
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&origin=${window.location.origin}`;
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <iframe
        src={src}
        allow="autoplay; fullscreen"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '177.77vh',
          height: '56.25vw',
          minWidth: '100%',
          minHeight: '100%',
          transform: 'translate(-50%, -50%)',
          border: 'none',
          pointerEvents: 'none',
        }}
        title={`bg-${videoId}`}
      />
      {overlay && <div style={{ position: 'absolute', inset: 0, background: overlay }} />}
    </div>
  );
};

// ─── 3D TILT CARD ──────────────────────────────────────────────
const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rX = useTransform(my, [-0.5, 0.5], [10, -10]);
  const rY = useTransform(mx, [-0.5, 0.5], [-10, 10]);
  const move = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);
  return (
    <motion.div ref={ref}
      style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={move}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      className={className}
    >{children}</motion.div>
  );
};

// ─── SCROLL PARALLAX IMAGE ──────────────────────────────────────
const ParaImg = ({
  src, alt, px = 40, cls = '',
}: { src: string; alt: string; px?: number; cls?: string }) => {
  const r = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: r, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-px, px]);
  return (
    <div ref={r} className={`overflow-hidden ${cls}`}>
      <motion.img src={src} alt={alt}
        style={{ y, scale: 1.15 }}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.22, filter: 'brightness(1.15) saturate(1.2)' }}
        whileTap={{ scale: 1.06, filter: 'brightness(1.3)' }}
        transition={{ duration: 0.5 }}
        onError={e => { (e.target as HTMLImageElement).src = IMG.aero; }}
      />
    </div>
  );
};

// ─── ANIMATION CONSTANTS ─────────────────────────────────────
const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const fadeUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: E } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.11 } } };
const maskIn = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.1, ease: E } },
};

// ─── DATA ─────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 'p1', name: 'AeroStride Pro', price: 12999, orig: 15999, badge: 'New', cat: 'Shoes', img: IMG.aero, alt: IMG.mid },
  { id: 'p2', name: 'Urban Glide', price: 8499, orig: 10999, badge: 'Bestseller', cat: 'Shoes', img: IMG.urban, alt: IMG.vel },
  { id: 'p3', name: 'Midnight Force', price: 14499, orig: 18999, badge: 'Limited', cat: 'Shoes', img: IMG.mid, alt: IMG.aero },
  { id: 'p4', name: 'Velocity Elite', price: 11999, orig: 14999, badge: undefined, cat: 'Shoes', img: IMG.vel, alt: IMG.urban },
  { id: 'p5', name: 'Stealth Commuter', price: 5999, orig: 7999, badge: undefined, cat: 'Bags', img: IMG.stealth, alt: IMG.tote },
  { id: 'p6', name: 'Modular Tote', price: 4499, orig: 5999, badge: undefined, cat: 'Bags', img: IMG.tote, alt: IMG.stealth },
  { id: 'p7', name: 'Tech Sling', price: 2999, orig: 3999, badge: undefined, cat: 'Acc.', img: IMG.sling, alt: IMG.aero },
];

const MARQUEE_ITEMS = [
  '★ Free Shipping ₹999+', '★ New Collection 2026', '★ Handcrafted Luxury',
  '★ 30-Day Returns', '★ Members Exclusive', '★ Carbon Neutral',
];

const GALLERY = [
  { img: IMG.aero, label: 'AeroStride', cls: 'col-span-2 row-span-2' },
  { img: IMG.urban, label: 'Urban Glide', cls: 'col-span-1 row-span-1' },
  { img: IMG.mid, label: 'Midnight', cls: 'col-span-1 row-span-1' },
  { img: IMG.vel, label: 'Velocity', cls: 'col-span-1 row-span-2' },
  { img: IMG.stealth, label: 'Stealth Bag', cls: 'col-span-1 row-span-1' },
  { img: IMG.tote, label: 'Mod. Tote', cls: 'col-span-1 row-span-1' },
  { img: IMG.sling, label: 'Tech Sling', cls: 'col-span-1 row-span-1' },
];

const FEATURES = [
  { id: 'fit', title: 'Adaptive Fit', desc: 'Smart mesh fibres expand to mould perfectly to unique foot shapes.' },
  { id: 'cushion', title: 'Cushioned Comfort', desc: 'High-density memory foam absorbs impact and returns energy with every step.' },
  { id: 'grip', title: 'Anti-Skid Grip', desc: 'Advanced tread patterns for maximum traction on any surface.' },
  { id: 'fresh', title: 'Freshness Control', desc: 'Antimicrobial lining promotes airflow and prevents odours all day.' },
];

const FIT_LINE_XS = [0, 1, 2, 3, 4];
const BUBBLE_DATA = [30, 70, 110, 150, 60, 120, 90];

// ══════════════════════════════════════════════════════════════
// SECTION 1 — HERO (YouTube Video 1)
// ══════════════════════════════════════════════════════════════
const Hero = () => {
  const { scrollY } = useScroll();
  const vidY = useTransform(scrollY, [0, 800], ['0%', '25%']);
  const textY = useTransform(scrollY, [0, 600], ['0%', '45%']);
  const op = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-screen overflow-hidden flex items-end pb-24 md:pb-36 bg-fario-dark">
      {/* VIDEO 1 — YouTube background */}
      <motion.div style={{ y: vidY }} className="absolute inset-0 scale-110">
        <YTBg videoId={YT.hero} overlay="linear-gradient(to top,rgba(15,23,42,0.97) 0%,rgba(15,23,42,0.35) 50%,rgba(15,23,42,0.15) 100%)" />
      </motion.div>

      {/* Animated floating particles */}
      {[12, 26, 40, 55, 70, 84].map((left, i) => (
        <motion.div key={i}
          className="absolute w-1 h-1 bg-fario-lime rounded-full"
          style={{ left: `${left}%`, top: `${20 + (i % 3) * 22}%` }}
          animate={{ y: [-12, 12, -12], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        />
      ))}

      <motion.div style={{ y: textY, opacity: op }} className="relative z-10 w-full px-6 md:px-20">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.span variants={fadeUp}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-fario-purple/30 backdrop-blur border border-fario-purple/50 text-fario-lime text-[10px] font-bold uppercase tracking-widest"
          >✦ Collection 2026 · Handcrafted Luxury</motion.span>

          {[
            { text: 'Walk', color: 'white', stroke: false },
            { text: 'In', color: '#7a51a0', stroke: false },
            { text: 'Luxury', color: 'transparent', stroke: true },
          ].map(({ text, color, stroke }) => (
            <div key={text} className="overflow-hidden mb-1">
              <motion.h1 variants={maskIn}
                className="font-heading font-black uppercase tracking-tighter"
                style={{
                  fontSize: 'clamp(58px, 12vw, 140px)',
                  lineHeight: 0.83,
                  color,
                  WebkitTextStroke: stroke ? '2px #d9f99d' : undefined,
                }}
              >{text}</motion.h1>
            </div>
          ))}

          <motion.p variants={fadeUp}
            className="text-white/65 text-base md:text-lg max-w-md leading-relaxed mt-5 mb-10"
          >
            Handcrafted footwear for every generation. Premium quality. Unbeatable comfort.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.07, boxShadow: '0 0 35px rgba(122,81,160,0.5)' }} whileTap={{ scale: 0.93 }}>
              <Link to="/products"
                className="inline-flex items-center gap-2 bg-fario-purple hover:bg-fario-lime hover:text-fario-dark text-white px-10 py-4 font-bold uppercase text-sm tracking-widest transition-all duration-300"
              >Shop Now <ArrowRight size={16} /></Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}>
              <Link to="/story"
                className="border border-white/40 text-white hover:bg-white/10 px-10 py-4 font-bold uppercase text-sm tracking-widest transition-all"
              >Our Story</Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
      >
        <div className="w-px h-14 bg-fario-lime/30 relative overflow-hidden">
          <motion.div className="w-full h-1/2 bg-fario-lime"
            animate={{ y: ['0%', '200%'] }} transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-white/30 text-[9px] uppercase tracking-widest">Scroll</span>
      </motion.div>
    </section>
  );
};

// ── MARQUEE ────────────────────────────────────────────────────
const Marquee = () => (
  <div className="bg-fario-lime py-4 overflow-hidden">
    <motion.div
      animate={{ x: ['0%', '-50%'] }}
      transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
      className="flex gap-10 whitespace-nowrap w-max"
    >
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
        <span key={i} className="text-fario-dark font-black text-sm uppercase tracking-widest">{t}</span>
      ))}
    </motion.div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// SECTION 2 — VIDEO BREAK (YouTube Video 2)
// ══════════════════════════════════════════════════════════════
const VideoBreak = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1.0]);

  return (
    <section ref={ref} className="relative h-[60vh] overflow-hidden flex items-center justify-center bg-fario-dark">
      <motion.div style={{ scale }} className="absolute inset-0">
        <YTBg videoId={YT.break1} overlay="rgba(15,23,42,0.6)" />
      </motion.div>

      <motion.div
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.2 }} variants={stagger}
        className="relative z-10 text-center px-6"
      >
        <motion.p variants={fadeUp}
          className="text-fario-lime text-xs font-bold uppercase tracking-[0.4em] mb-4"
        >Crafted for Champions</motion.p>
        <div className="overflow-hidden">
          <motion.h2 variants={maskIn}
            className="font-heading text-white font-black uppercase tracking-tighter"
            style={{ fontSize: 'clamp(44px, 9vw, 120px)', lineHeight: 0.88 }}
          >Feel the <span className="text-fario-purple">Difference</span></motion.h2>
        </div>
        <motion.div variants={fadeUp} className="mt-10" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
          <Link to="/products"
            className="inline-flex items-center gap-2 bg-fario-lime text-fario-dark px-8 py-4 font-black text-sm uppercase tracking-widest hover:bg-white transition"
          >Shop Shoes <ArrowRight size={16} /></Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ── CATEGORY GRID — Layered parallax (different speed = depth) ──
const CategoryGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const speeds = [80, 40, -40, -80].map(s => useTransform(scrollYProgress, [0, 1], [s, -s]));

  const cats = [
    { label: 'Shoes', sub: '12 styles', img: IMG.aero },
    { label: 'Sneakers', sub: '8 styles', img: IMG.urban },
    { label: 'Bags', sub: '6 styles', img: IMG.stealth },
    { label: 'Accessories', sub: '10 styles', img: IMG.sling },
  ];

  return (
    <section ref={ref} className="py-28 bg-fario-dark overflow-hidden">
      <div className="container mx-auto px-6 md:px-14">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="flex justify-between items-end mb-16"
        >
          <div>
            <motion.p variants={fadeUp} className="text-fario-lime text-xs font-bold uppercase tracking-widest mb-3">Shop by Category</motion.p>
            <div className="overflow-hidden">
              <motion.h2 variants={maskIn}
                className="font-heading text-white font-black uppercase tracking-tighter"
                style={{ fontSize: 'clamp(40px, 7vw, 96px)', lineHeight: 0.9 }}
              >Our<br />Collections</motion.h2>
            </div>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-fario-purple hover:text-fario-lime text-xs font-bold uppercase tracking-widest transition-colors">
            View All <ArrowUpRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[70vh]">
          {cats.map((c, i) => (
            <TiltCard key={c.label} className="h-full">
              <motion.div style={{ y: speeds[i] }} className="relative group overflow-hidden cursor-pointer h-full">
                <motion.img src={c.img} alt={c.label}
                  whileHover={{ scale: 1.12 }} whileTap={{ scale: 1.04 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = IMG.aero; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fario-dark/85 via-transparent to-transparent" />
                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: 'inset 0 0 0 2px #d9f99d' }}
                />
                <div className="absolute bottom-5 left-5">
                  <span className="text-white font-heading font-black uppercase text-xl block">{c.label}</span>
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

// ── PRODUCT CARD ───────────────────────────────────────────────
const PCard = ({ p }: { p: typeof PRODUCTS[0] }) => {
  const [hov, setHov] = useState(false);
  const [wish, setWish] = useState(false);
  const disc = Math.round((1 - p.price / p.orig) * 100);
  return (
    <TiltCard className="min-w-[270px] md:min-w-[300px] flex-shrink-0 snap-start">
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div className="relative aspect-[3/4] overflow-hidden border border-fario-purple/20 mb-4">
          {p.badge && <span className="absolute top-3 left-3 z-20 bg-fario-purple text-white text-[9px] font-bold uppercase px-3 py-1">{p.badge}</span>}
          <span className="absolute top-3 right-10 z-20 bg-fario-lime text-fario-dark text-[9px] font-black px-2 py-0.5">-{disc}%</span>
          <motion.img src={p.img} alt={p.name}
            animate={{ opacity: hov ? 0 : 1, scale: hov ? 1.08 : 1 }} transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = IMG.aero; }}
          />
          <motion.img src={p.alt} alt={p.name + '2'}
            animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.94 }} transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = IMG.urban; }}
          />
          <motion.div animate={{ opacity: hov ? 1 : 0 }}
            className="absolute inset-0 ring-2 ring-fario-lime pointer-events-none"
          />
          <motion.button onClick={() => setWish(w => !w)}
            whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.7 }}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-fario-dark/70 backdrop-blur flex items-center justify-center hover:bg-fario-purple transition-colors"
          >
            <Heart size={14} className={wish ? 'fill-red-400 text-red-400' : 'text-white'} />
          </motion.button>
          <motion.div initial={{ y: '100%' }} animate={{ y: hov ? '0%' : '100%' }}
            transition={{ duration: 0.3 }} className="absolute bottom-0 inset-x-0 z-20"
          >
            <button className="w-full bg-fario-purple hover:bg-fario-lime hover:text-fario-dark text-white py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
              <ShoppingBag size={14} /> Add to Cart
            </button>
          </motion.div>
        </div>
        <p className="text-fario-purple text-[10px] uppercase tracking-widest mb-0.5">{p.cat}</p>
        <h3 className="text-fario-dark font-heading font-black uppercase text-sm">{p.name}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-fario-dark font-bold">₹{p.price.toLocaleString('en-IN')}</span>
          <span className="text-gray-400 line-through text-xs">₹{p.orig.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </TiltCard>
  );
};

const Carousel = () => {
  const track = useRef<HTMLDivElement>(null);
  const [L, setL] = useState(false);
  const [R, setR] = useState(true);
  const onSc = () => {
    if (!track.current) return;
    const { scrollLeft: sl, scrollWidth: sw, clientWidth: cw } = track.current;
    setL(sl > 4); setR(sl + cw < sw - 5);
  };
  return (
    <section className="py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-14">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <motion.p variants={fadeUp} className="text-fario-purple text-xs font-bold uppercase tracking-widest mb-2">Fresh Drops</motion.p>
            <div className="overflow-hidden">
              <motion.h2 variants={maskIn}
                className="font-heading text-fario-dark font-black uppercase tracking-tighter"
                style={{ fontSize: 'clamp(36px, 6vw, 80px)' }}
              >New Arrivals</motion.h2>
            </div>
          </div>
          <div className="flex gap-2">
            {(['l', 'r'] as const).map(dir => (
              <motion.button key={dir}
                onClick={() => track.current?.scrollBy({ left: dir === 'l' ? -340 : 340, behavior: 'smooth' })}
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                disabled={dir === 'l' ? !L : !R}
                className="w-10 h-10 rounded-full border-2 border-fario-purple text-fario-purple flex items-center justify-center hover:bg-fario-purple hover:text-white disabled:opacity-30 transition-all"
              >{dir === 'l' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}</motion.button>
            ))}
          </div>
        </motion.div>
        <div ref={track} onScroll={onSc}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' } as React.CSSProperties}
        >
          {PRODUCTS.map(p => <PCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
};

// ── TRUST STRIP ─────────────────────────────────────────────────
const Trust = () => {
  const items = [
    { icon: <Truck size={30} />, t: 'Free Delivery', s: 'On orders ₹999+' },
    { icon: <ShieldCheck size={30} />, t: '2-Year Warranty', s: 'Genuine leather' },
    { icon: <RefreshCcw size={30} />, t: '30-Day Returns', s: 'Hassle free' },
    { icon: <Award size={30} />, t: 'ISO Certified', s: 'Master artisans' },
  ];
  return (
    <div className="border-y border-fario-purple/20 bg-fario-purple/5">
      <div className="container mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((f, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -6, scale: 1.04 }} whileTap={{ scale: 0.94 }}
            className="flex flex-col items-center text-center gap-3 group cursor-default"
          >
            <motion.div className="text-fario-purple group-hover:text-fario-lime transition-colors duration-300"
              whileHover={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 0.4 }}
            >{f.icon}</motion.div>
            <p className="text-fario-dark font-bold text-sm uppercase tracking-wide">{f.t}</p>
            <p className="text-fario-dark/50 text-xs">{f.s}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SECTION 3 — EDITORIAL (YouTube Video 3 sticky)
// ══════════════════════════════════════════════════════════════
const Editorial = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const ty = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={ref} className="flex flex-col md:flex-row min-h-screen bg-fario-dark">
      {/* VIDEO 3 sticky */}
      <div className="w-full md:w-1/2 h-[55vh] md:h-screen md:sticky md:top-0 overflow-hidden relative">
        <YTBg videoId={YT.editorial} overlay="rgba(122,81,160,0.15)" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-fario-dark/60 pointer-events-none" />
        {/* Animated scan line */}
        <motion.div className="absolute left-0 right-0 h-[2px] bg-fario-lime/20 pointer-events-none"
          animate={{ top: ['0%', '100%'] }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
        />
      </div>

      {/* Scroll text */}
      <motion.div style={{ y: ty }} className="w-full md:w-1/2 flex items-center p-10 md:p-20">
        <div className="max-w-md">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}
            className="text-fario-lime text-xs font-bold uppercase tracking-[0.35em] block mb-8"
          >— The Fario Philosophy</motion.span>

          {['Every', 'Step', 'Counts'].map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.div
                initial={{ y: '100%' }} whileInView={{ y: '0%' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, ease: E, delay: i * 0.12 }}
                className={`font-heading font-black uppercase tracking-tighter leading-none mb-1 ${i === 2 ? 'text-fario-purple' : 'text-white'}`}
                style={{ fontSize: 'clamp(44px, 7vw, 96px)' }}
              >{word}</motion.div>
            </div>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white/60 text-lg leading-loose mt-8 mb-12"
          >14 prototype stages. Tested by athletes. Loved by every generation.</motion.p>

          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
            <Link to="/story"
              className="inline-flex items-center gap-2 bg-fario-purple hover:bg-fario-lime hover:text-fario-dark text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all"
            >Read Our Story <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// ── GALLERY — all 7 images with scroll parallax + hover reveal ──
const Gallery = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6 md:px-14">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
        className="text-center mb-14"
      >
        <motion.p variants={fadeUp} className="text-fario-purple text-xs font-bold uppercase tracking-widest mb-3">Gallery</motion.p>
        <div className="overflow-hidden">
          <motion.h2 variants={maskIn}
            className="font-heading text-fario-dark font-black uppercase tracking-tighter"
            style={{ fontSize: 'clamp(36px, 6vw, 80px)' }}
          >The Full Collection</motion.h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[200px]">
        {GALLERY.map((g, i) => (
          <motion.div key={g.label}
            className={`relative group cursor-pointer ${g.cls}`}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: i * 0.07, duration: 0.65, ease: E }}
          >
            <ParaImg src={g.img} alt={g.label} px={30} cls="absolute inset-0" />
            <motion.div
              className="absolute inset-0 bg-fario-dark/55 flex items-end p-4 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white font-heading font-black uppercase text-lg">{g.label}</span>
            </motion.div>
            <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-fario-lime transition-all duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ══════════════════════════════════════════════════════════════
// SECTION 4 — VIDEO BANNER (YouTube Video 4)
// ══════════════════════════════════════════════════════════════
const VideoBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1.0]);
  const ty = useTransform(scrollYProgress, [0, 1], [-25, 25]);

  return (
    <section ref={ref} className="relative h-[72vh] overflow-hidden flex items-center justify-center bg-fario-dark">
      <motion.div style={{ scale }} className="absolute inset-0">
        <YTBg videoId={YT.banner} overlay="rgba(15,23,42,0.65)" />
      </motion.div>

      <motion.div style={{ y: ty }}
        className="relative z-10 text-center px-6"
      >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-fario-lime text-xs font-bold uppercase tracking-[0.4em] mb-4">
            Fario · Est. 2024 · New Delhi
          </motion.p>
          <div className="overflow-hidden mb-8">
            <motion.h2 variants={maskIn}
              className="font-heading text-white font-black uppercase tracking-tighter"
              style={{ fontSize: 'clamp(48px, 9vw, 120px)', lineHeight: 0.88 }}
            >Born to<br />Move</motion.h2>
          </div>
          <motion.div variants={fadeUp} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.94 }}>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-fario-lime text-fario-dark px-10 py-4 font-black text-sm uppercase tracking-widest hover:bg-white transition-colors shadow-2xl"
            >Explore All <ArrowRight size={16} /></Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ── INFOGRAPHIC — SVG animations (4 tech features) ─────────────
const SVG_FIT = (
  <svg viewBox="0 0 200 200" fill="none" stroke="#d9f99d" strokeWidth="2" className="w-full h-full">
    <motion.path
      d="M40,100 C40,65 160,65 160,100 C160,135 40,135 40,100 Z"
      animate={{ d: ['M40,100 C40,65 160,65 160,100 C160,135 40,135 40,100 Z', 'M28,100 C28,38 172,38 172,100 C172,162 28,162 28,100 Z', 'M40,100 C40,65 160,65 160,100 C160,135 40,135 40,100 Z'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
    {FIT_LINE_XS.map(i => (
      <motion.circle key={i} r="4" cx={60 + i * 20} fill="#d9f99d"
        animate={{ cy: [70, 55, 70] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
      />
    ))}
  </svg>
);

const SVG_CUSH = (
  <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
    <line x1="20" y1="155" x2="180" y2="155" stroke="#374151" strokeWidth="2" />
    {[0, 10, 20].map((offset, i) => (
      <motion.path key={i}
        d={`M38,${144 - offset} Q100,${144 - offset} 162,${144 - offset}`}
        stroke="#7a51a0" strokeWidth="4"
        animate={{ d: [`M38,${144 - offset} Q100,${144 - offset} 162,${144 - offset}`, `M38,${144 - offset} Q100,${162 - offset} 162,${144 - offset}`, `M38,${144 - offset} Q100,${144 - offset} 162,${144 - offset}`] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'circInOut', delay: i * 0.08 }}
      />
    ))}
    <motion.circle cx="100" r="14" fill="#d9f99d"
      animate={{ cy: [58, 130, 58], scaleY: [1, 0.72, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'circInOut' }}
    />
  </svg>
);

const SVG_GRIP = (
  <svg viewBox="0 0 200 200" fill="none" strokeWidth="2" className="w-full h-full">
    <defs>
      <pattern id="tp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M0,20 L20,0 L40,20 M0,40 L20,20 L40,40" stroke="#d9f99d" strokeWidth="1.5" fill="none" />
      </pattern>
      <mask id="cmp"><circle cx="100" cy="100" r="82" fill="white" /></mask>
    </defs>
    <motion.rect x="0" y="0" width="200" height="200" fill="url(#tp)"
      animate={{ y: [0, 40] }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }} mask="url(#cmp)"
    />
    <motion.circle cx="100" cy="100" r="88" stroke="#0f172a" strokeWidth="12"
      animate={{ stroke: ['#0f172a', '#d9f99d', '#0f172a'] }} transition={{ duration: 2.2, repeat: Infinity }}
    />
  </svg>
);

const SVG_FRESH = (
  <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
    <path d="M100,28 L162,50 V104 C162,145 100,182 100,182 C100,182 38,145 38,104 V50 L100,28 Z" stroke="#7a51a0" strokeWidth="2" />
    {BUBBLE_DATA.map((cx, i) => (
      <motion.circle key={i} cx={cx} r={2 + (i % 3)} fill="#d9f99d"
        animate={{ cy: [165, 50, 165], opacity: [0, 1, 0] }}
        transition={{ duration: 1.8 + (i % 3) * 0.4, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 }}
      />
    ))}
  </svg>
);

const VISUALS = [SVG_FIT, SVG_CUSH, SVG_GRIP, SVG_FRESH];

const Infographic = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % 4), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-14">
        <div className="text-center mb-14">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="px-3 py-1 bg-fario-dark text-fario-lime text-xs font-bold uppercase tracking-widest inline-block mb-4"
          >Engineering Lab</motion.span>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }} whileInView={{ y: '0%' }}
              viewport={{ once: true }} transition={{ duration: 0.9, ease: E }}
              className="font-heading text-fario-dark font-black uppercase tracking-tighter"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
            >Science in{' '}
              <span style={{ WebkitTextStroke: '2px #7a51a0', color: 'transparent' }}>Motion</span>
            </motion.h2>
          </div>
        </div>

        <div className="bg-fario-dark rounded-3xl p-6 md:p-12 flex flex-col lg:flex-row gap-10 border border-fario-purple/20 relative overflow-hidden">
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-fario-lime/5 rounded-full blur-[70px] pointer-events-none" />

          <div className="lg:w-1/2 flex flex-col gap-2 justify-center z-10">
            {FEATURES.map((f, idx) => (
              <motion.button key={f.id} onClick={() => setActive(idx)}
                whileHover={{ x: 8 }} whileTap={{ scale: 0.97 }}
                className={`text-left p-5 rounded-xl transition-all duration-300 border-l-4 ${active === idx ? 'bg-white/10 border-fario-lime' : 'bg-transparent border-transparent hover:bg-white/5'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-heading font-bold text-lg ${active === idx ? 'text-fario-lime' : 'text-white'}`}>{f.title}</h3>
                  {active === idx && (
                    <motion.div layoutId="dot"
                      className="w-2.5 h-2.5 rounded-full bg-fario-lime"
                      animate={{ scale: [1, 1.35, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </div>
                <p className={`text-sm ${active === idx ? 'text-gray-300' : 'text-gray-600'}`}>{f.desc}</p>
              </motion.button>
            ))}
          </div>

          <div className="lg:w-1/2 min-h-[300px] bg-black/40 rounded-[2rem] border border-white/10 relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-5 left-5 w-9 h-9 border-t-2 border-l-2 border-fario-lime rounded-tl-2xl opacity-50" />
            <div className="absolute bottom-5 right-5 w-9 h-9 border-b-2 border-r-2 border-fario-lime rounded-br-2xl opacity-50" />
            <span className="absolute top-5 right-5 text-xs text-fario-lime font-bold tracking-widest opacity-70">LAB.0{active + 1}</span>
            <AnimatePresence mode="wait">
              <motion.div key={active} className="p-12 w-full max-w-[230px]"
                initial={{ opacity: 0, scale: 0.75, filter: 'blur(14px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.15, filter: 'blur(14px)' }}
                transition={{ duration: 0.45 }}
              >{VISUALS[active]}</motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── NEWSLETTER ─────────────────────────────────────────────────
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section className="relative py-32 overflow-hidden bg-fario-purple">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-fario-lime/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fario-dark/30 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 container mx-auto px-6 max-w-2xl text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-fario-lime text-xs font-bold uppercase tracking-widest mb-4">Inner Circle</motion.p>
          <div className="overflow-hidden mb-6">
            <motion.h2 variants={maskIn}
              className="font-heading text-white font-black uppercase tracking-tighter"
              style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
            >Join the<br />Movement</motion.h2>
          </div>
          <motion.p variants={fadeUp} className="text-white/70 mb-10">Early access. Exclusive drops. Member-only pricing.</motion.p>
          <motion.form variants={fadeUp}
            onSubmit={e => { e.preventDefault(); if (email) setDone(true); }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            {!done ? (<>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/30 text-white placeholder:text-white/40 px-6 py-4 text-sm outline-none focus:border-fario-lime transition"
              />
              <motion.button type="submit"
                whileHover={{ scale: 1.06, boxShadow: '0 0 24px #d9f99d60' }}
                whileTap={{ scale: 0.93 }}
                className="bg-fario-lime text-fario-dark px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-white transition-all"
              >Subscribe</motion.button>
            </>) : (
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

// ══════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════
export default function Home() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white min-h-screen font-sans selection:bg-fario-purple selection:text-fario-lime"
    >
      {/* Scroll progress bar — fixed top */}
      <motion.div
        style={{ scaleX: bar, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-fario-lime z-[999] shadow-[0_0_16px_rgba(217,249,157,0.8)]"
      />

      <Hero />
      <Marquee />
      <VideoBreak />
      <CategoryGrid />
      <Carousel />
      <Trust />
      <Editorial />
      <Gallery />
      <VideoBanner />
      <Infographic />
      <Newsletter />
    </motion.div>
  );
}
