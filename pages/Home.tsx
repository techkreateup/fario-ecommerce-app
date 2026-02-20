/**
 * FARIO HOME — Light Purple Luxury Edition
 * Colors: Light Lavender bg + Fario Purple #7a51a0 + Lime #d9f99d + Milky White #FFFEF5
 * Fixes: pt-[104px] on hero so content never hides behind AnnouncementBar+Header
 * Videos: vid-blaze + vid-drive (self-hosted, committed to /public)
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, AnimatePresence,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, ShoppingBag, Heart,
  ChevronLeft, ChevronRight, Truck, ShieldCheck, RefreshCcw, Award, Zap, Star,
} from 'lucide-react';

/* ─ BASE PATH ────────────────────────────────────────────── */
const BASE = (import.meta as any).env.BASE_URL as string;

/* ─ VIDEOS (self-hosted, 100% reliable) ─────────────────── */
const V1 = `${BASE}vid-blaze.mp4`;
const V2 = `${BASE}vid-drive.mp4`;

/* ─ IMAGES ────────────────────────────────────────────────── */
const d = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;
const HL3 = {
  a: d('1tEuedCwZYRWL-aYCOXY46bXCBcnyVuU-'),
  b: d('1pc6UNVFR889igs7LbnQml_DpWpVd5AP2'),
  c: d('1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU'),
  e: d('19UKGRbcIZHffq1xs56MekmVpgF90H2kr'),
  f: d('1fm0yzmL6IQktGcvEZ34X3hF3YaVqcYoC'),
  g: d('1P2Rdo8iTmbVCLJ7bKG8SRiYdjoiEl5TZ'),
  h: d('1BB5uMVdb66bRJLUgle-vUkLaKyK1gC-i'),
};

/* ─ DESIGN TOKENS ─────────────────────────────────────────── */
// Light sections
const BG_LIGHT = '#F5F0FF';         // Very light lavender
const BG_MID = '#EDE7F6';         // Slightly deeper lavender
const BG_WHITE = '#FFFEF5';         // Milky cream white
// Dark sections (video + editorial)
const BG_DARK = '#1a0d2e';         // Deep purple-black
const BG_DARK2 = '#0f0820';         // Even deeper for contrast
// Brand
const PURPLE = '#7a51a0';          // Fario Purple
const LIME = '#d9f99d';          // Fario Lime
const MILKY = '#FFFEF5';          // Milky text on dark
const DARK_TXT = '#1a0d2e';         // Dark text on light
const PUR_BORDER = 'rgba(122,81,160,0.25)';

/* ─ EASING + VARIANTS ─────────────────────────────────────── */
const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const maskUp = {
  hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
  visible: { clipPath: 'inset(0% 0 0 0)', opacity: 1, transition: { duration: 1.1, ease: E } },
};
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: E } } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7 } } };
const stg60 = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const stg12 = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

/* ─ PRODUCTS ──────────────────────────────────────────────── */
const PRODUCTS = [
  { id: 'p1', name: 'AeroStride Pro', sub: 'Performance Shoe', price: 12999, orig: 15999, img: HL3.a, alt: HL3.c, tag: 'NEW' },
  { id: 'p2', name: 'Urban Glide', sub: 'Street Edition', price: 8499, orig: 10999, img: HL3.b, alt: HL3.e, tag: 'HOT' },
  { id: 'p3', name: 'Midnight Force', sub: 'Limited Release', price: 14499, orig: 18999, img: HL3.c, alt: HL3.a, tag: 'LTD' },
  { id: 'p4', name: 'Velocity Elite', sub: 'Pro Series', price: 11999, orig: 14999, img: HL3.e, alt: HL3.b },
  { id: 'p5', name: 'Stealth Commuter', sub: 'Urban Backpack', price: 5999, orig: 7999, img: HL3.f, alt: HL3.g },
  { id: 'p6', name: 'Modular Tote', sub: 'Carry Everything', price: 4499, orig: 5999, img: HL3.g, alt: HL3.f },
  { id: 'p7', name: 'Tech Sling', sub: 'Daily Essential', price: 2999, orig: 3999, img: HL3.h, alt: HL3.a },
];

