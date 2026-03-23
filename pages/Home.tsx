import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

// Modular Components
import { HomeHero } from '../components/home/HomeHero';
import { HomeTicker } from '../components/home/HomeTicker';
import { HomeVideoBreak } from '../components/home/HomeVideoBreak';
import { HomeSubNav } from '../components/home/HomeSubNav';
import { HomeSoleMatch } from '../components/home/HomeSoleMatch';
import { HomeEditorial } from '../components/home/HomeEditorial';
import { HomeFeaturedProducts } from '../components/home/HomeFeaturedProducts';
import { HomeTrustStrip } from '../components/home/HomeTrustStrip';
import { HomeSpinWheel } from '../components/home/HomeSpinWheel';
import { HomeEarlyAccess } from '../components/home/HomeEarlyAccess';
import { HomeCinematicGrid } from '../components/home/HomeCinematicGrid';
import { HomeMonologue } from '../components/home/HomeMonologue';
import InfographicSection from '../components/home/InfographicSection';
import { HomeCategoryShowcase } from '../components/home/HomeCategoryShowcase';
import { HL3 } from '../components/home/HomeConstants';

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

      <HomeSubNav />
      <HomeTicker />
      <HomeHero />


      {/* Fresh Drops / New Arrivals Section */}
      <HomeFeaturedProducts />

      {/* Category Showcases */}
      <HomeCategoryShowcase
        title="Ethnic Lineup"
        subtitle="Heritage Meets Performance"
        bgColor="#FFF2DF"
        products={[
          { id: 'et1', name: 'Royal Jutti v1', price: 4499, img: 'https://i.pinimg.com/1200x/6d/ae/65/6dae65a3e10973731bf889f145bba4b9.jpg' },
          { id: 'et2', name: 'Maharaja Elite', price: 5999, img: 'https://i.pinimg.com/1200x/31/b9/45/31b94549b339429a6920ee6c8a75890c.jpg' },
          { id: 'et3', name: 'Classic Mojari', price: 3299, img: 'https://i.pinimg.com/1200x/0e/7b/57/0e7b5775c3a433c297f20aee34cc2106.jpg' },
          { id: 'et4', name: 'Regal Walk', price: 7499, img: 'https://i.pinimg.com/736x/2a/5c/aa/2a5caac9b22af064ef31c90699a4a214.jpg' }
        ]}
      />

      <HomeCategoryShowcase
        title="Casual Daily"
        subtitle="Everyday Essentials"
        bgColor="#E5F1FF"
        products={[
          { id: 'ca1', name: 'Urban Lite', price: 2499, img: 'https://i.pinimg.com/1200x/a1/7d/9a/a17d9a900eea4d103ca31d2a3d25483c.jpg' },
          { id: 'ca2', name: 'Street Glide', price: 3499, img: 'https://i.pinimg.com/474x/46/84/8a/46848a848742fd7ea4d70d93e2ad4d07.jpg' },
          { id: 'ca3', name: 'Campus Pro', price: 2999, img: 'https://i.pinimg.com/736x/ab/da/4a/abda4a56c887e2902b96fc7c3da4789d.jpg' },
          { id: 'ca4', name: 'Lazy Walker', price: 1999, img: 'https://i.pinimg.com/1200x/38/e5/1a/38e51aa6abc09aa3a5bbbc69f8c27393.jpg' }
        ]}
      />

      <HomeCategoryShowcase
        title="Formal Edge"
        subtitle="Executive Performance"
        bgColor="#F2F2F2"
        products={[
          { id: 'fo1', name: 'Oxen Pro', price: 8499, img: 'https://i.pinimg.com/1200x/d6/a3/8c/d6a38c3cc17309559c2bcbbd0d15de37.jpg' },
          { id: 'fo2', name: 'Derby Stealth', price: 9999, img: 'https://i.pinimg.com/736x/83/70/55/837055da43d0f35d173e140a22f01cec.jpg' },
          { id: 'fo3', name: 'Loafer Luxe', price: 7499, img: 'https://i.pinimg.com/1200x/97/21/95/972195c09a88e3ecb4c742e03c73384e.jpg' },
          { id: 'fo4', name: 'CEO Edition', price: 12999, img: 'https://i.pinimg.com/1200x/0d/e7/b3/0de7b35b4af7ff16563a216882657e52.jpg' }
        ]}
      />

      <HomeCategoryShowcase
        title="Sports Tech"
        subtitle="Peak Performance"
        bgColor="#EAFFE5"
        products={[
          { id: 'sp1', name: 'AeroPulse', price: 14999, img: 'https://i.pinimg.com/1200x/ae/f3/da/aef3dac4a6dd157a28445c3d0963a514.jpg' },
          { id: 'sp2', name: 'Nova Runner', price: 12499, img: 'https://i.pinimg.com/1200x/84/5d/68/845d6832ff4678d443f6daa6b76517d3.jpg' },
          { id: 'sp3', name: 'GripMaster X', price: 11999, img: 'https://i.pinimg.com/1200x/74/e1/26/74e126a38828fdab757a0cecdc0d4d1c.jpg' },
          { id: 'sp4', name: 'Sprint Elite', price: 15999, img: 'https://i.pinimg.com/736x/b4/63/53/b46353773b3d69095cd668613c42a54e.jpg' }
        ]}
      />

      <HomeEditorial />

      {/* Early Access / Waitlist Section */}
      <HomeEarlyAccess />
      <HomeTrustStrip />
      <HomeSpinWheel />
      <HomeCinematicGrid />

      {/* Monologue — horizontal scroll story */}
      <HomeMonologue />

      {/* AI Sole Match */}
      <HomeSoleMatch />

      {/* Engineering Lab — just above footer */}
      <InfographicSection />
    </motion.div>
  );
}
