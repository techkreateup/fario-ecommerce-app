/**
 * FARIO HOME â€” Light Purple Luxury Edition
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

/* â”€ BASE PATH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const BASE = (import.meta as any).env.BASE_URL as string;

/* â”€ VIDEOS (self-hosted, 100% reliable) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const V1 = `${BASE}vid-blaze.mp4`;
const V2 = `${BASE}vid-drive.mp4`;

/* â”€ IMAGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€ DESIGN TOKENS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€ EASING + VARIANTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const E: [number, number, number, number] = [0.16, 1, 0.3, 1];
const maskUp = {
  hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
  visible: { clipPath: 'inset(0% 0 0 0)', opacity: 1, transition: { duration: 1.1, ease: E } },
};
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: E } } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7 } } };
const stg60 = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const stg12 = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

/* â”€ PRODUCTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PRODUCTS = [
  { id: 'p1', name: 'AeroStride Pro', sub: 'Performance Shoe', price: 12999, orig: 15999, img: HL3.a, alt: HL3.c, tag: 'NEW' },
  { id: 'p2', name: 'Urban Glide', sub: 'Street Edition', price: 8499, orig: 10999, img: HL3.b, alt: HL3.e, tag: 'HOT' },
  { id: 'p3', name: 'Midnight Force', sub: 'Limited Release', price: 14499, orig: 18999, img: HL3.c, alt: HL3.a, tag: 'LTD' },
  { id: 'p4', name: 'Velocity Elite', sub: 'Pro Series', price: 11999, orig: 14999, img: HL3.e, alt: HL3.b },
  { id: 'p5', name: 'Stealth Commuter', sub: 'Urban Backpack', price: 5999, orig: 7999, img: HL3.f, alt: HL3.g },
  { id: 'p6', name: 'Modular Tote', sub: 'Carry Everything', price: 4499, orig: 5999, img: HL3.g, alt: HL3.f },
  { id: 'p7', name: 'Tech Sling', sub: 'Daily Essential', price: 2999, orig: 3999, img: HL3.h, alt: HL3.a },
];

const TICKER = ['HANDCRAFTED SINCE 2024', 'FREE SHIPPING â‚¹999+', 'NEW COLLECTION 2026', '30-DAY RETURNS', 'CARBON NEUTRAL', 'MEMBERS EXCLUSIVE'];

const STATS = [
  { val: 50000, suf: '+', label: 'Pairs Sold', icon: <Star size={22} /> },
  { val: 14, suf: '', label: 'Prototype Stages', icon: <Zap size={22} /> },
  { val: 99, suf: '%', label: 'Customer Love', icon: <Award size={22} /> },
  { val: 2, suf: 'yr', label: 'Warranty', icon: <ShieldCheck size={22} /> },
];

const TRUST = [
  { icon: <Truck size={28} />, title: 'Free Delivery', sub: 'On orders â‚¹999+' },
  { icon: <ShieldCheck size={28} />, title: '2-Year Warranty', sub: 'Genuine craftsmanship' },
  { icon: <RefreshCcw size={28} />, title: '30-Day Returns', sub: 'Hassle-free' },
  { icon: <Award size={28} />, title: 'ISO Certified', sub: 'Master artisans' },
];

/* â”€ HOOKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€ REUSABLE COMPONENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SECTION 1 â€” HERO
   â€¢ Clears header (AnnouncementBar ~40px + Header ~64px = 104px)
   â€¢ Dark video background with purple tint
   â€¢ Milky white + Lime text
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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
        >âœ¦ New Delhi Â· Est. 2024 Â· Collection 2026</motion.div>

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

/* â”€â”€ TICKER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const Ticker = () => (
  <div className="overflow-hidden py-4 border-y" style={{ background: PURPLE, borderColor: `${PURPLE}AA` }}>
    <motion.div
      animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}
      className="flex gap-12 whitespace-nowrap w-max"
    >
      {[...TICKER, ...TICKER].map((t, i) => (
        <span key={i} className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: LIME }}>â˜… {t}</span>
      ))}
    </motion.div>
  </div>
);

/* â”€â”€ STATS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€ VIDEO BREAK 1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
        >â˜… The Fario Standard</motion.div>

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

/* â”€â”€ EDITORIAL â€” layered scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
              <p className="font-heading font-black uppercase text-xl" style={{ color: MILKY }}>â‚¹12,999</p>
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

/* â”€â”€ PRODUCT CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
              <span className="font-bold" style={{ color: DARK_TXT }}>â‚¹{p.price.toLocaleString('en-IN')}</span>
              <span className="line-through text-xs opacity-40" style={{ color: DARK_TXT }}>â‚¹{p.orig.toLocaleString('en-IN')}</span>
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

/* â”€â”€ TRUST STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€ VIDEO STICKY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
        >â€” Craftsmanship</motion.span>

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

/* â”€â”€ GALLERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   â‘  LIVE SOCIAL PROOF â€” animated purchase activity feed
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const ACTIVITY = [
  { city: 'Mumbai', product: 'AeroStride Pro', time: '2 min ago', avatar: 'ðŸƒ', qty: 1 },
  { city: 'Delhi', product: 'Urban Glide', time: '5 min ago', avatar: 'ðŸ›¹', qty: 2 },
  { city: 'Bangalore', product: 'Midnight Force', time: '8 min ago', avatar: 'ðŸ’¼', qty: 1 },
  { city: 'Hyderabad', product: 'Velocity Elite', time: '12 min ago', avatar: 'âš¡', qty: 1 },
  { city: 'Chennai', product: 'Modular Tote', time: '14 min ago', avatar: 'ðŸŽ’', qty: 3 },
  { city: 'Pune', product: 'Tech Sling', time: '18 min ago', avatar: 'ðŸ“±', qty: 1 },
  { city: 'Kolkata', product: 'Stealth Commuter', time: '21 min ago', avatar: 'ðŸ™ï¸', qty: 2 },
  { city: 'Ahmedabad', product: 'AeroStride Pro', time: '25 min ago', avatar: 'ðŸ†', qty: 1 },
];

const LiveFeed = () => {
  const [visible, setVisible] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setVisible(v => (v + 1) % ACTIVITY.length);
        setShow(true);
      }, 500);
    }, 3200);
    return () => clearInterval(cycle);
  }, []);

  const a = ACTIVITY[visible];

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div key={visible}
          initial={{ x: -60, opacity: 0, scale: 0.92 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 60, opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl max-w-xs"
          style={{ background: BG_WHITE, border: `1.5px solid ${PUR_BORDER}`, boxShadow: '0 8px 32px rgba(122,81,160,0.12)' }}
        >
          <span className="text-2xl flex-shrink-0">{a.avatar}</span>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wide truncate" style={{ color: DARK_TXT }}>
              {a.qty > 1 ? `${a.qty}Ã—` : ''} {a.product}
            </p>
            <p className="text-[10px] opacity-50 truncate" style={{ color: DARK_TXT }}>{a.city} Â· {a.time}</p>
          </div>
          <motion.span className="flex-shrink-0 text-[9px] font-black uppercase px-2 py-1 rounded-full"
            style={{ background: LIME, color: DARK_TXT }}
            animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
          >LIVE</motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SocialProof = () => {
  const REVIEWS = [
    { name: 'Arjun S.', city: 'Mumbai', stars: 5, text: 'Absolute beast shoes. Wore them for a full marathon.', avatar: 'A' },
    { name: 'Priya M.', city: 'Delhi', stars: 5, text: 'The quality blew me away. Never going back to brands.', avatar: 'P' },
    { name: 'Karan T.', city: 'Bangalore', stars: 5, text: 'My 3rd Fario purchase this year. Speaks for itself.', avatar: 'K' },
    { name: 'Sneha R.', city: 'Pune', stars: 5, text: 'Perfect fit, amazing design. Got compliments everywhere.', avatar: 'S' },
    { name: 'Ravi K.', city: 'Chennai', stars: 5, text: '14 prototype stages â€” you can feel every one of them.', avatar: 'R' },
    { name: 'Anika B.', city: 'Hyderabad', stars: 5, text: 'Finally shoes that look premium AND feel premium.', avatar: 'N' },
  ];

  return (
    <section className="py-28 overflow-hidden" style={{ background: BG_LIGHT }}>
      <div className="container mx-auto px-8 md:px-20">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Left â€” live feed */}
          <motion.div className="flex-shrink-0 flex flex-col gap-6"
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.4em] mb-3" style={{ color: PURPLE }}>Happening Now</p>
              <h2 className="font-heading font-black uppercase tracking-tighter text-4xl md:text-5xl mb-2" style={{ color: DARK_TXT }}>Live Activity</h2>
              <p className="text-sm opacity-50" style={{ color: DARK_TXT }}>Real orders happening right now</p>
            </div>
            {/* Live green dot */}
            <div className="flex items-center gap-2">
              <motion.div className="w-3 h-3 rounded-full" style={{ background: LIME }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PURPLE }}>
                {147 + Math.floor(Date.now() / 60000) % 30} people shopping now
              </span>
            </div>
            <LiveFeed />
            {/* Mini bar chart â€” orders over 7 days */}
            <div className="flex items-end gap-2 h-16 mt-2">
              {[40, 65, 55, 80, 92, 87, 100].map((h, i) => (
                <motion.div key={i}
                  className="flex-1 rounded-sm"
                  style={{ background: i === 6 ? PURPLE : `${PURPLE}40` }}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: E }}
                />
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-widest opacity-40" style={{ color: DARK_TXT }}>Orders Â· Last 7 days</p>
          </motion.div>

          {/* Right â€” review cards */}
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold uppercase tracking-[0.4em] mb-8" style={{ color: PURPLE }}>What People Say</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REVIEWS.map((r, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.07, duration: 0.55, ease: E }}
                  whileHover={{ y: -6, boxShadow: `0 20px 40px rgba(122,81,160,0.14)` }}
                  className="p-6 rounded-2xl cursor-default"
                  style={{ background: BG_WHITE, border: `1px solid ${PUR_BORDER}` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm"
                      style={{ background: PURPLE, color: LIME }}
                    >{r.avatar}</div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: DARK_TXT }}>{r.name}</p>
                      <p className="text-[10px] opacity-50" style={{ color: DARK_TXT }}>{r.city}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(r.stars)].map((_, si) => (
                        <motion.span key={si} style={{ color: LIME }}
                          initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                          transition={{ delay: i * 0.07 + si * 0.05 }}
                        >â˜…</motion.span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed opacity-70 italic" style={{ color: DARK_TXT }}>"{r.text}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   â‘¡ SPIN-TO-WIN OFFER WHEEL â€” gamified discount
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const WHEEL_SLICES = [
  { label: '5% OFF', color: PURPLE, text: MILKY },
  { label: 'FREE BAG', color: LIME, text: DARK_TXT },
  { label: '10% OFF', color: '#5a3a7a', text: MILKY },
  { label: 'â‚¹200 OFF', color: '#c9f99d', text: DARK_TXT },
  { label: 'TRY AGAIN', color: '#3a2060', text: MILKY },
  { label: '15% OFF', color: '#7a51a0cc', text: MILKY },
  { label: 'FREE SHIP', color: LIME, text: DARK_TXT },
  { label: 'â‚¹500 OFF', color: PURPLE, text: MILKY },
];
const N = WHEEL_SLICES.length;
const ARC = 360 / N;

const SpinWheel = () => {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [spun, setSpun] = useState(false);

  const spin = () => {
    if (spinning || spun) return;
    const extra = 360 * 5 + Math.floor(Math.random() * 360);
    const finalAngle = angle + extra;
    setAngle(finalAngle);
    setSpinning(true);
    setResult(null);
    setTimeout(() => {
      setSpinning(false);
      setSpun(true);
      const normalised = ((finalAngle % 360) + 360) % 360;
      const idx = Math.floor(((360 - normalised + ARC / 2) % 360) / ARC) % N;
      setResult(WHEEL_SLICES[idx].label);
    }, 4200);
  };

  return (
    <section className="py-28" style={{ background: BG_DARK }}>
      <div className="container mx-auto px-8 md:px-20">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          {/* Wheel */}
          <motion.div className="flex-shrink-0 relative"
            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: E }}
          >
            {/* Pointer */}
            <div className="absolute left-1/2 -top-5 -translate-x-1/2 z-20 flex flex-col items-center">
              <div className="w-0 h-0"
                style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: `20px solid ${LIME}` }}
              />
            </div>

            <motion.svg width="280" height="280" viewBox="0 0 280 280"
              animate={{ rotate: angle }}
              transition={{ duration: 4, ease: [0.17, 0.67, 0.22, 1.0] }}
              style={{ display: 'block' }}
            >
              {WHEEL_SLICES.map((s, i) => {
                const startAngle = (i * ARC - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * ARC - 90) * (Math.PI / 180);
                const cx = 140, cy = 140, r = 130;
                const x1 = cx + r * Math.cos(startAngle);
                const y1 = cy + r * Math.sin(startAngle);
                const x2 = cx + r * Math.cos(endAngle);
                const y2 = cy + r * Math.sin(endAngle);
                const midAngle = ((i + 0.5) * ARC - 90) * (Math.PI / 180);
                const tx = cx + (r * 0.65) * Math.cos(midAngle);
                const ty = cy + (r * 0.65) * Math.sin(midAngle);
                return (
                  <g key={i}>
                    <path d={`M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2} Z`}
                      fill={s.color} stroke={BG_DARK} strokeWidth="1.5" />
                    <text x={tx} y={ty}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="9" fontWeight="900" fill={s.text}
                      transform={`rotate(${(i + 0.5) * ARC}, ${tx}, ${ty})`}
                      style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
                    >{s.label}</text>
                  </g>
                );
              })}
              {/* Center cap */}
              <circle cx="140" cy="140" r="22" fill={PURPLE} />
              <circle cx="140" cy="140" r="14" fill={LIME} />
            </motion.svg>
          </motion.div>

          {/* Text + button */}
          <motion.div className="flex-1"
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.4em] mb-4" style={{ color: LIME }}>Members Only</p>
            <h2 className="font-heading font-black uppercase tracking-tighter text-4xl md:text-6xl leading-none mb-6" style={{ color: MILKY }}>
              Spin &<br />Win Big
            </h2>
            <p className="text-base opacity-50 mb-10 max-w-sm leading-loose" style={{ color: MILKY }}>
              One spin. Real discounts. No tricks. Everyone wins something on their first order.
            </p>

            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="result"
                  initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                  className="inline-flex flex-col gap-3 p-8 rounded-2xl"
                  style={{ background: `${LIME}18`, border: `2px solid ${LIME}` }}
                >
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: LIME }}>You won!</span>
                  <span className="font-heading font-black uppercase text-4xl" style={{ color: LIME }}>{result}</span>
                  <Link to="/products"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mt-2"
                    style={{ color: MILKY }}
                  >Use it now <ArrowRight size={12} /></Link>
                </motion.div>
              ) : (
                <motion.button key="spin"
                  onClick={spin}
                  disabled={spinning || spun}
                  whileHover={!spinning && !spun ? { scale: 1.08, boxShadow: `0 0 40px ${LIME}55` } : {}}
                  whileTap={!spinning ? { scale: 0.93 } : {}}
                  className="px-14 py-5 font-black text-sm uppercase tracking-[0.25em] disabled:opacity-40 transition-all"
                  style={{ background: LIME, color: DARK_TXT }}
                >
                  {spinning ? 'ðŸŒ€ Spinning...' : 'ðŸŽ¯ Spin Now â€” Free!'}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* CINEMATIC GRID */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   â‘¡ CINEMATIC GRID â€” 3D interactive video gallery
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const CINEMATIC_ITEMS = [
  { id: 1, title: 'Extreme Grip', detail: 'Hexagonal tread for wet marble', vid: V1 },
  { id: 2, title: 'Carbon Core', detail: 'Featherlight arch plate', vid: V2 },
  { id: 3, title: 'Ghost Mesh', detail: 'Zero-sweat breathability', vid: V1 },
  { id: 4, title: 'Kinetic Foam', detail: '98% energy return', vid: V2 },
];

const CinematicCard = ({ item, i }: { item: any, i: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouse(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.8, ease: E }}
      className="relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer"
    >
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000">
        <source src={item.vid} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end translate-z-20">
        <motion.p className="text-xs font-black uppercase tracking-[0.3em] mb-2" style={{ color: LIME }}>Feature 0{i+1}</motion.p>
        <h3 className="font-heading font-black uppercase text-3xl leading-none mb-3" style={{ color: MILKY }}>{item.title}</h3>
        <p className="text-sm opacity-60 line-clamp-2 leading-relaxed" style={{ color: MILKY }}>{item.detail}</p>
      </div>

      <motion.div className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: LIME, color: DARK_TXT }}
      >
        <ArrowUpRight size={20} />
      </motion.div>
    </motion.div>
  );
};

