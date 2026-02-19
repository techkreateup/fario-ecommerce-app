
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const categories = [
  {
    id: 'men',
    name: "Men's Shoes",
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600',
    count: '150+ Products',
    link: '/products?gender=Men'
  },
  {
    id: 'women',
    name: "Women's Shoes",
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600',
    count: '200+ Products',
    link: '/products?gender=Women'
  },
  {
    id: 'school',
    name: 'School Shoes',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600',
    count: '80+ Products',
    link: '/products?category=School'
  }
]

export default function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our curated collections designed for every step of your journey.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[3/4]"
            >
              <Link to={category.link} className="block w-full h-full">
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/80 mb-4">{category.count}</p>

                  <div className="overflow-hidden">
                    <span className="inline-flex items-center gap-2 font-semibold text-sm translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                      View Collection <span className="text-xl">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
