import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HomeTicker } from './HomeTicker';

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE-FIRST RESPONSIVE HERO
// Desktop (md+): Strict 70/30 CoT split — text left, product right
// Mobile (<md):  Full-bleed image + clean bottom text card — ZERO overlapping
// No absolute overlays fighting each other on mobile.
// ─────────────────────────────────────────────────────────────────────────────

const SPRING = { type: 'spring' as const, stiffness: 200, damping: 28, mass: 0.8 };
const FAST   = { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.6 };

const SLIDES = [
  {
    id: '1',
    eyebrow: 'MENS COLLECTION · 2026',
    heading: 'STEP INTO',
    display: 'NEXT LEVEL STYLE',
    sub: 'Hyper-engineered for zero-compromise comfort, speed, and bold street presence.',
    link: '/products?category=Sneakers',
    btnText: 'SHOP SNEAKERS',
    image: '/fario-ecommerce-app/assets/hero/slide1_elite_sneaker.png',
    fallbackImage: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=100&w=2400&auto=format&fit=crop',
    // Desktop text panel
    textBg: 'bg-[#f9f7f5]',
    textColor: 'text-[#0a0a0a]',
    subColor: 'text-neutral-500',
    accentLine: 'bg-neutral-300',
    btnBg: 'bg-[#0a0a0a]',
    btnFg: 'text-white',
    // Mobile card
    mobileCardBg: 'bg-[#f9f7f5]',
    mobileTextColor: 'text-[#0a0a0a]',
    mobileSubColor: 'text-neutral-500',
    mobileBtnBg: 'bg-[#0a0a0a] text-white',
    imgPosition: 'object-center',
  },
  {
    id: '2',
    eyebrow: "WOMEN'S LUXURY · VOGUE EDIT",
    heading: 'ELEVATE',
    display: 'YOUR LOOK',
    sub: 'Rose-gold stilettos with diamond-encrusted details — luxury crafted for commanding presence.',
    link: '/products?category=Heels',
    btnText: 'SHOP HEELS',
    image: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=100&w=2400&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=100&w=2400&auto=format&fit=crop',
    textBg: 'bg-[#f5efe8]',
    textColor: 'text-[#1a0f08]',
    subColor: 'text-[#8a6e5a]',
    accentLine: 'bg-[#c8a882]',
    btnBg: 'bg-[#1a0f08]',
    btnFg: 'text-[#f5efe8]',
    mobileCardBg: 'bg-[#f5efe8]',
    mobileTextColor: 'text-[#1a0f08]',
    mobileSubColor: 'text-[#8a6e5a]',
    mobileBtnBg: 'bg-[#1a0f08] text-[#f5efe8]',
    imgPosition: 'object-top',
  },
  {
    id: '3',
    eyebrow: 'PERFORMANCE · TRACK & FIELD',
    heading: 'RUN',
    display: 'THE FUTURE',
    sub: 'Carbon-fibre chassis. Neon-cyan propulsion. Engineered to leave everything behind.',
    link: '/products?category=Sports',
    btnText: 'GEAR UP',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=100&w=2400&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=100&w=2400&auto=format&fit=crop',
    textBg: 'bg-[#080c10]',
    textColor: 'text-white',
    subColor: 'text-[#7dd3fc]',
    accentLine: 'bg-[#22d3ee]',
    btnBg: 'bg-[#22d3ee]',
    btnFg: 'text-[#080c10]',
    mobileCardBg: 'bg-[#080c10]',
    mobileTextColor: 'text-white',
    mobileSubColor: 'text-[#7dd3fc]',
    mobileBtnBg: 'bg-[#22d3ee] text-[#080c10]',
    imgPosition: 'object-center',
  },
  {
    id: '4',
    eyebrow: 'CASUAL LIFESTYLE · PREMIUM',
    heading: 'EVERYDAY',
    display: 'COMFORT',
    sub: 'Scandinavian craftsmanship on a stone pedestal. Supple suede. Afternoon light. Absolute calm.',
    link: '/products?category=Casual',
    btnText: 'SHOP LIFESTYLE',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=100&w=2400&auto=format&fit=crop',
    fallbackImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=100&w=2400&auto=format&fit=crop',
    textBg: 'bg-[#f0eeeb]',
    textColor: 'text-[#1c1814]',
    subColor: 'text-[#6b5e52]',
    accentLine: 'bg-[#b8a898]',
    btnBg: 'bg-[#1c1814]',
    btnFg: 'text-[#f0eeeb]',
    mobileCardBg: 'bg-[#f0eeeb]',
    mobileTextColor: 'text-[#1c1814]',
    mobileSubColor: 'text-[#6b5e52]',
    mobileBtnBg: 'bg-[#1c1814] text-[#f0eeeb]',
    imgPosition: 'object-center',
  },
];

