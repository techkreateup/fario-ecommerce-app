/**
 * FARIO — ULTRA LUXURY HOME
 * Inspired by: Bottega Veneta · KITH · Loewe · Hermès
 * Video: /fario-brand.mp4 (self-hosted, guaranteed)
 * Images: HL3 Google Drive
 * NO Header · NO Footer · NO Testimonials
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, AnimatePresence,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, ShoppingBag, Heart,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

/* ─ BASE PATH (Vite GitHub Pages base) ─────────────────────── */
const BASE = (import.meta as any).env.BASE_URL as string; // '/fario-ecommerce-app/'

/* ─ ASSETS ──────────────────────────────────────────────────── */
const VIDEO = `${BASE}fario-brand.mp4`;
const d = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;
const HL3 = {
  a: d('1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-'), // AeroStride Pro
  b: d('1pc6UNVFR889igs7LbnQml_DpWpVd5AP2'), // Urban Glide
  c: d('1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU'), // Midnight Force
  d2: d('19UKGRbcIZHffq1xs56MekmVpgF90H2kr'), // Velocity Elite
  e: d('1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC'), // Stealth Commuter
  f: d('1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ'), // Modular Tote
  g: d('1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i'), // Tech Sling
};

/* ─ COLORS ───────────────────────────────────────────────────── */
const C = {
  black: '#080808',
  offwht: '#F2EDE8',
  purple: '#7a51a0',
  lime: '#d9f99d',
  gold: '#C9A97A',
  dim: 'rgba(242,237,232,0.15)',
};

/* ─ EASING + VARIANTS ───────────────────────────────────────── */
const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const maskReveal = {
  hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
  visible: { clipPath: 'inset(0% 0 0 0)', opacity: 1, transition: { duration: 1.1, ease: E } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: E } },
};
const stg = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─ PRODUCTS ─────────────────────────────────────────────────── */
const PRODUCTS = [
  { id: 'p1', name: 'AeroStride Pro', sub: 'Performance Shoe', price: 12999, orig: 15999, img: HL3.a, alt: HL3.c, tag: 'NEW' },
  { id: 'p2', name: 'Urban Glide', sub: 'Street Edition', price: 8499, orig: 10999, img: HL3.b, alt: HL3.d2, tag: 'HOT' },
  { id: 'p3', name: 'Midnight Force', sub: 'Limited Release', price: 14499, orig: 18999, img: HL3.c, alt: HL3.a, tag: 'LTD' },
  { id: 'p4', name: 'Velocity Elite', sub: 'Pro Series', price: 11999, orig: 14999, img: HL3.d2, alt: HL3.b },
  { id: 'p5', name: 'Stealth Commuter', sub: 'Urban Backpack', price: 5999, orig: 7999, img: HL3.e, alt: HL3.f },
  { id: 'p6', name: 'Modular Tote', sub: 'Carry Everything', price: 4499, orig: 5999, img: HL3.f, alt: HL3.e },
  { id: 'p7', name: 'Tech Sling', sub: 'Everyday Essential', price: 2999, orig: 3999, img: HL3.g, alt: HL3.a },
];

const TICKER = ['HANDCRAFTED SINCE 2024', 'FREE SHIPPING ₹999+', 'NEW COLLECTION 2026',
  '30-DAY RETURNS', 'CARBON NEUTRAL', 'MEMBERS EXCLUSIVE'];

const STATS = [
  { val: 50000, suf: '+', label: 'Pairs Sold' },
  { val: 14, suf: '', label: 'Prototype Stages' },
  { val: 99, suf: '%', label: 'Customer Love' },
  { val: 2, suf: 'yr', label: 'Warranty' },
];

/* ─ HOOKS ────────────────────────────────────────────────────── */
function useCount(target: number, inView: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setV(start);
      if (start >= target) clearInterval(t);
    }, 24);
    return () => clearInterval(t);
  }, [inView, target]);
  return v;
}

/* ─ COMPONENTS ───────────────────────────────────────────────── */

/** 3-D tilt card wrapper */
const Tilt = ({ children, cls = '' }: { children: React.ReactNode; cls?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rX = useTransform(my, [-0.5, 0.5], [12, -12]);
  const rY = useTransform(mx, [-0.5, 0.5], [-12, 12]);
  const move = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);
  return (
    <motion.div ref={ref}
      style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', perspective: 900 }}
      onMouseMove={move}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      className={cls}
    >{children}</motion.div>
  );
};

