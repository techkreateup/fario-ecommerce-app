import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// Pro Components (The "1500 Lines" Suite)
import Hero from '@/components/home/pro/Hero';
import Marquee from '@/components/home/pro/Marquee';
import EditorialGrid from '@/components/home/pro/EditorialGrid';
import ProTrending from '@/components/home/pro/ProTrending';
import ProLookbook from '@/components/home/pro/ProLookbook';
import ProFeatures from '@/components/home/pro/ProFeatures';
import ProNewsletter from '@/components/home/pro/ProNewsletter';

export default function Home() {
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
      <ProTrending />
      <ProLookbook />
      <ProFeatures />
      <ProNewsletter />
    </motion.div>
  );
}