const TICKER = ['HANDCRAFTED SINCE 2024', 'FREE SHIPPING ₹999+', 'NEW COLLECTION 2026', '30-DAY RETURNS', 'CARBON NEUTRAL', 'MEMBERS EXCLUSIVE'];

const STATS = [
  { val: 50000, suf: '+', label: 'Pairs Sold', icon: <Star size={22} /> },
  { val: 14, suf: '', label: 'Prototype Stages', icon: <Zap size={22} /> },
  { val: 99, suf: '%', label: 'Customer Love', icon: <Award size={22} /> },
  { val: 2, suf: 'yr', label: 'Warranty', icon: <ShieldCheck size={22} /> },
];

const TRUST = [
  { icon: <Truck size={28} />, title: 'Free Delivery', sub: 'On orders ₹999+' },
  { icon: <ShieldCheck size={28} />, title: '2-Year Warranty', sub: 'Genuine craftsmanship' },
  { icon: <RefreshCcw size={28} />, title: '30-Day Returns', sub: 'Hassle-free' },
  { icon: <Award size={28} />, title: 'ISO Certified', sub: 'Master artisans' },
];

/* ─ HOOKS ─────────────────────────────────────────────────── */
function useCounter(target: number, active: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let n = 0;
    const step = Math.ceil(target / 55);
    const t = setInterval(() => { n = Math.min(n + step, target); setV(n); if (n >= target) clearInterval(t); }, 20);
    return () => clearInterval(t);
  }, [active, target]);
  return v;
}

/* ─ REUSABLE COMPONENTS ───────────────────────────────────── */

/** 3D tilt on mouse move */
const Tilt = ({ children, cls = '' }: { children: React.ReactNode; cls?: string }) => {
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
      style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', perspective: 900 }}
      onMouseMove={move}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      className={cls}
    >{children}</motion.div>
  );
};

/** Scroll parallax image */
const PImg = ({ src, alt, px = 36, cls = '' }: { src: string; alt: string; px?: number; cls?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-px, px]);
  return (
    <div ref={ref} className={`overflow-hidden ${cls}`}>
      <motion.img src={src} alt={alt}
        style={{ y, scale: 1.12 }}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.18, filter: 'brightness(1.06)' }}
        whileTap={{ scale: 1.06 }}
        transition={{ duration: 0.5 }}
        onError={e => { (e.target as HTMLImageElement).src = HL3.a; }}
      />
    </div>
  );
};

/** Char-by-char text animation */
const SplitText = ({
  text, cls, delay = 0, stroke,
}: { text: string; cls?: string; delay?: number; stroke?: string }) => (
  <span className={`inline-flex flex-wrap ${cls ?? ''}`} aria-label={text}>
    {text.split('').map((ch, i) => (
      <motion.span key={i}
        initial={{ opacity: 0, y: '70%', rotateX: -45 }}
        whileInView={{ opacity: 1, y: '0%', rotateX: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: E, delay: delay + i * 0.032 }}
        style={{
          display: ch === ' ' ? 'inline' : 'inline-block',
          ...(stroke ? { WebkitTextStroke: `2px ${stroke}`, color: 'transparent' } : {}),
        }}
      >{ch === ' ' ? '\u00a0' : ch}</motion.span>
    ))}
  </span>
);

/** Animated counter stat */
const StatCard = ({ val, suf, label, icon }: { val: number; suf: string; label: string; icon: React.ReactNode }) => {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCounter(val, active);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -6, boxShadow: `0 20px 60px rgba(122,81,160,0.18)` }}
      transition={{ duration: 0.7, ease: E }}
      className="flex flex-col items-center text-center p-8 rounded-2xl gap-3"
      style={{ background: BG_WHITE, border: `1px solid ${PUR_BORDER}` }}
    >
      <motion.div className="text-purple-500"
        whileHover={{ rotate: [0, -12, 12, 0], scale: 1.2 }}
        transition={{ duration: 0.4 }}
        style={{ color: PURPLE }}
      >{icon}</motion.div>
      <span className="font-heading font-black text-4xl md:text-5xl"
        style={{ color: DARK_TXT }}
      >{count}{suf}</span>
      <span className="text-xs uppercase tracking-[0.25em] opacity-60" style={{ color: DARK_TXT }}>{label}</span>
    </motion.div>
  );
};

