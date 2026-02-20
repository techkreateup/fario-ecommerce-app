/*
 * FARIO LUXURY FOOTWEAR — HOMEPAGE (LIGHT EDITION)
 * ─────────────────────────────────────────────────
 * Palette: White · Cream · Stone · Purple accent
 * NO header / footer code here — global layout handles both.
 */

import React, { useRef, useState } from 'react';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// 1. VERIFIED ASSET VAULT
// ─────────────────────────────────────────────────────────────────────────────

const IMG = {
  hero: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=90',
  shoe1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  shoe2: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
  shoe3: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
  shoe4: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
  shoe5: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
  editorial: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=1200&q=80',
  shoe7: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
};

const YT = {
  hero: 'https://www.youtube.com/embed/rBmRnCp7QRY?autoplay=1&mute=1&loop=1&controls=0&playlist=rBmRnCp7QRY&showinfo=0&rel=0&modestbranding=1',
  editorial: 'https://www.youtube.com/embed/OQ9B2MnzJkY?autoplay=1&mute=1&loop=1&controls=0&playlist=OQ9B2MnzJkY&showinfo=0&rel=0',
  campaign: 'https://www.youtube.com/embed/I8dh3yoHXaQ?autoplay=1&mute=1&loop=1&controls=0&playlist=I8dh3yoHXaQ&showinfo=0&rel=0',
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. ANIMATION PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;

const v: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE as any } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } },
  },
  maskReveal: {
    hidden: { clipPath: 'inset(100% 0 0 0)' },
    visible: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.2, ease: EASE as any } },
  },
  stagger: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. DATA
// ─────────────────────────────────────────────────────────────────────────────

type Product = { id: string; name: string; price: number; category: string; badge?: string; image: string; altImage: string; };
type Testimonial = { id: string; name: string; role: string; text: string; rating: number; avatar: string; };

const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Phantom Air', price: 12_500, category: 'Sneakers', badge: 'New', image: IMG.shoe1, altImage: IMG.shoe4 },
  { id: 'p2', name: 'Chelsea Noir', price: 15_900, category: 'Boots', badge: 'Bestseller', image: IMG.shoe2, altImage: IMG.shoe1 },
  { id: 'p3', name: 'Stratos Runner', price: 8_995, category: 'Sneakers', image: IMG.shoe3, altImage: IMG.shoe2 },
  { id: 'p4', name: 'Cloud Lite', price: 6_499, category: 'Casual', image: IMG.shoe4, altImage: IMG.shoe3 },
  { id: 'p5', name: 'Stiletto Royale', price: 18_000, category: 'Heels', badge: 'Limited', image: IMG.shoe5, altImage: IMG.shoe1 },
  { id: 'p6', name: 'Velvet Loafer', price: 11_200, category: 'Formal', image: IMG.shoe7, altImage: IMG.shoe5 },
];

const MARQUEE_ITEMS = ['Free Shipping on ₹999+', 'New Collection Dropped', 'Handcrafted Luxury', 'Carbon-Neutral Packaging', 'Exclusive Members Sale'];

const TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Aisha K.', role: 'Fashion Stylist', rating: 5, avatar: IMG.shoe5, text: 'The Phantom Air changed how I approach street style. Unmatched comfort, zero compromise on aesthetics.' },
  { id: 't2', name: 'Rohan M.', role: 'Architect, Mumbai', rating: 5, avatar: IMG.shoe1, text: 'I wear Chelsea Noir to every meeting. They speak before I do — precision without pretension.' },
  { id: 't3', name: 'Sophie L.', role: 'Creative Director', rating: 4, avatar: IMG.shoe4, text: 'Fario understands wide feet without sacrificing the silhouette. Finally, a luxury brand that listens.' },
];

