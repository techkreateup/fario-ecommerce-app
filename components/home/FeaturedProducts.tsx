// unused react removed
import { motion } from 'framer-motion';
import PremiumProductCard from './PremiumProductCard';
import { useCart } from '../../context/CartProvider';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedProducts() {
    const { products } = useCart();
    const navigate = useNavigate();

    // Filter for featured products or take the first few
    const featured = products.slice(0, 8);

    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">New Drops</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">Trending<br />Now</h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <button
                            onClick={() => navigate('/products')}
                            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-2 hover:text-yellow-600 hover:border-yellow-600 transition-all"
                        >
                            View All Collection
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {featured.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <PremiumProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