/** Scroll-parallax image */
const PImg = ({ src, alt, px = 40, cls = '' }: { src: string; alt: string; px?: number; cls?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-px, px]);
  return (
    <div ref={ref} className={`overflow-hidden ${cls}`}>
      <motion.img src={src} alt={alt}
        style={{ y, scale: 1.14 }}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.2, filter: 'brightness(1.08)' }}
        whileTap={{ scale: 1.06 }}
        transition={{ duration: 0.55 }}
        onError={e => { (e.target as HTMLImageElement).src = HL3.a; }}
      />
    </div>
  );
};

/** Char-by-char animated headline */
const SplitText = ({
  text, className, delay = 0,
}: { text: string; className?: string; delay?: number }) => (
  <span className={`inline-flex flex-wrap ${className}`} aria-label={text}>
    {text.split('').map((ch, i) => (
      <motion.span key={i}
        initial={{ opacity: 0, y: '60%', rotateX: -40 }}
        whileInView={{ opacity: 1, y: '0%', rotateX: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: E, delay: delay + i * 0.035 }}
        style={{ display: ch === ' ' ? 'inline' : 'inline-block' }}
      >{ch === ' ' ? '\u00a0' : ch}</motion.span>
    ))}
  </span>
);

/** Animated number */
const Counter = ({ val, suf, label }: { val: number; suf: string; label: string }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCount(val, inView);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: E }}
      className="flex flex-col gap-1"
    >
      <span className="font-heading font-black text-5xl md:text-7xl leading-none"
        style={{ color: C.offwht }}
      >{count}{suf}</span>
      <span className="text-xs uppercase tracking-[0.25em] opacity-50"
        style={{ color: C.offwht }}
      >{label}</span>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   HERO — full-screen fario-brand.mp4 + giant editorial type
══════════════════════════════════════════════════════════════ */
const Hero = () => {
  const { scrollY } = useScroll();
  const vY = useTransform(scrollY, [0, 900], ['0%', '28%']);
  const op = useTransform(scrollY, [0, 600], [1, 0]);
  const tY = useTransform(scrollY, [0, 600], ['0%', '40%']);

  return (
    <section className="relative h-screen overflow-hidden flex flex-col justify-end" style={{ background: C.black }}>
      {/* VIDEO — self hosted */}
      <motion.div style={{ y: vY }} className="absolute inset-0 scale-110">
        <video autoPlay muted loop playsInline poster={HL3.a}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
        {/* Gradient vignette */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.97) 0%, rgba(8,8,8,0.3) 50%, rgba(8,8,8,0.2) 100%)' }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(8,8,8,0.6) 0%, transparent 60%)' }}
        />
      </motion.div>

      {/* Grain texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }}
      />

      {/* Content */}
      <motion.div style={{ y: tY, opacity: op }}
        className="relative z-10 px-8 md:px-20 pb-20 md:pb-32"
      >
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.5, ease: E }}
          className="text-xs font-bold uppercase mb-10"
          style={{ color: C.gold }}
        >✦ New Delhi · Est. 2024 · Collection 2026</motion.div>

        <h1 className="font-heading font-black uppercase leading-[0.82] tracking-tighter mb-8"
          style={{ fontSize: 'clamp(72px, 14vw, 180px)', color: C.offwht }}
        >
          <div className="overflow-hidden">
            <SplitText text="Born" className="block" />
          </div>
          <div className="overflow-hidden">
            <SplitText text="for" delay={0.15}
              className="block"
              style={{ WebkitTextStroke: `2px ${C.gold}`, color: 'transparent' } as React.CSSProperties}
            />
          </div>
          <div className="overflow-hidden">
            <SplitText text="Luxury" delay={0.3} className="block" />
          </div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: E }}
          className="text-base md:text-lg max-w-md leading-relaxed mb-10 opacity-60"
          style={{ color: C.offwht }}
        >
          Handcrafted in India. Tested by athletes. Worn by everyone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex flex-wrap gap-4"
        >
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}>
            <Link to="/products"
              className="inline-flex items-center gap-3 px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] transition-all duration-300"
              style={{ background: C.gold, color: C.black }}
            >Shop Now <ArrowRight size={16} /></Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}>
            <Link to="/story"
              className="inline-flex items-center gap-3 px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] transition-all duration-300"
              style={{ border: `1px solid ${C.dim}`, color: C.offwht }}
            >Our Story</Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 right-12 z-20 flex items-center gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-40" style={{ color: C.offwht }}>Scroll</span>
        <div className="w-16 h-px relative overflow-hidden" style={{ background: C.dim }}>
          <motion.div className="absolute left-0 top-0 h-full w-1/2"
            style={{ background: C.gold }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

/* ── TICKER ────────────────────────────────────────────────────── */
const Ticker = () => (
  <div className="overflow-hidden py-5 border-y" style={{ borderColor: C.dim, background: C.black }}>
    <motion.div
      animate={{ x: ['0%', '-50%'] }}
      transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
      className="flex gap-16 whitespace-nowrap w-max"
    >
      {[...TICKER, ...TICKER].map((t, i) => (
        <span key={i} className="text-xs font-bold uppercase tracking-[0.3em]"
          style={{ color: C.gold }}
        >{t}</span>
      ))}
    </motion.div>
  </div>
);

/* ── STATS ─────────────────────────────────────────────────────── */
const Stats = () => (
  <section className="py-24" style={{ background: C.black }}>
    <div className="container mx-auto px-8 md:px-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y py-16" style={{ borderColor: C.dim }}>
        {STATS.map(s => <Counter key={s.label} {...s} />)}
      </div>
    </div>
  </section>
);

/* ── VIDEO BREAK — Hero 2 (second fario-brand loop) ─────────────
   Different start time via currentTime on canplay ────────────── */
const VideoBreak = () => {
  const ref = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const sc = useTransform(scrollYProgress, [0, 1], [1.18, 1.0]);

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;
    const seek = () => { v.currentTime = 4; };
    v.addEventListener('canplay', seek, { once: true });
  }, []);

  return (
    <section ref={ref} className="relative h-[60vh] overflow-hidden flex items-center justify-center"
      style={{ background: C.black }}
    >
      <motion.div style={{ scale: sc }} className="absolute inset-0">
        <video ref={vRef} autoPlay muted loop playsInline poster={HL3.c}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.9), rgba(8,8,8,0.3), rgba(8,8,8,0.9))' }}
        />
      </motion.div>

      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-xs font-bold uppercase tracking-[0.45em] mb-8"
          style={{ color: C.gold }}
        >The Fario Standard</motion.p>

        <h2 className="font-heading font-black uppercase tracking-tighter leading-none"
          style={{ fontSize: 'clamp(52px, 10vw, 130px)', color: C.offwht }}
        >
          <SplitText text="Every" className="block" />
          <SplitText text="Step" delay={0.2}
            className="block"
            style={{ WebkitTextStroke: `2px ${C.purple}`, color: 'transparent' } as React.CSSProperties}
          />
          <SplitText text="Counts" delay={0.4} className="block" />
        </h2>
      </div>
    </section>
  );
};

