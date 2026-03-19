import React from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../../constants';

const Ecosystem: React.FC = () => {
  const categories = [
    { name: 'Socks', image: ASSETS.products.socks1, color: 'bg-blue-50' },
    { name: 'Bags', image: ASSETS.products.bag1, color: 'bg-purple-50' },
    { name: 'Tags', image: ASSETS.products.tags, color: 'bg-yellow-50' },
  ];

  // Cast motion components to any to bypass prop errors
  const MotionDiv = (motion as any).div;
  const MotionImg = (motion as any).img;

  return (
    <section className="py-24 bg-fario-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-fario-dark">Complete Ecosystem</h2>
          <p className="mt-4 text-gray-600">Everything fits together perfectly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <MotionDiv
              key={cat.name}
              className={`rounded-3xl p-8 ${cat.color} relative overflow-hidden h-80 flex flex-col justify-end cursor-pointer group`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10 }}
            >
               {/* Background Shape */}
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10" />

               {/* Image */}
               <MotionImg 
                 src={cat.image} 
                 alt={cat.name}
                 className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-48 object-contain drop-shadow-xl"
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: idx }}
               />

               <div className="relative z-10 text-center">
                 <h3 className="text-2xl font-bold text-fario-dark mb-2">{cat.name}</h3>
                 <span className="text-sm font-medium text-fario-purple opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 inline-block">
                   View Collection →
                 </span>
               </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;