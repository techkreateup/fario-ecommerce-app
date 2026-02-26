import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: "Men's Collection",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
    link: "/category/men"
  },
  {
    id: 2,
    name: "Women's Collection",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    link: "/category/women"
  },
  {
    id: 3,
    name: "Kids' Collection",
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80",
    link: "/category/kids"
  }
];

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-black text-center mb-16 uppercase tracking-tighter"
        >
          Curated For You
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              onClick={() => navigate(category.link)}
              className="group relative h-[500px] cursor-pointer overflow-hidden rounded-2xl"
            >
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                  {category.name}
                </h3>
                <div className="h-1 w-0 bg-yellow-400 transition-all duration-500 group-hover:w-full" />
                <p className="mt-4 text-sm font-medium text-gray-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Explore Collection →
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