/* ── EDITORIAL GRID ──────────────────────────────────────────────
   Asymmetric 3-col layout, editorial feel ─────────────────────── */
const Editorial = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={ref} className="py-32 overflow-hidden" style={{ background: C.black }}>
      <div className="container mx-auto px-8 md:px-20">
        <div className="grid grid-cols-12 gap-4 md:gap-6 items-end">
          {/* Left tall image */}
          <motion.div style={{ y: y1 }} className="col-span-5 md:col-span-4 h-[70vh] relative">
            <Tilt cls="h-full">
              <PImg src={HL3.a} alt="AeroStride Pro" px={50} cls="h-full w-full" />
            </Tilt>
            <div className="absolute bottom-0 left-0 right-0 p-6"
              style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.9), transparent)' }}
            >
              <span className="text-xs uppercase tracking-widest" style={{ color: C.gold }}>AeroStride Pro</span>
              <p className="font-heading font-black uppercase text-2xl" style={{ color: C.offwht }}>₹12,999</p>
            </div>
          </motion.div>

          {/* Center headline + text */}
          <div className="col-span-7 md:col-span-4 flex flex-col justify-center gap-8 py-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stg}>
              <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.4em] mb-6" style={{ color: C.gold }}>
                New Collection
              </motion.p>
              <motion.h2 variants={maskReveal}
                className="font-heading font-black uppercase tracking-tighter leading-none mb-8"
                style={{ fontSize: 'clamp(44px, 5vw, 72px)', color: C.offwht }}
              >The Art<br />of Motion</motion.h2>
              <motion.p variants={fadeUp}
                className="text-sm leading-loose opacity-50 mb-10"
                style={{ color: C.offwht }}
              >
                14 prototype stages. Advanced memory foam. Anti-skid grip. Freshness control. All in one shoe.
              </motion.p>
              <motion.div variants={fadeUp} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}>
                <Link to="/products"
                  className="inline-flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all"
                  style={{ border: `1px solid ${C.gold}`, color: C.gold }}
                >Explore <ArrowUpRight size={14} /></Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right image + small card */}
          <motion.div style={{ y: y2 }} className="hidden md:flex md:col-span-4 flex-col gap-4">
            <Tilt cls="h-[45vh]">
              <PImg src={HL3.b} alt="Urban Glide" px={35} cls="h-full w-full" />
            </Tilt>
            <Tilt cls="h-[24vh]">
              <PImg src={HL3.c} alt="Midnight Force" px={25} cls="h-full w-full" />
            </Tilt>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ── PRODUCT SHOWCASE ────────────────────────────────────────────
   Horizontal scroll, large cards, luxury feel ─────────────────── */