/** Video element */
const VidEl = ({ src, poster, cls }: { src: string; poster: string; cls?: string }) => (
  <video autoPlay muted loop playsInline poster={poster}
    className={`absolute inset-0 w-full h-full object-cover ${cls ?? ''}`}
    onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
  >
    <source src={src} type="video/mp4" />
  </video>
);

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — HERO
   • Clears header (AnnouncementBar ~40px + Header ~64px = 104px)
   • Dark video background with purple tint
   • Milky white + Lime text
═══════════════════════════════════════════════════════════════ */
const Hero = () => {
  const { scrollY } = useScroll();
  const vY = useTransform(scrollY, [0, 800], ['0%', '25%']);
  const op = useTransform(scrollY, [0, 500], [1, 0]);
  const tY = useTransform(scrollY, [0, 500], ['0%', '35%']);

  return (
    <section className="relative overflow-hidden flex flex-col justify-end"
      style={{ background: BG_DARK2, minHeight: '100vh', paddingTop: '104px' }}
    >
      {/* VIDEO */}
      <motion.div style={{ y: vY }} className="absolute inset-0 scale-110">
        <VidEl src={V1} poster={HL3.a} cls="opacity-45" />
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${BG_DARK2} 0%, rgba(26,13,46,0.70) 45%, rgba(122,81,160,0.18) 100%)` }}
        />
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(to right, rgba(26,13,46,0.80) 0%, transparent 55%)` }}
        />
      </motion.div>

      {/* Animated lime accent line */}
      <motion.div className="absolute top-0 left-0 right-0 h-1 z-20"
        style={{ background: `linear-gradient(to right, ${PURPLE}, ${LIME}, ${PURPLE})` }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
      />

      {/* Floating lime dots */}
      {[10, 22, 38, 55, 70, 85].map((left, i) => (
        <motion.div key={i}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{ left: `${left}%`, top: `${18 + (i % 4) * 14}%`, background: LIME }}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px' }}
      />

      {/* Content */}
      <motion.div style={{ y: tY, opacity: op }} className="relative z-10 px-8 md:px-20 pb-24 md:pb-36">
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.5, ease: E }}
          className="text-xs font-bold uppercase mb-10 inline-flex items-center gap-3 px-4 py-2 rounded-full"
          style={{ background: `${LIME}22`, color: LIME, border: `1px solid ${LIME}44` }}
        >✦ New Delhi · Est. 2024 · Collection 2026</motion.div>

        <h1 className="font-heading font-black uppercase tracking-tighter leading-[0.85] mb-8"
          style={{ fontSize: 'clamp(68px, 13vw, 170px)', color: MILKY }}
        >
          <div className="overflow-hidden"><SplitText text="Born" cls="block" /></div>
          <div className="overflow-hidden"><SplitText text="for" cls="block" delay={0.14} stroke={LIME} /></div>
          <div className="overflow-hidden"><SplitText text="Luxury" cls="block" delay={0.28} /></div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="text-base md:text-xl max-w-lg leading-relaxed mb-12 opacity-70"
          style={{ color: MILKY }}
        >Handcrafted in India. Premium quality. Unbeatable comfort.</motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap gap-4"
        >
          <motion.div whileHover={{ scale: 1.07, boxShadow: `0 0 40px ${LIME}55` }} whileTap={{ scale: 0.93 }}>
            <Link to="/products"
              className="inline-flex items-center gap-3 px-10 py-4 font-bold text-sm uppercase tracking-[0.2em]"
              style={{ background: LIME, color: DARK_TXT }}
            >Shop Now <ArrowRight size={16} /></Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}>
            <Link to="/story"
              className="inline-flex items-center gap-3 px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] transition"
              style={{ border: `1.5px solid ${LIME}55`, color: MILKY }}
            >Our Story</Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated scroll bar */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
      >
        <div className="w-px h-14 relative overflow-hidden" style={{ background: `${LIME}30` }}>
          <motion.div className="w-full absolute left-0"
            style={{ height: '40%', background: LIME }}
            animate={{ top: ['-40%', '140%'] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: LIME, opacity: 0.6 }}>Scroll</span>
      </motion.div>
    </section>
  );
};