// Dot indicators — shared between mobile and desktop
const DotNav = ({
  count, active, onSelect, accentLine, subColor,
}: {
  count: number; active: number; onSelect: (i: number) => void;
  accentLine: string; subColor: string;
}) => (
  <div className={`flex items-center gap-3 ${subColor}`}>
    <span className="font-mono text-[10px] font-bold tracking-widest">0{active + 1}</span>
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`h-[2px] rounded-full transition-all duration-500 ${accentLine}`}
          style={{ width: i === active ? 36 : 14, opacity: i === active ? 1 : 0.35 }}
          aria-label={`Slide ${i + 1}`}
        />
      ))}
    </div>
    <span className="font-mono text-[10px] font-bold tracking-widest opacity-40">0{count}</span>
  </div>
);

export const HomeHero = () => {
  const [idx, setIdx] = useState(0);
  const s = SLIDES[idx];

  const next = () => setIdx((i) => (i + 1) % SLIDES.length);
  const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative w-full overflow-hidden bg-black">

      {/* ════════════════════════════════════════════════
          DESKTOP LAYOUT (md and above)
          Strict 70/30 CoT split, no mobile code mixed in.
          Height: 88vh capped at 860px.
      ════════════════════════════════════════════════ */}
      <div className="hidden md:block relative h-[88vh] max-h-[860px] min-h-[540px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`desk-${s.id}`}
            className="absolute inset-0 flex cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.x < -60 || velocity.x < -600) next();
              else if (offset.x > 60 || velocity.x > 600) prev();
            }}
          >
            {/* LEFT — Text panel 70% */}
            <motion.div
              className={`relative z-20 flex flex-col justify-center w-[70%] h-full px-16 lg:px-24 ${s.textBg}`}
              initial={{ x: '-6%', opacity: 0 }}
              animate={{ x: '0%', opacity: 1 }}
              exit={{ x: '-3%', opacity: 0 }}
              transition={SPRING}
            >
              <motion.p
                key={`eye-${s.id}`}
                className={`text-[10px] font-bold tracking-[0.35em] uppercase mb-5 ${s.subColor}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...FAST, delay: 0.08 }}
              >
                {s.eyebrow}
              </motion.p>

              <motion.h1
                key={`h1-${s.id}`}
                className={`uppercase leading-[0.88] ${s.textColor}`}
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...FAST, delay: 0.13 }}
              >
                <span className="block font-semibold text-[clamp(30px,4vw,62px)] tracking-tight">
                  {s.heading}
                </span>
                <span className="block font-black text-[clamp(36px,6vw,88px)] tracking-tighter -mt-1">
                  {s.display}
                </span>
              </motion.h1>

              <motion.div
                key={`rule-${s.id}`}
                className={`h-[2px] w-12 my-6 ${s.accentLine}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                style={{ transformOrigin: 'left' }}
                transition={{ ...FAST, delay: 0.20 }}
              />

              <motion.p
                key={`sub-${s.id}`}
                className={`text-sm lg:text-base font-normal tracking-wide leading-relaxed max-w-md ${s.subColor}`}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...FAST, delay: 0.26 }}
              >
                {s.sub}
              </motion.p>

              <motion.div
                key={`btn-${s.id}`}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...FAST, delay: 0.33 }}
                className="mt-10"
              >
                <Link
                  to={s.link}
                  className={`inline-flex items-center gap-3 px-9 py-4 text-xs font-black tracking-[0.22em] uppercase transition-opacity hover:opacity-80 active:scale-95 shadow-lg ${s.btnBg} ${s.btnFg}`}
                >
                  {s.btnText} <span className="text-base leading-none">→</span>
                </Link>
              </motion.div>

              {/* Dot nav — desktop */}
              <div className="absolute bottom-10 left-16 lg:left-24">
                <DotNav
                  count={SLIDES.length}
                  active={idx}
                  onSelect={setIdx}
                  accentLine={s.accentLine}
                  subColor={s.subColor}
                />
              </div>
            </motion.div>

            {/* RIGHT — Image panel 30% */}
            <motion.div
              className="relative z-10 w-[30%] h-full overflow-hidden"
              initial={{ scale: 1.06, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.03, opacity: 0 }}
              transition={{ ...SPRING, duration: 1.0 }}
            >
              <img
                src={s.image}
                alt={s.display}
                className={`w-full h-full object-cover ${s.imgPosition} will-change-transform`}
                loading="eager"
                decoding="async"
                onError={(e) => { (e.target as HTMLImageElement).src = s.fallbackImage; }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ════════════════════════════════════════════════
          MOBILE LAYOUT (below md) — COMPLETELY SEPARATE
          Top: Full-bleed square image (no text on top)
          Bottom: Clean solid colour card with text + CTA
          No overlapping. No absolute layering. Pure flex column.
      ════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col">
        {/* Image block — swipeable */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`mob-img-${s.id}`}
            className="relative w-full cursor-grab active:cursor-grabbing"
            style={{ height: '58vw', maxHeight: 320, minHeight: 220 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.x < -50 || velocity.x < -500) next();
              else if (offset.x > 50 || velocity.x > 500) prev();
            }}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={SPRING}
          >
            <img
              src={s.image}
              alt={s.display}
              className={`w-full h-full object-cover ${s.imgPosition} will-change-transform`}
              loading="eager"
              decoding="async"
              onError={(e) => { (e.target as HTMLImageElement).src = s.fallbackImage; }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Text card — solid background, no overlap */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`mob-text-${s.id}`}
            className={`w-full px-5 pt-6 pb-5 flex flex-col ${s.mobileCardBg}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ ...FAST, delay: 0.05 }}
          >
            <p className={`text-[9px] font-bold tracking-[0.32em] uppercase mb-3 ${s.mobileSubColor}`}>
              {s.eyebrow}
            </p>

            <h2 className={`uppercase leading-[0.88] mb-3 ${s.mobileTextColor}`}>
              <span className="block font-semibold text-[26px] tracking-tight">{s.heading}</span>
              <span className="block font-black text-[32px] tracking-tighter -mt-0.5">{s.display}</span>
            </h2>

            <div className={`h-[2px] w-10 mb-4 ${s.accentLine}`} />

            <p className={`text-[13px] leading-relaxed mb-5 ${s.mobileSubColor}`}>
              {s.sub}
            </p>

            <div className="flex items-center justify-between">
              <Link
                to={s.link}
                className={`inline-flex items-center gap-2 px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase shadow-md active:scale-95 transition-transform ${s.mobileBtnBg}`}
              >
                {s.btnText} →
              </Link>

              {/* Dot nav — mobile */}
              <DotNav
                count={SLIDES.length}
                active={idx}
                onSelect={setIdx}
                accentLine={s.accentLine}
                subColor={s.mobileSubColor}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Ticker — sits below both layouts */}
      <div className="relative z-[100]">
        <HomeTicker isFooter={true} />
      </div>
    </section>
  );
};