const PCard = ({ p }: { p: typeof PRODUCTS[0] }) => {
  const [hov, setHov] = useState(false);
  const [wish, setWish] = useState(false);
  const disc = Math.round((1 - p.price / p.orig) * 100);

  return (
    <Tilt cls="flex-shrink-0 w-[280px] md:w-[320px] snap-start group">
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden mb-5"
          style={{ border: `1px solid ${C.dim}` }}
        >
          {p.tag && (
            <span className="absolute top-4 left-4 z-20 text-[9px] font-black uppercase tracking-widest px-3 py-1"
              style={{ background: C.gold, color: C.black }}
            >{p.tag}</span>
          )}
          <motion.img src={p.img} alt={p.name}
            animate={{ opacity: hov ? 0 : 1, scale: hov ? 1.08 : 1 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = HL3.a; }}
          />
          <motion.img src={p.alt} alt={p.name + ' b'}
            animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.94 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = HL3.b; }}
          />
          {/* Gold ring on hover */}
          <motion.div animate={{ opacity: hov ? 1 : 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: `inset 0 0 0 2px ${C.gold}` }}
          />
          {/* Wishlist */}
          <motion.button onClick={() => setWish(w => !w)}
            whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.7 }}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(10px)' }}
          >
            <Heart size={13} className={wish ? 'fill-red-400 text-red-400' : ''} style={{ color: wish ? undefined : C.offwht }} />
          </motion.button>
          {/* Add to cart */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: hov ? '0%' : '100%' }}
            transition={{ duration: 0.3, ease: E }}
            className="absolute bottom-0 inset-x-0 z-20"
          >
            <button className="w-full py-3 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors"
              style={{ background: C.gold, color: C.black }}
            >
              <ShoppingBag size={13} /> Add to Cart
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: C.gold }}>{p.sub}</p>
          <h3 className="font-heading font-black uppercase text-sm tracking-wide mb-2" style={{ color: C.offwht }}>{p.name}</h3>
          <div className="flex items-center gap-3">
            <span className="font-bold text-base" style={{ color: C.offwht }}>₹{p.price.toLocaleString('en-IN')}</span>
            <span className="line-through text-xs opacity-40" style={{ color: C.offwht }}>₹{p.orig.toLocaleString('en-IN')}</span>
            <motion.span className="text-[10px] font-black px-1.5 py-0.5 ml-auto"
              animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ background: `${C.purple}33`, color: C.purple }}
            >-{disc}%</motion.span>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

