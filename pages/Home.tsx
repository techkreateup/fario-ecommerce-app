import React from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/home/Hero';
import MarqueeBanner from '@/components/home/MarqueeBanner';
import ProductWall from '@/components/home/ProductWall';
import MediaDump from '@/components/home/MediaDump';
import VideoShowcase from '@/components/home/VideoShowcase';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-zinc-900"
    >
      {/* 1. Glitch Hero (Reusing Hero but aggressive context) */}
      <Hero />

      {/* 2. Marquee Blast */}
      <MarqueeBanner text="WARNING: HIGH VOLTAGE  •  DO NOT TOUCH  •  FARIO ARCHIVE  •  " />

      {/* 3. The Dump (Chaos Visuals) */}
      <MediaDump />

      {/* 4. Marquee Break */}
      <MarqueeBanner text="SYSTEM OVERLOAD  •  SYSTEM OVERLOAD  •  SYSTEM OVERLOAD  •  " speed={15} />

      {/* 5. Dense Product Wall */}
      <ProductWall />

      {/* 6. Video Break */}
      <VideoShowcase />

      {/* 7. Footer (Raw) */}
      <div className="border-t-4 border-yellow-400">
        <Footer />
      </div>
    </motion.div>
  );
}
