import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useProScroll } from '../../../hooks/useProScroll';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';

// --- Data Types ---
interface ProductVariant {
    color: string;
    image: string;
    hex: string;
}

interface Product {
    id: number;
    name: string;
    price: string;
    category: string;
    variants: ProductVariant[];
    isNew?: boolean;
    description: string;
}

// --- Mock Data (Pro Quality) ---
const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Phantom Elite X",
        price: "Rs. 18,995",
        category: "Performance Running",
        description: "Engineered for zero gravity feel. The Phantom Elite uses our proprietary nitrogen-infused foam for maximum energy return.",
        isNew: true,
        variants: [
            { color: "Midnight", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", hex: "#1a1a1a" },
            { color: "Crimson", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", hex: "#ef4444" }, // Recycled asset for demo
            { color: "Cloud", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80", hex: "#f3f4f6" }
        ]
    },
    {
        id: 2,
        name: "Vanguard Loafer",
        price: "Rs. 12,499",
        category: "Modern Formal",
        description: "Italian leather meets modern ergonomics. The definitive driving shoe for the contemporary executive.",
        variants: [
            { color: "Espresso", image: "https://images.unsplash.com/photo-1533867617858-e7b97e0605df?w=600&q=80", hex: "#4b2c20" },
            { color: "Noir", image: "https://images.unsplash.com/photo-1614252369475-531eda835cf7?w=600&q=80", hex: "#000000" }
        ]
    },
    {
        id: 3,
        name: "Apex Boot 9000",
        price: "Rs. 24,999",
        category: "Urban Utility",
        description: "Waterproof, shock-proof, city-proof. The Apex Boot redesigns the silhouette of utilitarian footwear.",
        variants: [
            { color: "Sand", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80", hex: "#d6d3d1" },
            { color: "Olive", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80", hex: "#57534e" }
        ]
    },
    {
        id: 4,
        name: "Velocity Runner",
        price: "Rs. 9,999",
        category: "Training",
        description: "Lightweight mesh upper with responsive cushioning for your daily 5k or marathon training.",
        variants: [
            { color: "Volt", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80", hex: "#facc15" }
        ]
    }
];

// --- Sub-Component: Product Card (Complex) ---
const ProCard = ({ product }: { product: Product }) => {
    const [activeVariant, setActiveVariant] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const currentVariant = product.variants[activeVariant];

    return (
        <motion.div
            className="min-w-[350px] md:min-w-[400px] h-[600px] bg-gray-50 relative group overflow-hidden border border-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Badge */}
            {product.isNew && (
                <div className="absolute top-6 left-6 z-20 bg-black text-white text-[10px] px-3 py-1 uppercase tracking-widest font-bold">
                    New Arrival
                </div>
            )}

            {/* Action Buttons (Reveal on Hover) */}
            <div className={`absolute top-6 right-6 z-20 flex flex-col gap-3 transition-transform duration-500 ${isHovered ? 'translate-x-0' : 'translate-x-20'}`}>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-colors">
                    <Heart size={18} />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-colors">
                    <ShoppingBag size={18} />
                </button>
            </div>

            {/* Image Area */}
            <div className="w-full h-[70%] relative overflow-hidden bg-gray-200">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentVariant.color}
                        src={currentVariant.image}
                        initial={{ scale: 1.1, opacity: 0, x: 20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0.9, opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-cover mix-blend-multiply"
                    />
                </AnimatePresence>

                {/* Quick View Button (Bottom Center) */}
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button className="bg-white/90 backdrop-blur text-black text-xs uppercase font-bold px-6 py-3 tracking-widest hover:bg-black hover:text-white transition-colors">
                        Quick View
                    </button>
                </div>
            </div>

            {/* Info Area */}
            <div className="h-[30%] p-8 flex flex-col justify-between bg-white relative z-10">
                <div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">{product.category}</div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold uppercase tracking-tight">{product.name}</h3>
                        <span className="text-lg font-medium">{product.price}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    {/* Swatches */}
                    <div className="flex gap-2">
                        {product.variants.map((v, i) => (
                            <button
                                key={v.color}
                                onClick={() => setActiveVariant(i)}
                                className={`w-6 h-6 rounded-full border border-gray-200 relative ${activeVariant === i ? 'ring-1 ring-offset-2 ring-black' : ''}`}
                                style={{ backgroundColor: v.hex }}
                                aria-label={`Select ${v.color}`}
                            />
                        ))}
                    </div>

                    <div className="text-xs font-bold uppercase cursor-pointer hover:underline flex items-center gap-1 group/link">
                        Shop Now <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Component ---
export default function ProTrending() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { velocity, scrollX } = useProScroll(); // Using our custom hook for velocity skew
    const x = useMotionValue(0);

    // Physics-based Skew: Skews the Carousel based on drag velocity
    useTransform(x, () => {
        // Simple approximation since we don't have direct velocity of x here conveniently without more complex setup
        // For now, static or simple interaction
        return velocity.get() * 0.05 + scrollX.get() * 0.001;
    });

    return (
        <section className="py-32 bg-white overflow-hidden border-t border-gray-100">
            <div className="container mx-auto px-4 mb-16 flex items-end justify-between">
                <div>
                    <h2 className="text-[4vw] leading-none font-bold uppercase tracking-tighter mb-4">
                        Trending <span className="text-gray-300">Now</span>
                    </h2>
                    <p className="max-w-md text-gray-500 text-sm tracking-wide leading-relaxed">
                        Our most coveted silhouettes, engineered for performance and designed for the avant-garde.
                        Experience the fusion of technology and luxury.
                    </p>
                </div>

                {/* Custom Navigation */}
                <div className="hidden md:flex gap-4">
                    <button className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors rounded-full">
                        <ArrowRight className="rotate-180" size={20} />
                    </button>
                    <button className="w-12 h-12 border border-black bg-black text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors rounded-full">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* Draggable Carousel */}
            <motion.div
                ref={containerRef}
                className="pl-4 md:pl-32 cursor-grab active:cursor-grabbing"
                whileTap={{ cursor: "grabbing" }}
            >
                <motion.div
                    drag="x"
                    dragConstraints={{ right: 0, left: -2000 }}
                    style={{ x }}
                    className="flex gap-8 w-max pb-20"
                >
                    {[...PRODUCTS, ...PRODUCTS].map((product, idx) => ( // Doubling for length
                        <ProCard key={`${product.id}-${idx}`} product={product} />
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