/* ── TICKER ───────────────────────────────────────────────── */
const Ticker = () => (
  <div className="overflow-hidden py-4 border-y" style={{ background: PURPLE, borderColor: `${PURPLE}AA` }}>
    <motion.div
      animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}
      className="flex gap-12 whitespace-nowrap w-max"
    >
      {[...TICKER, ...TICKER].map((t, i) => (
        <span key={i} className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: LIME }}>★ {t}</span>
      ))}
    </motion.div>
  </div>
);

/* ── STATS ────────────────────────────────────────────────── */
const Stats = () => (
  <section className="py-28" style={{ background: BG_LIGHT }}>
    <div className="container mx-auto px-8 md:px-20">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stg12}
        className="text-center mb-16"
      >
        <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.4em] mb-3" style={{ color: PURPLE }}>By the numbers</motion.p>
        <div className="overflow-hidden">
          <motion.h2 variants={maskUp}
            className="font-heading font-black uppercase tracking-tighter"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: DARK_TXT }}
          >Proven Quality</motion.h2>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: E }}
          >
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── VIDEO BREAK 1 ────────────────────────────────────────── */
const VideoBreak1 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const sc = useTransform(scrollYProgress, [0, 1], [1.2, 1.0]);

  return (
    <section ref={ref} className="relative h-[65vh] overflow-hidden flex items-center justify-center"
      style={{ background: BG_DARK }}
    >
      <motion.div style={{ scale: sc }} className="absolute inset-0">
        <VidEl src={V1} poster={HL3.b} cls="opacity-55" />
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${BG_DARK} 0%, rgba(26,13,46,0.65) 40%, ${BG_DARK} 100%)` }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(122,81,160,0.15)' }} />
      </motion.div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.35em] mb-8"
          style={{ background: `${LIME}18`, color: LIME, border: `1px solid ${LIME}40` }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >★ The Fario Standard</motion.div>

        <h2 className="font-heading font-black uppercase tracking-tighter leading-none"
          style={{ fontSize: 'clamp(48px, 9vw, 120px)', color: MILKY }}
        >
          <div className="overflow-hidden"><SplitText text="Every" cls="block" /></div>
          <div className="overflow-hidden"><SplitText text="Step" cls="block" delay={0.18} stroke={LIME} /></div>
          <div className="overflow-hidden"><SplitText text="Counts" cls="block" delay={0.36} /></div>
        </h2>
      </div>
    </section>
  );
};

/* ── EDITORIAL — layered scroll ───────────────────────────── */
const Editorial = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section ref={ref} className="py-32 overflow-hidden" style={{ background: BG_MID }}>
      <div className="container mx-auto px-8 md:px-20">
        <div className="grid grid-cols-12 gap-4 md:gap-8 items-end">
          {/* Tall left image */}
          <motion.div style={{ y: y1 }} className="col-span-5 md:col-span-4 h-[68vh] relative">
            <Tilt cls="h-full">
              <PImg src={HL3.a} alt="AeroStride Pro" px={50} cls="h-full w-full rounded-2xl overflow-hidden" />
            </Tilt>
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 rounded-b-2xl"
              style={{ background: `linear-gradient(to top, ${DARK_TXT}EE, transparent)` }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            >
              <span className="text-xs uppercase tracking-widest" style={{ color: LIME }}>AeroStride Pro</span>
              <p className="font-heading font-black uppercase text-xl" style={{ color: MILKY }}>₹12,999</p>
            </motion.div>
          </motion.div>

          {/* Center text */}
          <div className="col-span-7 md:col-span-4 flex flex-col justify-end gap-6 pb-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stg12}>
              <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.4em] mb-5"
                style={{ color: PURPLE }}
              >New Collection 2026</motion.p>
              <div className="overflow-hidden mb-6">
                <motion.h2 variants={maskUp}
                  className="font-heading font-black uppercase tracking-tighter leading-tight"
                  style={{ fontSize: 'clamp(38px, 5vw, 66px)', color: DARK_TXT }}
                >The Art<br />of Motion</motion.h2>
              </div>
              <motion.p variants={fadeUp} className="text-base leading-loose opacity-70 mb-8" style={{ color: DARK_TXT }}>
                14 prototype stages. Advanced memory foam. Anti-skid grip. Freshness control. Everything in one shoe.
              </motion.p>
              <motion.div variants={fadeUp} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}>
                <Link to="/products"
                  className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] rounded-none transition"
                  style={{ background: PURPLE, color: MILKY }}
                >Explore <ArrowUpRight size={15} /></Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right stacked images */}
          <motion.div style={{ y: y2 }} className="hidden md:flex md:col-span-4 flex-col gap-4">
            <Tilt cls="h-[42vh] rounded-2xl overflow-hidden">
              <PImg src={HL3.b} alt="Urban Glide" px={32} cls="h-full w-full" />
            </Tilt>
            <Tilt cls="h-[23vh] rounded-2xl overflow-hidden">
              <PImg src={HL3.c} alt="Midnight Force" px={22} cls="h-full w-full" />
            </Tilt>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ── PRODUCT CARD ─────────────────────────────────────────── */
const PCard = ({ p, i }: { p: typeof PRODUCTS[0]; i: number }) => {
  const [hov, setHov] = useState(false);
  const [wish, setWish] = useState(false);
  const disc = Math.round((1 - p.price / p.orig) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: i * 0.07, duration: 0.6, ease: E }}
    >
      <Tilt cls="flex-shrink-0 w-[270px] md:w-[300px] snap-start">
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          className="rounded-2xl overflow-hidden"
          style={{ background: BG_WHITE, border: `1px solid ${PUR_BORDER}`, boxShadow: hov ? '0 20px 50px rgba(122,81,160,0.15)' : '0 4px 20px rgba(122,81,160,0.06)', transition: 'box-shadow 0.3s' }}
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            {p.tag && (
              <motion.span className="absolute top-3 left-3 z-20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: LIME, color: DARK_TXT }}
                animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              >{p.tag}</motion.span>
            )}
            <span className="absolute top-3 right-10 z-20 text-[9px] font-black px-2 py-0.5 rounded-full"
              style={{ background: `${PURPLE}22`, color: PURPLE }}
            >-{disc}%</span>

            <motion.img src={p.img} alt={p.name}
              animate={{ opacity: hov ? 0 : 1, scale: hov ? 1.1 : 1 }} transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = HL3.a; }}
            />
            <motion.img src={p.alt} alt={p.name}
              animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.95 }} transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = HL3.b; }}
            />
            <motion.div animate={{ opacity: hov ? 1 : 0 }} className="absolute inset-0 pointer-events-none rounded-none"
              style={{ boxShadow: `inset 0 0 0 2px ${PURPLE}` }}
            />
            <motion.button onClick={() => setWish(w => !w)}
              whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.7 }}
              className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: `${BG_WHITE}DD`, backdropFilter: 'blur(12px)' }}
            >
              <Heart size={13} className={wish ? 'fill-red-400 text-red-400' : ''} style={{ color: wish ? undefined : PURPLE }} />
            </motion.button>
            <motion.div initial={{ y: '100%' }} animate={{ y: hov ? '0%' : '100%' }}
              transition={{ duration: 0.28, ease: E }}
              className="absolute bottom-0 inset-x-0 z-20"
            >
              <button className="w-full py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                style={{ background: PURPLE, color: MILKY }}
              ><ShoppingBag size={13} /> Add to Cart</button>
            </motion.div>
          </div>
          <div className="p-5">
            <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: PURPLE }}>{p.sub}</p>
            <h3 className="font-heading font-black uppercase text-sm tracking-wide mb-2" style={{ color: DARK_TXT }}>{p.name}</h3>
            <div className="flex items-center gap-2">
              <span className="font-bold" style={{ color: DARK_TXT }}>₹{p.price.toLocaleString('en-IN')}</span>
              <span className="line-through text-xs opacity-40" style={{ color: DARK_TXT }}>₹{p.orig.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
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
    <section className="py-32" style={{ background: BG_LIGHT }}>
      <div className="container mx-auto px-8 md:px-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stg12}
          className="flex justify-between items-end mb-14"
        >
          <div>
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.35em] mb-3" style={{ color: PURPLE }}>
              Fresh Drops
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2 variants={maskUp}
                className="font-heading font-black uppercase tracking-tighter"
                style={{ fontSize: 'clamp(38px, 6vw, 80px)', color: DARK_TXT, lineHeight: 0.9 }}
              >New<br />Arrivals</motion.h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/products"
              className="hidden md:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mr-4"
              style={{ color: PURPLE }}
            >View All <ArrowUpRight size={13} /></Link>
            {(['l', 'r'] as const).map(dir => (
              <motion.button key={dir}
                onClick={() => track.current?.scrollBy({ left: dir === 'l' ? -320 : 320, behavior: 'smooth' })}
                whileHover={{ scale: 1.15, background: PURPLE, color: MILKY }}
                whileTap={{ scale: 0.85 }}
                disabled={dir === 'l' ? !L : !R}
                className="w-10 h-10 flex items-center justify-center rounded-full disabled:opacity-20 transition-all"
                style={{ border: `1.5px solid ${PUR_BORDER}`, color: PURPLE }}
              >{dir === 'l' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}</motion.button>
            ))}
          </div>
        </motion.div>

        <div ref={track} onScroll={sync}
          className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' } as React.CSSProperties}
        >
          {PRODUCTS.map((p, i) => <PCard key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
};

/* ── TRUST STRIP ─────────────────────────────────────────── */
const TrustStrip = () => (
  <div style={{ background: BG_WHITE, borderTop: `1px solid ${PUR_BORDER}`, borderBottom: `1px solid ${PUR_BORDER}` }}>
    <div className="container mx-auto px-8 md:px-20 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
      {TRUST.map((t, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          whileHover={{ y: -5, scale: 1.03 }}
          className="flex flex-col items-center text-center gap-3 cursor-default"
        >
          <motion.div style={{ color: PURPLE }}
            whileHover={{ rotate: [-10, 10, -10, 0] }} transition={{ duration: 0.4 }}
          >{t.icon}</motion.div>
          <p className="font-bold text-sm uppercase tracking-wide" style={{ color: DARK_TXT }}>{t.title}</p>
          <p className="text-xs opacity-50" style={{ color: DARK_TXT }}>{t.sub}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ── VIDEO STICKY ─────────────────────────────────────────── */
const VideoSticky = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const ty = useTransform(scrollYProgress, [0, 1], [-55, 55]);

  return (
    <section ref={ref} className="flex flex-col md:flex-row min-h-screen" style={{ background: BG_DARK }}>
      {/* Sticky vid */}
      <div className="w-full md:w-1/2 h-[55vh] md:h-screen md:sticky md:top-0 overflow-hidden relative">
        <VidEl src={V2} poster={HL3.e} cls="opacity-65" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,13,46,0.45)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, transparent 30%, rgba(26,13,46,0.85) 100%)' }}
        />
        {/* Lime scan line */}
        <motion.div className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${LIME}50, transparent)` }}
          animate={{ top: ['0%', '100%'] }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
        />
        {/* Corner accents */}
        <div className="absolute top-6 left-6 w-8 h-8 pointer-events-none"
          style={{ borderTop: `2px solid ${LIME}`, borderLeft: `2px solid ${LIME}` }}
        />
        <div className="absolute bottom-6 right-6 w-8 h-8 pointer-events-none"
          style={{ borderBottom: `2px solid ${LIME}`, borderRight: `2px solid ${LIME}` }}
        />
      </div>

      {/* Scroll text */}
      <motion.div style={{ y: ty }} className="w-full md:w-1/2 flex flex-col justify-center p-10 md:p-24">
        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-[0.4em] mb-10 block" style={{ color: LIME }}
        >— Craftsmanship</motion.span>

        {['Engineered', 'for the', 'Bold'].map((w, i) => (
          <div key={w} className="overflow-hidden">
            <motion.div
              initial={{ y: '100%' }} whileInView={{ y: '0%' }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.85, ease: E, delay: i * 0.12 }}
              className="font-heading font-black uppercase tracking-tighter leading-none mb-1"
              style={{
                fontSize: 'clamp(42px, 7vw, 92px)',
                color: i === 1 ? 'transparent' : MILKY,
                WebkitTextStroke: i === 1 ? `2px ${LIME}` : undefined,
              }}
            >{w}</motion.div>
          </div>
        ))}

        <motion.p
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}
          className="text-base leading-loose mt-10 mb-12 max-w-md" style={{ color: MILKY, opacity: 0.6 }}
        >Every stitch deliberate. Every sole tested. 14 stages before they reach you.</motion.p>

        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
          <Link to="/story"
            className="inline-flex items-center gap-3 px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] transition"
            style={{ background: LIME, color: DARK_TXT }}
          >Read Our Story <ArrowRight size={14} /></Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ── GALLERY ─────────────────────────────────────────────── */
