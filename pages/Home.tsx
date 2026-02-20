import React from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import LookbookGrid from '@/components/home/LookbookGrid';
import SocialFeed from '@/components/home/SocialFeed';
import VideoShowcase from '@/components/home/VideoShowcase';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      {/* Premium Hero Section */}
      <Hero />

      {/* Trust Badges - Mochi style - Kept Compact */}
      <section className="py-8 bg-black text-white border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-yellow-500">✓</span>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-yellow-500">↺</span>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Easy Returns</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-yellow-500">🔒</span>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Secure Payment</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-yellow-500">★</span>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Premium Quality</span>
            </div>
          </div>
        </div>
      </section>

      {/* Massive Visual Content Expansion Start */}

      {/* 1. Category Grid (Visual Heavy) */}
      <CategoryGrid />

      {/* 2. Video Showcase Break */}
      <VideoShowcase />

      {/* 3. Featured Products */}
      <FeaturedProducts />

      {/* 4. Lookbook Grid (Pinterest Style) */}
      <LookbookGrid />

      {/* 5. Brand Story (Refined) */}
      <section className="py-32 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-24">
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-6 bg-yellow-400 rotate-3 rounded-none -z-10" />
                <img
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80"
                  alt="Fario Brand"
                  className="shadow-2xl w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>
            </div>
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-yellow-600 font-bold uppercase tracking-[0.3em] text-xs mb-8 block">Our Legacy</span>
                <h2 className="text-6xl md:text-8xl font-black mb-8 leading-none uppercase italic tracking-tighter">
                  Define<br />Your<br /><span className="text-yellow-500">Path</span>
                </h2>
                <p className="text-gray-600 text-xl mb-12 leading-relaxed max-w-md">
                  Born from street culture. Crafted for the ambitious. Each pair tells a story of design, engineering, and unstoppable energy.
                </p>
                <button className="bg-black text-white px-10 py-5 font-bold text-sm tracking-widest uppercase hover:bg-yellow-400 hover:text-black transition-all duration-500">
                  Read Our Story
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Social Feed (Instagram Style) */}
      <SocialFeed />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
