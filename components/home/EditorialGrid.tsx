import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80", link: "/category/men" }, // Sneakers
  { id: 2, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", link: "/category/women" }, // High Heels
  { id: 3, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", link: "/category/running" }, // Performance
  { id: 4, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80", link: "/category/boots" } // Boots
];

function TiltCard({ cat, idx }: { cat: any, idx: number }) {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: idx * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(cat.link)}
      className="relative h-[80vh] w-full cursor-pointer overflow-hidden rounded-none perspective-1000"
    >
      <motion.img
        style={{ scale: 1.1, transformStyle: "preserve-3d" }}
        src={cat.image}
        alt=""
        className="h-full w-full object-cover"
      />
      {/* Pure Visual Glint Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}

export default function EditorialGrid() {
  return (
    <section className="py-0 bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {categories.map((cat, idx) => (
          <TiltCard key={cat.id} cat={cat} idx={idx} />
        ))}
      </div>
    </section>
  );
}
