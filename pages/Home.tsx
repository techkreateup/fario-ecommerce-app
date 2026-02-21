import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';

// Modular Components
import { HomeHero } from '../components/home/HomeHero';
import { HomeTicker } from '../components/home/HomeTicker';
import { HomeStats } from '../components/home/HomeStats';
import { HomeVideoBreak } from '../components/home/HomeVideoBreak';
import { HomeEditorial } from '../components/home/HomeEditorial';
import { HomeFeaturedProducts } from '../components/home/HomeFeaturedProducts';
import { HomeTrustStrip } from '../components/home/HomeTrustStrip';
import { HomeVideoSticky } from '../components/home/HomeVideoSticky';
import { HomeGallery } from '../components/home/HomeGallery';
import { HomeSocialProof } from '../components/home/HomeSocialProof';
import { HomeCinematicGrid } from '../components/home/HomeCinematicGrid';
import { HomeParallaxVideoReel } from '../components/home/HomeParallaxVideoReel';
import InfographicSection from '../components/home/InfographicSection';

// Shared Utilities & Constants
import { BG_LIGHT, LIME, E } from '../components/home/HomeConstants';

/* ─ CURSOR ─────────────────────────────────────────── */
const CursorDot = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <motion.div
      animate={{ x: pos.x - 12, y: pos.y - 12 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28, mass: 0.5 }}
      className="fixed top-0 left-0 w-6 h-6 rounded-full mix-blend-difference pointer-events-none z-[9999] hidden md:block"
      style={{ background: LIME, border: '1px solid rgba(217,249,157,0.5)', boxShadow: `0 0 20px ${LIME}66` }}
    />
  );
};

export default function Home() {
  const { scrollYProgress: bar } = useScroll();

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

      <HomeHero />
      <HomeTicker />
      <HomeStats />

      {/* Engineering Lab Section Integration */}
      <InfographicSection />

      <HomeVideoBreak />
      <HomeEditorial />
      <HomeFeaturedProducts />
      <HomeTrustStrip />
      <HomeVideoSticky />
      <HomeGallery />

      <div className="h-20" /> {/* Spacer for better structure */}
      <HomeSocialProof />

      <div className="h-20" /> {/* Spacer for better structure */}
      <HomeCinematicGrid />

      <HomeParallaxVideoReel />
    </motion.div>
  );
}
