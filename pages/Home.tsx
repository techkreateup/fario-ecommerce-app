/*
 * FARIO E-COMMERCE - HOME PAGE (ULTRA-ADVANCED EDITION)
 * -----------------------------------------------------------------------------
 * Target: 1500+ Lines
 * Style: Premium Editorial (The Cai Store Inspired)
 * Ratio: 20% Text | 40% Video | 40% Image
 * -----------------------------------------------------------------------------
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  AnimatePresence,
  useInView,
  Variants,
  PanInfo
} from 'framer-motion';
import {
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowUpRight,
  Star,
  ShoppingBag,
  Heart,
  Eye,
  Menu,
  ChevronRight,
  ChevronLeft,
  X,
  Instagram,
  Facebook,
  Twitter,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

/*
 * =============================================================================
 * SECTION 1: STRICT TYPESCRIPT INTERFACES
 * =============================================================================
 */

type AssetType = 'image' | 'video';

interface MediaAsset {
  type: AssetType;
  src: string;
  poster?: string; // For videos
  alt: string;
  aspectRatio?: string; // Tailwind class
}

interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  media: MediaAsset;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  badges: string[]; // "New", "Sale", "Limited"
  description: string;
  rating: number;
  reviewsCount: number;
  variants: ProductVariant[];
  hoverMedia: MediaAsset; // Video or alternate image
}

interface Story {
  id: string;
  title: string;
  subtitle: string;
  media: MediaAsset;
  layout: 'full' | 'split-left' | 'split-right';
  content: string;
  cta: string;
  ctaLink: string;
}

interface Testimonial {
  id: string;
  user: string;
  location: string;
  text: string;
  rating: number;
  media?: MediaAsset; // Video review
  purchasedProduct?: string;
}

/*
 * =============================================================================
 * SECTION 2: MASSIVE MOCK DATA LAYER
 * =============================================================================
 * Simulating a rich CMS response.
 */

// --- ASSETS LIBRARY (Unsplash + Pexels) ---
const ASSETS = {
  heroVideo: "https://cdn.pixabay.com/video/2024/02/09/200021-912204990_large.mp4",
  heroPoster: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920",
  walkingVideo: "https://cdn.pixabay.com/video/2019/05/29/24036-339232938_large.mp4",
  fashionVideo: "https://cdn.pixabay.com/video/2020/05/25/40103-424930149_large.mp4",
  shoes: [
    "https://images.unsplash.com/photo-1549298916-b41d50172?w=800",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800",
    "https://images.unsplash.com/photo-1511556532299-8f662fc26306?w=800",
    "https://images.unsplash.com/photo-1515347619252-60a6bf499ce?w=800"
  ]
};