const FEATURES = [
  { icon: '⚡', title: 'Kinetic Technology', desc: 'Energy-return sole technology for all-day comfort.' },
  { icon: '♻️', title: 'Ethical Materials', desc: 'Sourced from certified sustainable tanneries.' },
  { icon: '🎁', title: 'Luxury Packaging', desc: 'Every pair arrives in a hand-stitched keepsake box.' },
  { icon: '🚚', title: 'Free Delivery', desc: 'Complimentary shipping on all orders above ₹999.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. ATOMS
// ─────────────────────────────────────────────────────────────────────────────

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={12} className={i <= count ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 5. HERO — keeps dark overlay only so text is readable over video
// ─────────────────────────────────────────────────────────────────────────────

const Hero = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], ['0%', '25%']);
  const textY = useTransform(scrollY, [0, 600], ['0%', '60%']);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-stone-100 flex items-end pb-28 md:pb-40">
      {/* Video layer (dark overlay stays for contrast) */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 pointer-events-none scale-110">
        <iframe
          src={YT.hero}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Hero background"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: '177.78vh', height: '100vh', minWidth: '100%', border: 'none' }}
        />
        {/* Lighter overlay compared to dark edition */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent" />
      </motion.div>

      {/* Hero text */}
      <motion.div style={{ y: textY, opacity }} className="relative z-10 w-full px-6 md:px-16">
        <motion.div initial="hidden" animate="visible" variants={v.stagger}>

          <motion.span variants={v.fadeUp}
            className="inline-block mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest"
          >
            ✦ Collection 2026 — Motion
          </motion.span>

          <div className="overflow-hidden mb-2">
            <motion.h1 variants={v.maskReveal}
              className="text-[14vw] md:text-[11vw] font-black uppercase tracking-tighter leading-[0.85] text-white"
            >WALK</motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1 variants={v.maskReveal}
              className="text-[14vw] md:text-[11vw] font-black uppercase tracking-tighter leading-[0.85] text-white/40"
              style={{ WebkitTextStroke: '2px rgba(255,255,255,0.6)' }}
            >DIFFERENT</motion.h1>
          </div>

          <motion.p variants={v.fadeUp} className="mt-6 text-white/80 text-sm md:text-base max-w-md font-light leading-relaxed">
            Handcrafted luxury footwear for the body in motion.
          </motion.p>

          <motion.div variants={v.fadeUp} className="mt-10 flex flex-wrap gap-4">
            <Link to="/shop"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              Shop Now <ArrowRight size={14} />
            </Link>
            <button className="border border-white text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300">
              View Lookbook
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white"
      >
        <span className="text-[9px] uppercase tracking-widest opacity-60">Scroll</span>
        <div className="w-px h-10 bg-white/30 overflow-hidden">
          <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="w-full h-full bg-white" />
        </div>
      </motion.div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. MARQUEE BAND — soft purple on light
// ─────────────────────────────────────────────────────────────────────────────

const MarqueeBand = () => (
  <div className="relative bg-purple-600 py-4 overflow-hidden border-y border-purple-300/30">
    <motion.div
      animate={{ x: ['0%', '-50%'] }}
      transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
      className="flex gap-16 whitespace-nowrap w-max"
    >
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-4">
          {item} <span className="text-white/40">◆</span>
        </span>
      ))}
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 7. CATEGORY GRID — light backgrounds, dark labels
// ─────────────────────────────────────────────────────────────────────────────

const CategoryGrid = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const col1y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const col2y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section ref={ref} className="py-32 bg-white">
      <div className="container mx-auto px-4 md:px-12">

        {/* Heading */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={v.stagger}
          className="mb-20 flex justify-between items-end"
        >
          <div>
            <motion.p variants={v.fadeUp} className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-3">Shop by Category</motion.p>
            <motion.h2 variants={v.fadeUp} className="text-gray-900 text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              The<br />Collection
            </motion.h2>
          </div>
          <motion.a href="#" variants={v.fadeIn}
            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-purple-600 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            View All <ArrowUpRight size={14} />
          </motion.a>
        </motion.div>

        {/* 4-cell asymmetric grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 h-[80vh]">

          {/* Tall left */}
          <motion.div style={{ y: col1y }} className="row-span-2 relative group overflow-hidden bg-gray-100 cursor-pointer">
            <img src={IMG.shoe3} alt="Sneakers" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
            <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-purple-500 transition-all duration-300" />
            <div className="absolute bottom-6 left-6">
              <span className="text-white font-black uppercase tracking-tighter text-xl drop-shadow">Sneakers</span>
              <p className="text-white/70 text-xs">48 styles</p>
            </div>
          </motion.div>

          {/* Top-right */}
          <motion.div style={{ y: col2y }} className="relative group overflow-hidden bg-gray-100 cursor-pointer">
            <img src={IMG.shoe2} alt="Boots" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
            <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-purple-500 transition-all duration-300" />
            <div className="absolute bottom-4 left-4">
              <span className="text-white font-black uppercase tracking-tight drop-shadow">Boots</span>
            </div>
          </motion.div>

          {/* Bottom-right */}
          <motion.div style={{ y: col1y }} className="relative group overflow-hidden bg-gray-100 cursor-pointer">
            <img src={IMG.shoe5} alt="Heels" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
            <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-purple-500 transition-all duration-300" />
            <div className="absolute bottom-4 left-4">
              <span className="text-white font-black uppercase tracking-tight drop-shadow">Heels</span>
            </div>
          </motion.div>

          {/* Video cell */}
          <motion.div style={{ y: col2y }} className="col-span-1 md:col-span-2 relative group overflow-hidden bg-gray-100 cursor-pointer">
            <iframe
              src={YT.campaign}
              allow="autoplay; encrypted-media"
              title="Category video"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ width: '200%', height: '200%', border: 'none' }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors" />
            <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-purple-500 transition-all duration-300" />
            <div className="absolute bottom-4 left-4">
              <span className="bg-white/90 backdrop-blur text-gray-900 border border-white/60 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full">
                Casual — 35 Styles
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. PRODUCT CAROUSEL — white cards, light gray stage
// ─────────────────────────────────────────────────────────────────────────────

const ProductCard = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="min-w-[280px] md:min-w-[320px] group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image stage */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
        {product.badge && (
          <span className="absolute top-3 left-3 z-20 bg-purple-600 text-white text-[9px] font-bold uppercase px-2 py-1 tracking-wider">
            {product.badge}
          </span>
        )}

        <img src={product.image} alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
        />
        <img src={product.altImage} alt={product.name + ' alt'}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        />

        {/* Neon ring */}
        <div className={`absolute inset-0 transition-all duration-300 ${hovered ? 'ring-2 ring-purple-500 shadow-[inset_0_0_30px_rgba(139,92,246,0.15)]' : ''}`} />

        {/* Wishlist */}
        <button onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow"
        >
          <Heart size={14} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
        </button>

        {/* Add to cart CTA */}
        <motion.div
          initial={{ y: '100%' }} animate={{ y: hovered ? '0%' : '100%' }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as any }}
          className="absolute bottom-0 inset-x-0 z-20"
        >
          <button className="w-full bg-gray-900 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
            <ShoppingBag size={14} /> Add to Cart
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <div>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">{product.category}</p>
        <h3 className="text-gray-900 font-bold uppercase text-sm tracking-wide">{product.name}</h3>
        <p className="text-gray-600 font-medium mt-1">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
};

const ProductCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
  };

  const onScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  return (
    <section className="py-32 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={v.stagger}
          className="flex justify-between items-end mb-14"
        >
          <div>
            <motion.p variants={v.fadeUp} className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-2">Just In</motion.p>
            <motion.h2 variants={v.fadeUp} className="text-gray-900 text-4xl md:text-6xl font-black uppercase tracking-tighter">New Arrivals</motion.h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} disabled={!canLeft}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
            ><ChevronLeft size={16} /></button>
            <button onClick={() => scroll('right')} disabled={!canRight}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition"
            ><ChevronRight size={16} /></button>
          </div>
        </motion.div>

        <div ref={trackRef} onScroll={onScroll}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' } as React.CSSProperties}
        >
          {PRODUCTS.map(p => (
            <div key={p.id} className="snap-start"><ProductCard product={p} /></div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. EDITORIAL — cream background, dark text
// ─────────────────────────────────────────────────────────────────────────────

const Editorial = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={ref} className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Sticky video */}
      <div className="w-full md:w-1/2 h-[60vh] md:h-screen md:sticky md:top-0 overflow-hidden relative">
        <iframe
          src={YT.editorial}
          allow="autoplay; encrypted-media"
          title="Editorial video"
          style={{ width: '177.78vh', height: '100vh', minWidth: '100%', border: 'none', position: 'relative' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
      </div>

      {/* Text side */}
      <motion.div style={{ y: textY }} className="w-full md:w-1/2 flex items-center justify-center p-10 md:p-20 bg-stone-50">
        <div className="max-w-md">
          <motion.span initial="hidden" whileInView="visible" variants={v.fadeUp} viewport={{ once: true }}
            className="text-purple-600 text-xs font-bold uppercase tracking-[0.3em] block mb-6"
          >— The Philosophy</motion.span>

          <motion.h2 initial="hidden" whileInView="visible" variants={v.fadeUp} viewport={{ once: true }}
            className="text-gray-900 text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8"
          >Art of<br />Motion</motion.h2>

          <motion.p initial="hidden" whileInView="visible" variants={v.fadeUp} viewport={{ once: true }}
            className="text-gray-500 text-base md:text-lg leading-relaxed font-light mb-6"
          >
            We design from movement outward. Each silhouette begins as a study in kinetics —
            how the human foot strikes the earth, how momentum transfers through leather and sole.
          </motion.p>

          <motion.p initial="hidden" whileInView="visible" variants={v.fadeUp} viewport={{ once: true }}
            className="text-gray-400 text-base leading-relaxed font-light mb-12"
          >
            The result is not just a shoe. It is architecture for the body. Precision without pretension.
          </motion.p>

          <motion.div initial="hidden" whileInView="visible" variants={v.fadeUp} viewport={{ once: true }}>
            <Link to="/about"
              className="inline-flex items-center gap-2 border-b border-gray-900 pb-1 text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-purple-600 hover:border-purple-600 transition-colors"
            >
              Our Story <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. FEATURES — light gray cards
// ─────────────────────────────────────────────────────────────────────────────

const Features = () => (
  <section className="py-24 bg-white border-y border-gray-100">
    <div className="container mx-auto px-6 md:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {FEATURES.map((f, i) => (
          <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={v.fadeUp}
            transition={{ delay: i * 0.1 } as any}
            className="group p-6 border border-gray-100 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-300 rounded-sm"
          >
            <span className="text-3xl mb-4 block">{f.icon}</span>
            <h3 className="text-gray-900 font-bold uppercase text-sm tracking-wide mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 11. TESTIMONIALS — light glass cards on cream
// ─────────────────────────────────────────────────────────────────────────────

const Testimonials = () => (
  <section className="py-32 bg-stone-50 relative overflow-hidden">
    {/* Faint bg image */}
    <div className="absolute inset-0 opacity-5 pointer-events-none">
      <img src={IMG.editorial} className="w-full h-full object-cover" alt="" />
    </div>

    <div className="container mx-auto px-6 md:px-12 relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={v.stagger} className="text-center mb-16">
        <motion.p variants={v.fadeUp} className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-3">Community</motion.p>
        <motion.h2 variants={v.fadeUp} className="text-gray-900 text-4xl md:text-6xl font-black uppercase tracking-tighter">What They Say</motion.h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={v.fadeUp}
            transition={{ delay: i * 0.12 } as any}
            className="p-8 rounded-sm bg-white border border-gray-100 hover:border-purple-200 hover:shadow-md hover:shadow-purple-100/50 transition-all duration-400 group"
          >
            <Stars count={t.rating} />
            <p className="text-gray-600 text-base leading-relaxed my-6">"{t.text}"</p>
            <div className="flex items-center gap-4">
              <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
              <div>
                <p className="text-gray-900 text-sm font-bold">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// 12. NEWSLETTER — soft purple gradient, light
// ─────────────────────────────────────────────────────────────────────────────

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative py-36 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-stone-50">
      {/* Faint edge image */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none">
        <img src={IMG.shoe1} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 text-center max-w-2xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={v.stagger}>
          <motion.p variants={v.fadeUp} className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-4">Inner Circle</motion.p>
          <motion.h2 variants={v.fadeUp} className="text-gray-900 text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Join the Movement
          </motion.h2>
          <motion.p variants={v.fadeUp} className="text-gray-500 mb-12">Early access. Exclusive drops. Member pricing.</motion.p>

          <motion.form variants={v.fadeUp} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            {!submitted ? (
              <>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 px-6 py-4 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-sm"
                />
                <button type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:shadow-lg hover:shadow-purple-200"
                >
                  Subscribe
                </button>
              </>
            ) : (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-gray-900 text-lg font-medium">
                ✓ You're in. Welcome to the circle.
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. PAGE ORCHESTRATION — NO Header, NO Footer
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white min-h-screen font-sans selection:bg-purple-600 selection:text-white"
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-purple-500 z-[100] shadow-[0_0_8px_rgba(139,92,246,0.6)]"
      />

      <Hero />
      <MarqueeBand />
      <CategoryGrid />
      <ProductCarousel />
      <Editorial />
      <Features />
      <Testimonials />
      <Newsletter />
    </motion.div>
  );
}
