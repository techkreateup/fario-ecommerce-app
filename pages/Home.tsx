import React from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/home/Hero';
import EditorialGrid from '@/components/home/EditorialGrid';
import TrendingSlider from '@/components/home/TrendingSlider';
import VideoShowcase from '@/components/home/VideoShowcase';
import Newsletter from '@/components/Newsletter';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      <Hero />
      <EditorialGrid />
      <VideoShowcase />
      <TrendingSlider />
      <Newsletter />
      <Newsletter />
    </motion.div>
  );
}
