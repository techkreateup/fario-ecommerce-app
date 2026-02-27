import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

// Modular Components
import { HomeHero } from '../components/home/HomeHero';
import { HomeTicker } from '../components/home/HomeTicker';
import { HomeVideoBreak } from '../components/home/HomeVideoBreak';
import { HomeSoleMatch } from '../components/home/HomeSoleMatch';
import { HomeEditorial } from '../components/home/HomeEditorial';
import { HomeFeaturedProducts } from '../components/home/HomeFeaturedProducts';
import { HomeTrustStrip } from '../components/home/HomeTrustStrip';
import { HomeSpinWheel } from '../components/home/HomeSpinWheel';
import { HomeGallery } from '../components/home/HomeGallery';
import { HomeEarlyAccess } from '../components/home/HomeEarlyAccess';
import { HomeCinematicGrid } from '../components/home/HomeCinematicGrid';
import { HomeMonologue } from '../components/home/HomeMonologue';
import InfographicSection from '../components/home/InfographicSection';

// Shared Utilities & Constants
import { BG_LIGHT, LIME } from '../components/home/HomeConstants';

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


      {/* Early Access / Waitlist Section */}
      <HomeEarlyAccess />

      {/* AI Sole Match */}
      <HomeSoleMatch />

      <HomeVideoBreak />
      <HomeEditorial />
      <HomeFeaturedProducts />
      <HomeTrustStrip />
      <HomeSpinWheel />
      <HomeGallery />

      <div className="hidden md:block h-20" />
      <HomeCinematicGrid />

      {/* Monologue — horizontal scroll story */}
      <HomeMonologue />

      {/* Engineering Lab — just above footer */}
      <InfographicSection />

    </motion.div>
  );
}
