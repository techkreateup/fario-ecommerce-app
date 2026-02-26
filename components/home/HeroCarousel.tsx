
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import { motion } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&q=80',
        title: 'NEW COLLECTION',
        subtitle: 'Step into Style',
        description: 'Discover our latest premium footwear',
        cta: 'SHOP NOW',
        link: '/products'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1920&q=80',
        title: 'UPTO 50% OFF',
        subtitle: 'Summer Sale',
        description: 'Limited time offer on selected items',
        cta: 'GRAB DEALS',
        link: '/products?filter=sale'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1920&q=80',
        title: 'PREMIUM QUALITY',
        subtitle: 'Crafted for Comfort',
        description: 'Experience luxury with every step',
        cta: 'EXPLORE',
        link: '/products?filter=premium'
    }
]

export default function HeroCarousel() {
    return (
        <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            {/* Background Image */}
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

                            {/* Content */}
                            <div className="relative z-10 h-full flex items-center">
                                <div className="container mx-auto px-4 md:px-8">
                                    <motion.div
                                        initial={{ opacity: 0, x: -100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.8 }}
                                        className="max-w-2xl"
                                    >
                                        {/* Small Title */}
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-yellow-400 text-sm md:text-base font-semibold tracking-widest mb-4"
                                        >
                                            {slide.subtitle}
                                        </motion.p>

                                        {/* Main Title */}
                                        <motion.h1
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                                        >
                                            {slide.title}
                                        </motion.h1>

                                        {/* Description */}
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8 }}
                                            className="text-white/90 text-lg md:text-xl mb-8 max-w-lg"
                                        >
                                            {slide.description}
                                        </motion.p>

                                        {/* CTA Button */}
                                        <a
                                            href={slide.link}
                                            className="inline-block bg-white text-black px-10 py-4 font-bold text-lg hover:bg-yellow-400 transition-all duration-300"
                                        >
                                            {slide.cta}
                                        </a>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}