const CinematicGrid = () => (
  <section className="py-32" style={{ background: BG_DARK2 }}>
    <div className="container mx-auto px-8 md:px-20">
      <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
        <div className="max-w-xl">
          <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="text-xs font-black uppercase tracking-[0.5em] mb-4" style={{ color: LIME }}
          >â€” Precision Engineering â€”</motion.p>
          <div className="overflow-hidden">
            <motion.h2 initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease: E }}
              className="font-heading font-black uppercase tracking-tighter leading-none"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)', color: MILKY }}
            >Cinematic<br />Showcase</motion.h2>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <p className="max-w-xs text-sm opacity-50 mb-6" style={{ color: MILKY }}>Deep exploration of the Fario performance architecture. Every frame, a breakthrough.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {CINEMATIC_ITEMS.map((item, i) => <CinematicCard key={item.id} item={item} i={i} />)}
      </div>
    </div>
  </section>
);

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PARALLAX VIDEO REEL â€” cinematic depth-scroll experience
   3 video panels Â· counter-moving text Â· scroll-driven transforms
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const PanelA = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const vidY = useTransform(scrollYProgress, [0, 1], ['-18%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['30%', '-30%']);
  const textX = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const op = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 1, 1, 1, 0]);
  const sc = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1.1, 1.0, 1.0, 1.1]);

  return (
    <div ref={ref} className="relative h-screen overflow-hidden" style={{ background: BG_DARK2 }}>
      <motion.div style={{ y: vidY, scale: sc }} className="absolute inset-0">
        <video autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
        >
          <source src={V1} type="video/mp4" />
        </video>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(15,8,32,0.73) 0%, rgba(122,81,160,0.25) 50%, rgba(15,8,32,0.66) 100%)' }}
        />
        <div className="absolute inset-x-0 top-0 h-40"
          style={{ background: 'linear-gradient(to bottom, #0f0820, transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: 'linear-gradient(to top, #0f0820, transparent)' }} />
      </motion.div>

      <motion.div style={{ y: textY, x: textX, opacity: op }}
        className="absolute inset-0 flex flex-col items-start justify-center px-10 md:px-24 z-10"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: E }}
          className="inline-flex items-center gap-3 px-4 py-2 mb-8 text-xs font-bold uppercase tracking-[0.4em]"
          style={{ background: 'rgba(217,249,157,0.09)', color: LIME, border: '1px solid rgba(217,249,157,0.27)' }}
        >â¬¡ Chapter I Â· Movement</motion.div>

        <h2 className="font-heading font-black uppercase tracking-tighter leading-none mb-6"
          style={{ fontSize: 'clamp(60px, 11vw, 150px)', color: MILKY }}
        >
          {['Built', 'for the', 'Streets'].map((w, i) => (
            <div key={w} className="overflow-hidden">
              <motion.div
                initial={{ y: '110%' }} whileInView={{ y: '0%' }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.85, ease: E, delay: i * 0.13 }}
                style={{
                  color: i === 1 ? 'transparent' : MILKY,
                  WebkitTextStroke: i === 1 ? '2px #d9f99d' : undefined,
                }}
              >{w}</motion.div>
            </div>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-sm text-base leading-loose opacity-60 mb-10" style={{ color: MILKY }}
        >Every sole engineered for urban terrain. 14 prototype stages, zero compromises.</motion.p>

        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
          <Link to="/products"
            className="inline-flex items-center gap-3 px-10 py-4 font-black text-sm uppercase tracking-[0.2em]"
            style={{ background: LIME, color: DARK_TXT }}
          >Shop Shoes <ArrowRight size={14} /></Link>
        </motion.div>
      </motion.div>

      <motion.div className="absolute right-8 top-1/2 -translate-y-1/2 w-px h-32 origin-top z-20"
        style={{ background: LIME, scaleY: scrollYProgress }}
      />
    </div>
  );
};

const PanelB = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const vidY = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['-25%', '25%']);
  const textX = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);
  const op = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 1, 1, 1, 0]);
  const sc = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.0, 1.08]);

  return (
    <div ref={ref} className="relative h-[80vh] overflow-hidden" style={{ background: BG_DARK }}>
      <motion.div style={{ y: vidY, scale: sc }} className="absolute inset-0">
        <video autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
        >
          <source src={V2} type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'rgba(122,81,160,0.30)' }} />
        <div className="absolute inset-x-0 top-0 h-32"
          style={{ background: 'linear-gradient(to bottom, #1a0d2e, transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: 'linear-gradient(to top, #1a0d2e, transparent)' }} />
      </motion.div>

      <motion.div style={{ y: textY, x: textX, opacity: op }}
        className="absolute inset-0 flex flex-col items-end justify-center px-10 md:px-24 z-10"
      >
        <motion.div
          initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: E }}
          className="inline-flex items-center gap-3 px-4 py-2 mb-8 text-xs font-bold uppercase tracking-[0.4em]"
          style={{ background: 'rgba(122,81,160,0.27)', color: MILKY, border: '1px solid rgba(122,81,160,0.53)' }}
        >â¬¡ Chapter II Â· Heritage</motion.div>

        <h2 className="font-heading font-black uppercase tracking-tighter leading-none mb-6 text-right"
          style={{ fontSize: 'clamp(52px, 9vw, 130px)', color: MILKY }}
        >
          {['Crafted', 'with', 'Pride'].map((w, i) => (
            <div key={w} className="overflow-hidden">
              <motion.div
                initial={{ y: '110%' }} whileInView={{ y: '0%' }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.85, ease: E, delay: i * 0.11 }}
                style={{ color: i === 2 ? LIME : MILKY }}
              >{w}</motion.div>
            </div>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-sm text-base leading-loose opacity-60 text-right mb-10" style={{ color: MILKY }}
        >New Delhi heritage. Global ambition. Made by hands that care.</motion.p>

        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
          <Link to="/story"
            className="inline-flex items-center gap-3 px-10 py-4 font-black text-sm uppercase tracking-[0.2em] transition"
            style={{ border: '1.5px solid rgba(255,254,245,0.27)', color: MILKY }}
          >Our Story <ArrowUpRight size={14} /></Link>
        </motion.div>
      </motion.div>

      <motion.div className="absolute left-0 right-0 h-px pointer-events-none z-20"
        style={{ background: 'linear-gradient(to right, transparent, rgba(217,249,157,0.38), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
      />
    </div>
  );
};

const PanelC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const vidY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const op = useTransform(scrollYProgress, [0, 0.15, 0.6, 0.9, 1], [0, 1, 1, 0.6, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [12, 0, 0, 8]);
  const sc = useTransform(scrollYProgress, [0, 0.4, 1], [1.15, 1.0, 1.12]);

  return (
    <div ref={ref} className="relative h-[90vh] overflow-hidden" style={{ background: BG_DARK2 }}>
      <motion.div style={{ y: vidY, scale: sc }} className="absolute inset-0">
        <video autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-55"
          onError={e => { (e.target as HTMLVideoElement).style.display = 'none'; }}
        >
          <source src={V1} type="video/mp4" />
        </video>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(15,8,32,0.80) 0%, rgba(26,13,46,0.50) 50%, rgba(15,8,32,0.93) 100%)' }}
        />
      </motion.div>

      <motion.div style={{ y: textY, opacity: op }}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center"
      >
        <motion.div style={{ filter: `blur(${blur}px)` }}>
          <motion.p
            initial={{ opacity: 0, letterSpacing: '1.5em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: E }}
            className="text-xs font-bold uppercase mb-10" style={{ color: LIME }}
          >â¬¡ Chapter III Â· Future</motion.p>

          <h2 className="font-heading font-black uppercase tracking-tighter leading-none mb-10"
            style={{ fontSize: 'clamp(56px, 12vw, 160px)', color: MILKY }}
          >
            {['Next', 'Level', 'Gear'].map((w, i) => (
              <div key={w} className="overflow-hidden">
                <motion.div
                  initial={{ y: '110%', skewX: -8 }} whileInView={{ y: '0%', skewX: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 1.0, ease: E, delay: i * 0.15 }}
                  style={{
                    display: 'block',
                    color: i === 1 ? 'transparent' : MILKY,
                    WebkitTextStroke: i === 1 ? '3px #d9f99d' : undefined,
                  }}
                >{w}</motion.div>
              </div>
            ))}
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.9 }}
            className="flex justify-center gap-6"
          >
            <motion.div whileHover={{ scale: 1.1, boxShadow: '0 0 50px rgba(217,249,157,0.33)' }} whileTap={{ scale: 0.9 }}>
              <Link to="/products"
                className="inline-flex items-center gap-3 px-14 py-5 font-black text-sm uppercase tracking-[0.25em]"
                style={{ background: LIME, color: DARK_TXT }}
              >Explore All <ArrowRight size={15} /></Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            className="rounded-full"
            style={{ background: i === 2 ? LIME : 'rgba(217,249,157,0.25)' }}
            animate={{ width: i === 2 ? 12 : 6, height: i === 2 ? 12 : 6 }}
            initial={{ width: 6, height: 6, opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
};

const ChapterDivider = ({ n, label }: { n: string; label: string }) => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
    viewport={{ once: true }} transition={{ duration: 0.7, ease: E }}
    className="flex items-center gap-6 px-10 md:px-24 py-6 origin-left"
    style={{ background: PURPLE, borderTop: '1px solid rgba(217,249,157,0.13)', borderBottom: '1px solid rgba(217,249,157,0.13)' }}
  >
    <span className="font-heading font-black text-5xl opacity-20" style={{ color: LIME }}>{n}</span>
    <div className="w-px h-8 opacity-30" style={{ background: LIME }} />
    <div className="flex-1 overflow-hidden">
      <motion.p
        initial={{ x: '-100%' }} whileInView={{ x: '0%' }}
        viewport={{ once: true }} transition={{ duration: 0.9, ease: E, delay: 0.2 }}
        className="text-xs font-black uppercase tracking-[0.45em]" style={{ color: LIME }}
      >â˜… {label} â˜…</motion.p>
    </div>
    <motion.div
      animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.0 }}
    >
      <ArrowRight size={18} style={{ color: LIME, opacity: 0.7 }} />
    </motion.div>
  </motion.div>
);

const ParallaxVideoReel = () => (
  <section style={{ background: BG_DARK2 }}>
    <motion.div
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 1 }}
      className="py-16 text-center"
    >
      <motion.p
        initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="text-xs font-bold uppercase tracking-[0.5em] mb-4" style={{ color: LIME }}
      >â€” Fario Film Reel â€”</motion.p>
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: '100%' }} whileInView={{ y: '0%' }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: E }}
          className="font-heading font-black uppercase tracking-tighter"
          style={{ fontSize: 'clamp(44px, 8vw, 110px)', color: MILKY, lineHeight: 0.9 }}
        >The Fario<br /><span style={{ color: LIME }}>Universe</span></motion.h2>
      </div>
    </motion.div>

    <PanelA />
    <ChapterDivider n="01" label="Movement is Everything Â· AeroStride Pro Â· New Delhi 2026" />
    <PanelB />
    <ChapterDivider n="02" label="Heritage Â· Craftsmanship Â· 14 Prototype Stages" />
    <PanelC />
  </section>
);

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

export default function Home() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      style={{ background: BG_LIGHT, minHeight: '100vh' }}
      className="font-sans selection:bg-purple-200 selection:text-purple-900"
    >
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
      <SocialProof />
      <CinematicGrid />
      <ParallaxVideoReel />
    </motion.div>
  );
}
