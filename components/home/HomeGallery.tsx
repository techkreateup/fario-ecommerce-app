import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HL3 } from './HomeConstants';
import { PImg } from './HomeCommon';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
    { name: 'MEN', color: '#7a51a0', accent: 'rgba(122,81,160,0.2)' },
    { name: 'WOMEN', color: '#ff4d6d', accent: 'rgba(255,77,109,0.2)' },
    { name: 'KIDS', color: '#4cc9f0', accent: 'rgba(76,201,240,0.2)' },
    { name: 'SCHOOL', color: '#fca311', accent: 'rgba(252,163,17,0.2)' }
];

const GALLERY_DATA: Record<string, { label: string; img: string }[]> = {
    MEN: [
        { label: 'AeroStride Pro', img: HL3.a },
        { label: 'Urban Glide', img: HL3.b },
        { label: 'Midnight Force', img: HL3.c },
        { label: 'Velocity Elite', img: HL3.e },
        { label: 'Street Kicks', img: HL3.f },
        { label: 'Runner X', img: HL3.g },
        { label: 'Classic Court', img: HL3.h },
        { label: 'Minimalist High', img: HL3.b },
    ],
    WOMEN: [
        { label: 'Grace Cloud', img: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcThRb6Na5MrV7d4JxRHfz5R6C60iZr017CQ-aM4PNWPku3_0QSKLmaK1XpePwVCpIZutDrVw4Z7vOuJiCLIzywHpXjA0baXZiW-gWH5TWZEeqX1zLQR0z9FajwoHhTaESKvRiIZFDo&usqp=CAc' },
        { label: 'Aura Step', img: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQASaQKWHqUwFssgd9HCff069ovTHMGsPVsYnjx891UBc416yWY40BS2WUmtfj_lgVvyHtvGD6d7Mmo_li3jAURYZJO8dr5wXf9QE0TvDU&usqp=CAc' },
        { label: 'Pearl Stride', img: 'https://apisap.fabindia.com/medias/20267929-01.jpg?context=bWFzdGVyfGltYWdlc3wyMDU5MTR8aW1hZ2UvanBlZ3xhRGRqTDJobE15OHhNakkwTWpJM056UTRNalE1T1RBdk1qQXlOamM1TWpsZk1ERXVhbkJufDg1NWUwNGU2OGY0ZTExZDFmYjAzNWE1OWE4MDNkOGU5YzdlOTdjZjA1ZGFlYjg1YmY5YmMyZGYxNjMxM2FkYWE&aio=w-400' },
        { label: 'Bloom Lite', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdTjgW0825FOjBYGbLItzLa5TdzjYS6-lzg&s' },
        { label: 'Velvet Force', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO2Kxh4ZUzKkiRxXSeBwHoFXLBeY7AqjPjwQ&s' },
        { label: 'Spark Trail', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQijuEjsLkbieCQAORLWhe-WWXDKfXlBIv1vg&s' },
        { label: 'Serenity Knit', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxZi_07UaFciaJB4ByUoewBnqNvJ1m4PvKOg&s' },
    ],
    KIDS: [
        { label: 'Tiny Glider', img: HL3.a },
        { label: 'Playful Steps', img: HL3.e },
        { label: 'Junior Force', img: HL3.c },
        { label: 'Mini Strider', img: HL3.h },
        { label: 'Active Jump', img: HL3.b },
        { label: 'School Dash', img: HL3.g },
        { label: 'Campus Walk', img: HL3.f },
        { label: 'Little Champ', img: HL3.c },
    ],
    SCHOOL: [
        { label: 'Scholar Classic', img: HL3.b },
        { label: 'Academy Uniform', img: HL3.a },
        { label: 'Prep Step', img: HL3.h },
        { label: 'Campus Walk', img: HL3.f },
        { label: 'Student Daily', img: HL3.e },
        { label: 'Library Loafer', img: HL3.g },
        { label: 'Lab Essential', img: HL3.c },
        { label: 'Hallway Runner', img: HL3.a },
    ]
};

const Card = ({ item, isHovered, onHover }: { item: any, isHovered: boolean, onHover: () => void }) => {
    return (
        <motion.div
            className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/5"
            layout
            initial={false}
            animate={{
                width: isHovered ? '280px' : '90px',
                opacity: isHovered ? 1 : 0.6
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onHoverStart={onHover}
            whileHover={{ scale: 1.02, y: -5 }}
            style={{ height: '360px', background: 'rgba(255,255,255,0.03)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
        >
            <PImg
                src={item.img}
                alt={item.label}
                cls={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-150 grayscale-[0.3]'}`}
                px={0}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            {/* Vertical Name Strip (When Collapsed) */}
            {!isHovered && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="font-heading font-black uppercase text-white/50 tracking-widest text-xs whitespace-nowrap -rotate-90">
                        {item.label}
                    </p>
                </div>
            )}

            {/* Expansive Details (When Hovered) */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="absolute bottom-6 left-6 right-6 pointer-events-none"
                >
                    <h3 className="font-heading font-black text-xl md:text-2xl uppercase text-white leading-none mb-1 shadow-black drop-shadow-lg">
                        {item.label}
                    </h3>
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-[0.2em]">Explore Product →</p>
                </motion.div>
            )}
        </motion.div>
    );
};

export const HomeGallery = () => {
    const navigate = useNavigate();
    const [catIdx, setCatIdx] = useState(0);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeCat = CATEGORIES[catIdx];
    const items = GALLERY_DATA[activeCat.name];

    return (
        <section className="relative py-12 md:py-24 overflow-hidden" style={{ background: '#0a0a0a' }}>

            {/* Smooth glowing background tied to category */}
            <motion.div
                className="absolute inset-0 z-0 opacity-40 transition-colors duration-1000"
                animate={{ background: `radial-gradient(ellipse at bottom right, ${activeCat.accent} 0%, transparent 70%)` }}
            />

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">

                {/* Header Track */}
                <div className="flex flex-col md:flex-row w-full justify-between items-end mb-8 md:mb-16 gap-6">
                    <div className="max-w-md">
                        <div className="max-w-md hidden md:block">
                            {/* Text Content Removed per Request */}
                        </div>
                    </div>

                    {/* Navigation Pills */}
                    <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 overflow-x-auto w-full md:w-auto hide-scrollbar">
                        {CATEGORIES.map((cat, i) => (
                            <button
                                key={cat.name}
                                onClick={() => { setCatIdx(i); setHoveredIdx(0); }}
                                className="relative px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-colors z-10 whitespace-nowrap"
                                style={{ color: catIdx === i ? '#000' : '#fff' }}
                            >
                                {catIdx === i && (
                                    <motion.div
                                        layoutId="gallery-pill"
                                        className="absolute inset-0 rounded-full bg-white -z-10"
                                    />
                                )}
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Horizontal Magazine Gallery */}
                <div
                    ref={scrollRef}
                    className="w-full flex gap-3 md:gap-4 overflow-x-auto pb-8 hide-scrollbar items-center"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    {items.map((item, i) => (
                        <div key={item.label} onClick={() => navigate('/products')}>
                            <Card
                                item={item}
                                isHovered={hoveredIdx === i}
                                onHover={() => setHoveredIdx(i)}
                            />
                        </div>
                    ))}

                    {/* View All Capstone */}
                    <motion.div
                        onClick={() => navigate('/products')}
                        whileHover={{ scale: 1.05 }}
                        className="flex-shrink-0 w-[140px] h-[360px] rounded-[2rem] border border-white/10 flex flex-col items-center justify-center p-6 cursor-pointer group ml-4"
                        style={{ background: 'rgba(255,255,255,0.02)' }}
                    >
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white mb-4 group-hover:bg-white group-hover:text-black transition-colors">
                            →
                        </div>
                        <p className="text-white text-xs font-black uppercase tracking-widest text-center opacity-50 group-hover:opacity-100 transition-opacity">View Entire Catalog</p>
                    </motion.div>
                </div>

            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
};