const PRODUCTS_DB: Product[] = [
  {
    id: "p1",
    name: "The Velvet Loafer",
    price: 12900,
    currency: "INR",
    category: "Loafers",
    badges: ["Best Seller"],
    description: "Handcrafted Italian velvet meets ergonomic design.",
    rating: 4.8,
    reviewsCount: 124,
    variants: [
      { id: "v1", colorName: "Midnight", colorHex: "#1a1a1a", media: { type: 'image', src: 'https://images.unsplash.com/photo-1533867617858-e7b97e0605df?w=800', alt: 'Black Loafer' } },
      { id: "v2", colorName: "Burgundy", colorHex: "#4a0404", media: { type: 'image', src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', alt: 'Red Loafer' } }
    ],
    hoverMedia: { type: 'video', src: ASSETS.walkingVideo, alt: 'Walking View' }
  },
  {
    id: "p2",
    name: "Urban Runner X",
    price: 8500,
    currency: "INR",
    category: "Sneakers",
    badges: ["New"],
    description: "Speed, comfort, and style in one package.",
    rating: 4.9,
    reviewsCount: 45,
    variants: [
      { id: "v3", colorName: "White/Gold", colorHex: "#f5f5f5", media: { type: 'image', src: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800', alt: 'White Sneaker' } }
    ],
    hoverMedia: { type: 'video', src: ASSETS.fashionVideo, alt: 'Runner View' }
  },
  {
    id: "p3",
    name: "Chelsea Classic",
    price: 15900,
    currency: "INR",
    category: "Boots",
    badges: [],
    description: "The definitive boot for the modern wardrobe.",
    rating: 4.7,
    reviewsCount: 89,
    variants: [
      { id: "v4", colorName: "Black", colorHex: "#000", media: { type: 'image', src: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800', alt: 'Black Boot' } }
    ],
    hoverMedia: { type: 'image', src: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', alt: 'Boot Detail' }
  },
  {
    id: "p4",
    name: "Stiletto Royale",
    price: 18000,
    currency: "INR",
    category: "Heels",
    badges: ["Limited"],
    description: "Evening wear redefined.",
    rating: 5.0,
    reviewsCount: 12,
    variants: [
      { id: "v5", colorName: "Gold", colorHex: "#d4af37", media: { type: 'image', src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', alt: 'Gold Heel' } }
    ],
    hoverMedia: { type: 'video', src: ASSETS.heroVideo, alt: 'Heel Walk' }
  },
  // Duplicates to fill carousel
  {
    id: "p5",
    name: "Monk Strap Elite",
    price: 14500,
    currency: "INR",
    category: "Formal",
    badges: [],
    description: "Double strap elegance.",
    rating: 4.6,
    reviewsCount: 34,
    variants: [
      { id: "v6", colorName: "Tan", colorHex: "#d2b48c", media: { type: 'image', src: 'https://images.unsplash.com/photo-1614252369475-531eda835cf7?w=800', alt: 'Tan Shoe' } }
    ],
    hoverMedia: { type: 'image', src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800', alt: 'Detail' }
  }
];

const STORIES_DB: Story[] = [
  {
    id: "s1",
    title: "The Art of Walking",
    subtitle: "Campaign 2026",
    content: "We believe that movement is an art form. Our latest collection explores the relationship between kinetics and aesthetics.",
    media: { type: 'video', src: ASSETS.walkingVideo, alt: 'Campaign Video' },
    layout: 'split-right',
    cta: 'View Campaign',
    ctaLink: '/stories/art-of-walking'
  },
  {
    id: "s2",
    title: "Sustainability First",
    subtitle: "Ethical Luxury",
    content: "Crafted from 100% recycled ocean plastics and ethically sourced leathers. Beauty doesn't have to cost the earth.",
    media: { type: 'image', src: "https://images.unsplash.com/photo-1511556532299-8f662fc26306?w=800", alt: 'Sustainable Shoe' },
    layout: 'split-left',
    cta: 'Our Process',
    ctaLink: '/stories/sustainability'
  }
];

const REVIEWS_DB: Testimonial[] = [
  {
    id: "r1",
    user: "Elena R.",
    location: "Mumbai",
    text: "I've never worn anything this comfortable. It's like walking on clouds, but with style.",
    rating: 5,
    media: { type: 'video', src: ASSETS.heroVideo, alt: 'Video Review' },
    purchasedProduct: "The Velvet Loafer"
  },
  {
    id: "r2",
    user: "Arjun M.",
    location: "Bangalore",
    text: "Incredible attention to detail. The packaging alone is worth the price.",
    rating: 5,
    purchasedProduct: "Urban Runner X"
  },
  {
    id: "r3",
    user: "Sophie L.",
    location: "Delhi",
    text: "Finally, a brand that understands wide feet without compromising on looks.",
    rating: 4,
    purchasedProduct: "Chelsea Classic"
  }
];

/*
 * =============================================================================
 * SECTION 3: ANIMATION CONFIGURATION
 * =============================================================================
 */

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const; // Custom Bezier

const anim = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE_LUXURY }
    }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, ease: "linear" }
    }
  },
  scaleIn: {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: EASE_LUXURY }
    }
  },
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  revealMask: {
    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
    visible: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { duration: 1, ease: EASE_LUXURY, delay: 0.2 }
    }
  }
};

/*
 * =============================================================================
 * SECTION 4: ATOMIC COMPONENTS
 * =============================================================================
 */

// 4.1 Button Atom
const Button = ({
  children,
  variant = 'primary',
  onClick,
  className = ''
}: {
  children: React.ReactNode,
  variant?: 'primary' | 'outline' | 'text',
  onClick?: () => void,
  className?: string
}) => {
  const baseClass = "uppercase tracking-widest text-xs font-bold py-4 px-8 transition-all duration-300 relative overflow-hidden group";
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800",
    outline: "border border-black text-black hover:bg-black hover:text-white",
    text: "text-black border-b border-black pb-1 px-0 hover:text-gray-600 hover:border-gray-600"
  };

  return (
    <button onClick={onClick} className={`${baseClass} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

// 4.2 Badge Atom
const Badge = ({ text }: { text: string }) => (
  <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-black text-[10px] uppercase font-bold px-3 py-1 shadow-sm">
    {text}
  </span>
);

/*
 * =============================================================================
 * SECTION 5: COMPLEX FEATURE COMPONENTS
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// 5.1 HERO SECTION ("Cinema Scale")
// -----------------------------------------------------------------------------
const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen w-full overflow-hidden bg-black">
      {/* Parallax Video Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={ASSETS.heroPoster}
          className="w-full h-full object-cover opacity-80"
        >
          <source src={ASSETS.heroVideo} type="video/mp4" />
        </video>
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={anim.stagger}
          style={{ y: textY }}
        >
          <div className="overflow-hidden mb-4">
            <motion.h2
              variants={anim.fadeUp}
              className="text-sm md:text-base font-bold uppercase tracking-[0.4em] text-white/80"
            >
              Collection 2026
            </motion.h2>
          </div>

          <div className="overflow-hidden mb-8">
            <motion.h1
              variants={anim.revealMask}
              className="text-[12vw] md:text-[8vw] font-black uppercase tracking-tighter leading-[0.9] mix-blend-overlay"
            >
              Fario
            </motion.h1>
          </div>

          <motion.div variants={anim.fadeUp} className="flex gap-6 justify-center">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              For Him
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              For Her
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/70">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-full bg-white"
          />
        </div>
      </motion.div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 5.2 CATEGORY MASONRY (Asymmetric Grid)
// -----------------------------------------------------------------------------
const CategoryMasonry = () => {
  // 20% Text, 40% Video, 40% Image ratio in implementation
  const categories = [
    { id: 1, name: "Sneakers", type: "video", src: ASSETS.walkingVideo, span: "col-span-1 md:col-span-2 row-span-2", height: "h-[600px]" },
    { id: 2, name: "Loafers", type: "image", src: ASSETS.shoes[0], span: "col-span-1 row-span-1", height: "h-[300px]" },
    { id: 3, name: "Heels", type: "image", src: ASSETS.shoes[3], span: "col-span-1 row-span-1", height: "h-[300px]" },
    { id: 4, name: "Boots", type: "video", src: ASSETS.fashionVideo, span: "col-span-1 md:col-span-2 row-span-1", height: "h-[300px]" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Curated Categories</h2>
            <p className="text-gray-500 max-w-sm">Explore our defining silhouettes.</p>
          </div>
          <Link to="/collections" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-purple-600 transition-colors">
            View All <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              className={`relative group overflow-hidden ${cat.span} ${cat.height} bg-gray-100`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              {/* Media */}
              {cat.type === 'video' ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                >
                  <source src={cat.src} />
                </video>
              ) : (
                <img
                  src={cat.src}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Label */}
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/95 backdrop-blur px-6 py-3 text-sm font-bold uppercase tracking-widest shadow-lg transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 block">
                  {cat.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 5.3 PHYSICS CAROUSEL (Product Slider)
// -----------------------------------------------------------------------------
const PhysicsCarousel = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (sliderRef.current) {
      setWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth);
    }
  }, []);

  return (
    <section className="py-24 bg-gray-50 border-y border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4 mb-12 flex justify-between items-center">
        <h2 className="text-4xl font-bold uppercase tracking-tighter">New Arrivals</h2>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <motion.div
        ref={sliderRef}
        className="pl-4 md:pl-[calc((100vw-1200px)/2)] cursor-grab active:cursor-grabbing"
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-8 w-max pr-24"
        >
          {PRODUCTS_DB.map((product, i) => (
            <div key={product.id} className="w-[300px] md:w-[400px] group relative bg-white">
              {/* Product Image Stage */}
              <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                {product.badges.length > 0 && (
                  <Badge text={product.badges[0]} />
                )}

                {/* Primary Image */}
                <img
                  src={product.variants[0].media.src}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />

                {/* Hover Media (Scale & Fade) */}
                <motion.div
                  className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white"
                >
                  {product.hoverMedia.type === 'video' ? (
                    <video
                      src={product.hoverMedia.src}
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={product.hoverMedia.src}
                      alt="Alt"
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>

                {/* Quick Add Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-30 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-black text-white py-4 uppercase font-bold text-xs tracking-widest hover:bg-zinc-800 flex items-center justify-center gap-2">
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">{product.category}</div>
                <h3 className="text-lg font-bold uppercase mb-1">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">₹{product.price.toLocaleString()}</span>
                  <div className="flex gap-1">
                    {product.variants.map((v) => (
                      <div key={v.id} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: v.colorHex }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 5.4 BRAND STORY (Editorial Layout)
// -----------------------------------------------------------------------------
const BrandStory = () => {
  return (
    <section className="py-0 border-b border-gray-100">
      {STORIES_DB.map((story, i) => (
        <div key={story.id} className={`flex flex-col md:flex-row h-screen ${story.layout === 'split-left' ? 'md:flex-row-reverse' : ''}`}>

          {/* Visual Side */}
          <div className="w-full md:w-1/2 h-[50vh] md:h-full relative overflow-hidden group">
            {story.media.type === 'video' ? (
              <div className="w-full h-full relative">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                  <source src={story.media.src} />
                </video>
                <div className="absolute inset-0 bg-black/20" />
              </div>
            ) : (
              <img src={story.media.src} alt={story.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
            )}
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 h-[50vh] md:h-full flex items-center justify-center p-8 bg-white">
            <div className="max-w-md text-center md:text-left">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block text-fario-purple text-xs font-bold uppercase tracking-[0.2em] mb-4"
              >
                {story.subtitle}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8"
              >
                {story.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500 text-lg leading-relaxed mb-12 font-serif"
              >
                {story.content}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button variant="text" onClick={() => { }}>{story.cta} <ArrowRight size={14} /></Button>
              </motion.div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

// -----------------------------------------------------------------------------
// 5.5 TESTIMONIAL WALL (Vertical Marquee)
// -----------------------------------------------------------------------------
const TestimonialWall = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Header Col */}
          <div className="flex flex-col justify-center">
            <Star className="w-12 h-12 text-yellow-500 fill-yellow-500 mb-6" />
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">The Verdict</h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands who have elevated their step.
              Read what the community is saying properly.
            </p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black self-start">
              Read All Reviews
            </Button>
          </div>

          {/* Review Cards (Static for now, implies scrolling) */}
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REVIEWS_DB.map((review, i) => (
              <div key={review.id} className="bg-zinc-900 p-8 border border-zinc-800 hover:border-zinc-600 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={`${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`} />
                  ))}
                </div>
                <p className="text-lg leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs">
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase">{review.user}</div>
                    <div className="text-xs text-gray-500">{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------
// 5.6 MEGA FOOTER (Cinematic)
// -----------------------------------------------------------------------------
const Footer = () => {
  return (
    <footer className="relative bg-black text-white pt-24 pb-12 overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          {/* Brand */}
          <div className="md:col-span-4">
            <h2 className="text-6xl font-black uppercase tracking-tighter mb-8 text-transparent stroke-text" style={{ WebkitTextStroke: '1px white' }}>
              FARIO
            </h2>
            <p className="text-gray-400 max-w-xs mb-8">
              Redefining the architecture of footwear.
              Est. 2026 in New Delhi.
            </p>
            <div className="flex gap-4">
              <Instagram className="hover:text-fario-purple transition-colors cursor-pointer" />
              <Facebook className="hover:text-fario-purple transition-colors cursor-pointer" />
              <Twitter className="hover:text-fario-purple transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-8 text-gray-500">Shop</h4>
            <ul className="space-y-4">
              {['Men', 'Women', 'New Arrivals', 'Best Sellers', 'Accessories'].map(item => (
                <li key={item}><a href="#" className="hover:text-white text-gray-400 transition-colors uppercase text-xs tracking-wider">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-8 text-gray-500">Support</h4>
            <ul className="space-y-4">
              {['Contact', 'Shipping', 'Returns', 'Size Guide', 'FAQ'].map(item => (
                <li key={item}><a href="#" className="hover:text-white text-gray-400 transition-colors uppercase text-xs tracking-wider">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-8 text-gray-500">Newsletter</h4>
            <p className="text-gray-400 mb-6 text-sm">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex border-b border-white/20 pb-4">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="bg-transparent w-full focus:outline-none uppercase tracking-widest text-sm placeholder:text-gray-600"
              />
              <button className="uppercase font-bold text-xs tracking-widest hover:text-gray-300">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 uppercase tracking-widest">
          <div>© 2026 Fario Footwear. All rights reserved.</div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

/*
 * =============================================================================
 * SECTION 6: MAIN PAGE COMPONENT
 * =============================================================================
 */

export default function Home() {
  // Global scroll progress for page-wide effects
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen relative selection:bg-black selection:text-white"
    >
      {/* 0. Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-50 mix-blend-difference"
        style={{ scaleX }}
      />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Categories Grid */}
      <CategoryMasonry />

      {/* 3. Physics Carousel */}
      <PhysicsCarousel />

      {/* 4. Editorial Stories */}
      <BrandStory />

      {/* 5. Testimonial Wall */}
      <TestimonialWall />

      {/* 6. Footer */}
      <Footer />

    </motion.div>
  );
}

// END OF FILE - 1500+ LINES TARGET
