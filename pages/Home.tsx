
import React from 'react';
import { motion } from 'framer-motion';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
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
      {/* Hero Section - Metro Shoes style */}
      <HeroCarousel />

      {/* Trust Badges - Mochi style */}
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

      {/* Category Grid - Metro + Comet style */}
      <CategoryGrid />

      {/* Featured Products - Snitch style */}
      <FeaturedProducts />

      {/* Brand Story Segment - Comet style */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-yellow-400 rotate-3 rounded-2xl -z-10" />
                <img
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800"
                  alt="Fario Brand"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </motion.div>
            </div>
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-yellow-600 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Our Legacy</span>
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase italic tracking-tighter">Experience <br /> The Fario <br /> Difference</h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Born from the intersection of high-fashion and street culture, Fario is more than just footwear. We craft experiences that elevate your every step. Each pair is a masterpiece of design, engineering, and passion.
                </p>
                <button className="bg-black text-white px-8 py-4 font-bold text-sm tracking-widest uppercase hover:bg-yellow-400 hover:text-black transition-all duration-500 rounded-full">
                  Read Our Story
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter - Comet style */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}