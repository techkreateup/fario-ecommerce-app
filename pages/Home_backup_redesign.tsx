import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedCollection from '../components/home/FeaturedCollection';
import InfographicSection from '../components/home/InfographicSection';
import VideoSection from '../components/home/VideoSection';
import ShoeAnatomy from '../components/home/ShoeAnatomy';

const Home = () => {
  // Cast to any to bypass missing prop errors
  const MotionDiv = (motion as any).div;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <CategoryGrid />
      <FeaturedCollection />
      <InfographicSection />
      <VideoSection />
    </MotionDiv>
  );
};

export default Home;