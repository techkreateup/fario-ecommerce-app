import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// Pro Components
import Hero from '@/components/home/pro/Hero';
import EditorialGrid from '@/components/home/pro/EditorialGrid';
import Marquee from '@/components/home/pro/Marquee';
import TrendingSlider from '@/components/home/TrendingSlider';
import Newsletter from '@/components/Newsletter';

export default function Home() {
  // Smooth scroll setup could go here
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      <Hero />
      <Marquee />
      <EditorialGrid />
      <TrendingSlider />
      <Newsletter />
    </motion.div>
  );
}