const GALLERY = [
  { img: HL3.a, label: 'AeroStride Pro', cls: 'col-span-2 row-span-2' },
  { img: HL3.b, label: 'Urban Glide', cls: 'col-span-1 row-span-1' },
  { img: HL3.c, label: 'Midnight Force', cls: 'col-span-1 row-span-1' },
  { img: HL3.e, label: 'Velocity Elite', cls: 'col-span-1 row-span-2' },
  { img: HL3.f, label: 'Stealth Bag', cls: 'col-span-1 row-span-1' },
  { img: HL3.g, label: 'Modular Tote', cls: 'col-span-1 row-span-1' },
  { img: HL3.h, label: 'Tech Sling', cls: 'col-span-1 row-span-1' },
];

const Gallery = () => (
  <section className="py-32" style={{ background: BG_MID }}>
    <div className="container mx-auto px-8 md:px-20">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stg12}
        className="text-center mb-20"
      >
        <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: PURPLE }}>
          The Full Range
        </motion.p>
        <div className="overflow-hidden">
          <motion.h2 variants={maskUp}
            className="font-heading font-black uppercase tracking-tighter"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)', color: DARK_TXT }}
          >Our Gallery</motion.h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[200px]">
        {GALLERY.map((g, i) => (
          <motion.div key={g.label}
            className={`relative group cursor-pointer overflow-hidden rounded-xl ${g.cls}`}
            initial={{ opacity: 0, scale: 0.93 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ delay: i * 0.07, duration: 0.65, ease: E }}
          >
            <PImg src={g.img} alt={g.label} px={28} cls="absolute inset-0" />
            <motion.div
              className="absolute inset-0 flex items-end p-5 rounded-xl"
              initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }}
              style={{ background: `linear-gradient(to top, ${DARK_TXT}CC, transparent)` }}
            >
              <span className="font-heading font-black uppercase text-base" style={{ color: MILKY }}>{g.label}</span>
            </motion.div>
            <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: `inset 0 0 0 2px ${LIME}` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── VIDEO BANNER 2 ──────────────────────────────────────── */
const VideoBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const sc = useTransform(scrollYProgress, [0, 1], [1.22, 1.0]);
  const ty = useTransform(scrollYProgress, [0, 1], [-28, 28]);

  return (
    <section ref={ref} className="relative h-[72vh] overflow-hidden flex items-center justify-center"
      style={{ background: BG_DARK2 }}
    >
      <motion.div style={{ scale: sc }} className="absolute inset-0">
        <VidEl src={V2} poster={HL3.f} cls="opacity-60" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,13,46,0.70)' }} />
        <div className="absolute inset-0" style={{ background: 'rgba(122,81,160,0.20)' }} />
      </motion.div>

      <motion.div style={{ y: ty }} className="relative z-10 text-center px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stg12}>
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.35em] mb-8"
            style={{ background: `${LIME}18`, color: LIME, border: `1px solid ${LIME}40` }}
          >✦ Fario · Est. 2024 · New Delhi</motion.div>

          <h2 className="font-heading font-black uppercase tracking-tighter leading-none mb-10"
            style={{ fontSize: 'clamp(56px, 11vw, 140px)', color: MILKY }}
          >
            <div className="overflow-hidden"><SplitText text="Born to" cls="block" /></div>
            <div className="overflow-hidden"><SplitText text="Move" cls="block" delay={0.28} stroke={LIME} /></div>
          </h2>

          <motion.div variants={fadeUp} whileHover={{ scale: 1.08, boxShadow: `0 0 40px ${LIME}55` }} whileTap={{ scale: 0.94 }}>
            <Link to="/products"
              className="inline-flex items-center gap-3 px-12 py-5 font-black text-sm uppercase tracking-[0.25em]"
              style={{ background: LIME, color: DARK_TXT }}
            >Shop All <ArrowRight size={16} /></Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ── NEWSLETTER ──────────────────────────────────────────── */
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section className="py-40 relative overflow-hidden" style={{ background: PURPLE }}>
      {/* Light orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(217,249,157,0.12)' }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'rgba(255,254,245,0.08)' }} />

      <div className="relative z-10 container mx-auto px-8 max-w-2xl text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stg12}>
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.45em] mb-6" style={{ color: LIME }}>
            Inner Circle
          </motion.p>
          <div className="overflow-hidden mb-6">
            <motion.h2 variants={maskUp}
              className="font-heading font-black uppercase tracking-tighter"
              style={{ fontSize: 'clamp(42px, 7vw, 88px)', color: MILKY, lineHeight: 0.9 }}
            >Join the<br />Movement</motion.h2>
          </div>
          <motion.p variants={fadeUp} className="text-base opacity-60 mb-12 leading-loose" style={{ color: MILKY }}>
            Early access. Exclusive drops. Member pricing.
          </motion.p>
          <motion.form variants={fadeUp}
            onSubmit={e => { e.preventDefault(); if (email) setDone(true); }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            {!done ? (<>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-6 py-4 text-sm outline-none rounded-none"
                style={{ background: 'rgba(255,254,245,0.15)', border: `1px solid rgba(255,254,245,0.30)`, color: MILKY }}
              />
              <motion.button type="submit"
                whileHover={{ scale: 1.06, boxShadow: `0 0 30px ${LIME}66` }}
                whileTap={{ scale: 0.93 }}
                className="px-10 py-4 text-xs font-black uppercase tracking-[0.25em]"
                style={{ background: LIME, color: DARK_TXT }}
              >Subscribe</motion.button>
            </>) : (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-lg font-bold" style={{ color: LIME }}
              >✓ Welcome to Fario Inner Circle!</motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
function CursorDot() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  useEffect(() => {
    const m = (e: MouseEvent) => { x.set(e.clientX - 6); y.set(e.clientY - 6); };
    window.addEventListener('mousemove', m);
    return () => window.removeEventListener('mousemove', m);
  }, [x, y]);
  return (
    <motion.div style={{ x: sx, y: sy, background: LIME }}
      className="fixed top-0 left-0 w-3 h-3 rounded-full z-[1000] pointer-events-none mix-blend-difference"
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════════════════════════ */
export default function Home() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      style={{ background: BG_LIGHT, minHeight: '100vh' }}
      className="font-sans selection:bg-purple-200 selection:text-purple-900"
    >
      {/* Lime scroll progress bar */}
      <motion.div
        style={{ scaleX: bar, transformOrigin: '0%', background: LIME }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[999] shadow-[0_0_12px_rgba(217,249,157,0.6)]"
      />
      <CursorDot />

      <Hero />
      <Ticker />
      <Stats />
      <VideoBreak1 />
      <Editorial />
      <Products />
      <TrustStrip />
      <VideoSticky />
      <Gallery />
      <VideoBanner />
      <Newsletter />
    </motion.div>
  );
}