const Products = () => {
  const track = useRef<HTMLDivElement>(null);
  const [L, setL] = useState(false);
  const [R, setR] = useState(true);
  const sync = () => {
    if (!track.current) return;
    const { scrollLeft: sl, scrollWidth: sw, clientWidth: cw } = track.current;
    setL(sl > 4); setR(sl + cw < sw - 5);
  };

  return (
    <section className="py-32" style={{ background: C.black }}>
      <div className="container mx-auto px-8 md:px-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stg}
          className="flex justify-between items-end mb-16"
        >
          <div>
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] mb-4" style={{ color: C.gold }}>
              Fresh Drops
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2 variants={maskReveal}
                className="font-heading font-black uppercase tracking-tighter"
                style={{ fontSize: 'clamp(40px, 6vw, 88px)', color: C.offwht, lineHeight: 0.9 }}
              >New Arrivals</motion.h2>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Link to="/products"
              className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mr-6 transition-colors"
              style={{ color: C.gold }}
            >View All <ArrowUpRight size={13} /></Link>
            {(['l', 'r'] as const).map(dir => (
              <motion.button key={dir}
                onClick={() => track.current?.scrollBy({ left: dir === 'l' ? -350 : 350, behavior: 'smooth' })}
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                disabled={dir === 'l' ? !L : !R}
                className="w-10 h-10 flex items-center justify-center transition-all disabled:opacity-20"
                style={{ border: `1px solid ${C.dim}`, color: C.offwht }}
              >{dir === 'l' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}</motion.button>
            ))}
          </div>
        </motion.div>

        <div ref={track} onScroll={sync}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' } as React.CSSProperties}
        >
          {PRODUCTS.map(p => <PCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
};

/* ── VIDEO 3 — Third section with brand video (different part) ──
   Sticky left, text scrolls right ──────────────────────────── */
const VideoSticky = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const ty = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={ref} className="flex flex-col md:flex-row min-h-screen" style={{ background: C.black }}>
      {/* Sticky video */}
      <div className="w-full md:w-1/2 h-[55vh] md:h-screen md:sticky md:top-0 overflow-hidden relative">
        <video autoPlay muted loop playsInline poster={HL3.d2}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, transparent 40%, rgba(8,8,8,0.7) 100%)' }}
        />
        {/* Gold scan line animation */}
        <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${C.gold}40, transparent)` }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
        />
      </div>

      {/* Scroll text */}
      <motion.div style={{ y: ty }}
        className="w-full md:w-1/2 flex flex-col justify-center p-10 md:p-24"
      >
        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-xs font-bold uppercase tracking-[0.4em] mb-10 block"
          style={{ color: C.gold }}
        >— Craftsmanship</motion.span>

        {['Engineered', 'for the', 'Bold'].map((w, i) => (
          <div key={w} className="overflow-hidden">
            <motion.div
              initial={{ y: '100%' }} whileInView={{ y: '0%' }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.9, ease: E, delay: i * 0.12 }}
              className="font-heading font-black uppercase tracking-tighter leading-none mb-1"
              style={{
                fontSize: 'clamp(44px, 7vw, 96px)',
                color: i === 1 ? 'transparent' : C.offwht,
                WebkitTextStroke: i === 1 ? `2px ${C.gold}` : undefined,
              }}
            >{w}</motion.div>
          </div>
        ))}

        <motion.p
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="text-sm leading-loose opacity-50 mt-10 mb-12 max-w-md"
          style={{ color: C.offwht }}
        >
          Every stitch deliberate. Every sole tested. We don't do average.
          Fario shoes go through 14 stages before they reach you.
        </motion.p>

        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.8 }}
        >
          <Link to="/story"
            className="inline-flex items-center gap-3 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all"
            style={{ background: C.gold, color: C.black }}
          >Read Our Story <ArrowRight size={14} /></Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ── GALLERY — 7 HL3 images, full editorial grid ──────────────── */
const Gallery = () => {
  const GRID = [
    { img: HL3.a, label: 'AeroStride Pro', cls: 'col-span-2 row-span-2' },
    { img: HL3.b, label: 'Urban Glide', cls: 'col-span-1 row-span-1' },
    { img: HL3.c, label: 'Midnight Force', cls: 'col-span-1 row-span-1' },
    { img: HL3.d2, label: 'Velocity Elite', cls: 'col-span-1 row-span-2' },
    { img: HL3.e, label: 'Stealth Commuter', cls: 'col-span-1 row-span-1' },
    { img: HL3.f, label: 'Modular Tote', cls: 'col-span-1 row-span-1' },
    { img: HL3.g, label: 'Tech Sling', cls: 'col-span-1 row-span-1' },
  ];

  return (
    <section className="py-32" style={{ background: C.black }}>
      <div className="container mx-auto px-8 md:px-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stg}
          className="text-center mb-20"
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: C.gold }}>
            Full Collection
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2 variants={maskReveal}
              className="font-heading font-black uppercase tracking-tighter"
              style={{ fontSize: 'clamp(40px, 6vw, 88px)', color: C.offwht }}
            >The Gallery</motion.h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 auto-rows-[220px]">
          {GRID.map((g, i) => (
            <motion.div key={g.label}
              className={`relative group cursor-pointer overflow-hidden ${g.cls}`}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ delay: i * 0.06, duration: 0.7, ease: E }}
            >
              <PImg src={g.img} alt={g.label} px={30} cls="absolute inset-0" />
              <motion.div
                className="absolute inset-0 flex items-end p-5"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.88), transparent)' }}
              >
                <span className="font-heading font-black uppercase text-base tracking-wide" style={{ color: C.offwht }}>{g.label}</span>
              </motion.div>
              <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `inset 0 0 0 2px ${C.gold}` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── VIDEO BANNER 4 — Final impact ──────────────────────────────── */
const VideoBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const sc = useTransform(scrollYProgress, [0, 1], [1.22, 1.0]);
  const ty = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={ref} className="relative h-[75vh] overflow-hidden flex items-center justify-center">
      <motion.div style={{ scale: sc }} className="absolute inset-0">
        <video autoPlay muted loop playsInline poster={HL3.e}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
        >
          <source src={VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0"
          style={{ background: 'rgba(8,8,8,0.6)' }}
        />
      </motion.div>

      <motion.div style={{ y: ty }} className="relative z-10 text-center px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stg}>
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.45em] mb-8" style={{ color: C.gold }}>
            Fario · Est. 2024 · New Delhi
          </motion.p>
          <h2 className="font-heading font-black uppercase tracking-tighter leading-none mb-10"
            style={{ fontSize: 'clamp(56px, 11vw, 140px)', color: C.offwht }}
          >
            <SplitText text="Born to" className="block" />
            <SplitText text="Move" delay={0.3}
              className="block"
              style={{ WebkitTextStroke: `3px ${C.gold}`, color: 'transparent' } as React.CSSProperties}
            />
          </h2>
          <motion.div variants={fadeUp} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.94 }}>
            <Link to="/products"
              className="inline-flex items-center gap-3 px-12 py-5 font-black text-sm uppercase tracking-[0.25em] transition-colors shadow-2xl"
              style={{ background: C.gold, color: C.black }}
            >Shop All <ArrowRight size={16} /></Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ── NEWSLETTER ─────────────────────────────────────────────────── */
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section className="py-40 relative overflow-hidden" style={{ background: C.black }}>
      {/* Blur orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px] pointer-events-none"
        style={{ background: `${C.purple}18` }}
      />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[100px] pointer-events-none"
        style={{ background: `${C.gold}10` }}
      />

      <div className="relative z-10 container mx-auto px-8 max-w-2xl text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stg}>
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.45em] mb-6" style={{ color: C.gold }}>
            Inner Circle
          </motion.p>
          <div className="overflow-hidden mb-8">
            <motion.h2 variants={maskReveal}
              className="font-heading font-black uppercase tracking-tighter"
              style={{ fontSize: 'clamp(44px, 8vw, 96px)', color: C.offwht, lineHeight: 0.9 }}
            >Join the<br />Movement</motion.h2>
          </div>
          <motion.p variants={fadeUp} className="text-sm opacity-40 mb-12 leading-loose" style={{ color: C.offwht }}>
            Early access. Exclusive drops. Member pricing.
          </motion.p>
          <motion.form variants={fadeUp}
            onSubmit={e => { e.preventDefault(); if (email) setDone(true); }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            {!done ? (<>
              <input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-6 py-4 text-sm outline-none transition-all"
                style={{
                  background: C.dim,
                  border: `1px solid ${C.dim}`,
                  color: C.offwht,
                }}
              />
              <motion.button type="submit"
                whileHover={{ scale: 1.06, boxShadow: `0 0 30px ${C.gold}50` }}
                whileTap={{ scale: 0.93 }}
                className="px-10 py-4 text-xs font-black uppercase tracking-[0.25em] transition-all"
                style={{ background: C.gold, color: C.black }}
              >Subscribe</motion.button>
            </>) : (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-lg font-bold" style={{ color: C.gold }}
              >✓ Welcome to Fario Inner Circle!</motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
      style={{ background: C.black, minHeight: '100vh' }}
      className="font-sans selection:bg-amber-400 selection:text-black"
    >
      {/* Gold scroll progress bar */}
      <motion.div
        style={{ scaleX: bar, transformOrigin: '0%', background: C.gold }}
        className="fixed top-0 left-0 right-0 h-[2px] z-[999]"
      />

      {/* Custom cursor dot */}
      <CursorDot />

      <Hero />
      <Ticker />
      <Stats />
      <VideoBreak />
      <Editorial />
      <Products />
      <VideoSticky />
      <Gallery />
      <VideoBanner />
      <Newsletter />
    </motion.div>
  );
}

/* ─ GOLD CURSOR DOT ─────────────────────────────────────────── */
function CursorDot() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX - 6); y.set(e.clientY - 6); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <motion.div
      style={{ x: sx, y: sy, background: C.gold }}
      className="fixed top-0 left-0 w-3 h-3 rounded-full z-[1000] pointer-events-none mix-blend-difference"
    />
  );
}
