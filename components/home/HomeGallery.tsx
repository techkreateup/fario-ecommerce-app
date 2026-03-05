import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DARK_TXT, PURPLE, LIME, E, HL3 } from './HomeConstants';
import { PImg } from './HomeCommon';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['MEN', 'WOMEN', 'KIDS', 'SCHOOL'];

const GALLERY_DATA: Record<string, { label: string; img: string }[]> = {
    MEN: [
        { label: 'AeroStride Pro', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80' },
        { label: 'Urban Glide', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80' },
        { label: 'Midnight Force', img: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80' },
        { label: 'Velocity Elite', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80' },
        { label: 'Street Kicks', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80' },
        { label: 'Runner X', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80' },
        { label: 'Classic Court', img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80' },
        { label: 'Minimalist High', img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80' },
    ],
    WOMEN: [
        { label: 'Grace Cloud', img: 'https://apisap.fabindia.com/medias/20267929-01.jpg?context=bWFzdGVyfGltYWdlc3wyMDU5MTR8aW1hZ2UvanBlZ3xhRGRqTDJobE15OHhNakkwTWpJM056UTRNalE1T1RBdk1qQXlOamM1TWpsZk1ERXVhbkJufDg1NWUwNGU2OGY0ZTExZDFmYjAzNWE1OWE4MDNkOGU5YzdlOTdjZjA1ZGFlYjg1YmY5YmMyZGYxNjMxM2FkYWE&aio=w-400', },
        { label: 'Aura Step', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOrSORI8SxCpda3U_QaG88DbZgS9hiUtgQpw&s' },
        { label: 'Luna Flex', img: HL3.a },
        { label: 'Pearl Stride', img: HL3.e },
        { label: 'Bloom Lite', img: HL3.g },
        { label: 'Velvet Force', img: HL3.h },
        { label: 'Spark Trail', img: HL3.c },
        { label: 'Serenity Knit', img: HL3.f },
    ],
    KIDS: [
        { label: 'Tiny Glider', img: HL3.h },
        { label: 'Playful Steps', img: HL3.g },
        { label: 'Junior Force', img: HL3.f },
        { label: 'Mini Strider', img: HL3.e },
        { label: 'Active Jump', img: HL3.c },
        { label: 'School Dash', img: HL3.b },
        { label: 'Campus Walk', img: HL3.a },
        { label: 'Little Champ', img: HL3.h },
    ],
    SCHOOL: [
        { label: 'Scholar Classic', img: HL3.a },
        { label: 'Academy Uniform', img: HL3.b },
        { label: 'Prep Step', img: HL3.c },
        { label: 'Campus Walk', img: HL3.e },
        { label: 'Student Daily', img: HL3.f },
        { label: 'Library Loafer', img: HL3.g },
        { label: 'Lab Essential', img: HL3.h },
        { label: 'Hallway Runner', img: HL3.a },
    ]
};

export const HomeGallery = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    // Auto rotate every 4 seconds
    useEffect(() => {
        if (isHovering) return;
        const interval = setInterval(() => {
            setActiveCategory((prev) => (prev + 1) % CATEGORIES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isHovering]);

    const activeData = GALLERY_DATA[CATEGORIES[activeCategory]];

    return (
        <section className="py-12 md:py-24" style={{ background: '#F5F0FF' }}>
            <div className="container mx-auto px-4 md:px-16"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.p
                        initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
                        className="text-xs uppercase tracking-[0.4em] mb-3 font-bold"
                        style={{ color: PURPLE }}
                    >
                        The Full Range
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="font-heading font-black uppercase tracking-tighter mb-8"
                        style={{ fontSize: 'clamp(28px, 6vw, 68px)', color: DARK_TXT }}
                    >
                        Our Gallery
                    </motion.h2>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-6 mb-6 md:mb-12">
                        {CATEGORIES.map((cat, idx) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(idx)}
                                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 border-2`}
                                style={{
                                    borderColor: activeCategory === idx ? PURPLE : 'transparent',
                                    background: activeCategory === idx ? PURPLE : '#fff',
                                    color: activeCategory === idx ? '#fff' : DARK_TXT,
                                    boxShadow: activeCategory === idx ? '0 8px 24px rgba(122,81,160,0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: E }}
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10"
                        >
                            {activeData.map((g, i) => (
                                <motion.div
                                    key={g.label}
                                    onClick={() => navigate('/products')}
                                    className="flex flex-col items-center cursor-pointer group"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    whileHover={{ y: -5 }}
                                >
                                    {/* Image Container without the green circle */}
                                    <div className="relative mb-4 w-full flex justify-center">
                                        <div
                                            className="w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-[2rem] overflow-hidden border-2 transition-all duration-400 group-hover:border-[#7a51a0] relative flex-shrink-0"
                                            style={{
                                                borderColor: 'rgba(122,81,160,0.1)',
                                                background: '#fff',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                                            }}
                                        >
                                            <PImg
                                                src={g.img}
                                                alt={g.label}
                                                px={0}
                                                cls="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <span
                                        className="text-xs sm:text-sm font-black uppercase tracking-wider text-center mt-2 group-hover:text-purple-600 transition-colors duration-300"
                                        style={{ color: DARK_TXT }}
                                    >
                                        {g.label}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-8 md:mt-16"
                >
                    <button
                        onClick={() => navigate('/products')}
                        className="px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                        style={{ background: PURPLE, color: '#fff', boxShadow: '0 8px 32px rgba(122,81,160,0.35)' }}
                    >
                        View All Products →
                    </button>
                </motion.div>
            </div>
        </section>
    );
};
