import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Flame } from 'lucide-react';
import { HomeTicker } from './HomeTicker';

// ═══════════════════════════════════════════════════════
// PRODUCT FIRST DESIGN: Multi-Image Layouts (3 products/slide)
// 75% Womens (3 Slides) | 25% Mens (1 Slide)
// ═══════════════════════════════════════════════════════

// Universal Triple-Image Component Pattern
interface TripleSlideProps {
    title: string;
    sub: string;
    desc: string;
    bg: string;
    color: string;
    accent: string;
    images: string[];
    link: string;
    badge?: string;
}

function TripleSlide({ title, sub, desc, bg, color, accent, images, link, badge }: TripleSlideProps) {
    return (
        <div className="relative flex flex-col-reverse lg:flex-row items-center overflow-hidden"
            style={{ minHeight: '88vh', background: bg }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] rounded-full blur-[120px] opacity-20"
                style={{ background: accent }} />

            {/* TEXT */}
            <div className="relative z-30 w-full lg:w-[40%] px-6 lg:px-20 pb-16 lg:pb-0 pt-8 lg:pt-0 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
                <p className="text-sm lg:text-base italic" style={{ color: accent, fontFamily: 'Georgia, serif' }}>✦ {sub}</p>
                <h1 className="font-black uppercase leading-[0.85] tracking-tight"
                    style={{ color: color, fontSize: 'clamp(38px, 8vw, 84px)' }}>
                    {title.split(' ').map((word: string, i: number) => (
                        <span key={i} className={i === 1 ? `block text-[${accent}]` : "block"}>{word}</span>
                    ))}
                </h1>
                <p className="text-[11px] lg:text-sm leading-relaxed max-w-[280px] lg:max-w-sm opacity-70" style={{ color: color }}>
                    {desc}
                </p>
                <Link to={link}
                    className="self-center lg:self-start px-8 lg:px-10 py-3.5 lg:py-4 rounded-full font-black text-[12px] lg:text-sm uppercase tracking-[0.15em] text-white hover:scale-105 transition-transform mt-2"
                    style={{ background: accent, boxShadow: `0 10px 30px ${accent}66` }}>
                    Explore Store
                </Link>
            </div>

            {/* IMAGES */}
            <div className="relative z-10 w-full lg:w-[60%] flex items-center justify-center min-h-[40vh] lg:min-h-[75vh] pt-12 lg:pt-0 px-4 lg:px-0">
                <div className="relative w-full max-w-[100vw] lg:max-w-none h-full flex items-center justify-center">
                    {/* Image 1: Bottom Left Staggered - Hidden on XS to avoid clutter */}
                    <div className="absolute left-[-10%] lg:-left-12 bottom-0 lg:-bottom-10 z-10 scale-75 lg:scale-95 rotate-[-20deg] hidden sm:block">
                        <img src={images[1]} alt="Side 1" className="w-[50vw] lg:w-[480px] object-contain drop-shadow-2xl opacity-80 lg:opacity-100" />
                    </div>
                    {/* Image 2: Main Center */}
                    <div className="relative z-20 translate-y-[-5%] lg:translate-y-0">
                        <img src={images[0]} alt="Main Product" className="w-[85vw] sm:w-[50vw] lg:w-[650px] object-contain drop-shadow-[0_45px_90px_rgba(0,0,0,0.2)]" />
                    </div>
                    {/* Image 3: Top Right Staggered - Hidden on XS to avoid clutter */}
                    <div className="absolute right-[-10%] lg:-right-12 top-0 lg:-top-10 z-10 scale-75 lg:scale-95 rotate-[15deg] hidden sm:block">
                        <img src={images[2]} alt="Side 2" className="w-[50vw] lg:w-[480px] object-contain drop-shadow-2xl opacity-80 lg:opacity-100" />
                    </div>

                    {badge && (
                        <div className="absolute top-[5%] lg:top-[20%] right-[5%] bg-white/10 backdrop-blur-md p-1.5 lg:p-3 rounded-lg lg:rounded-2xl border border-white/20 shadow-2xl hidden md:block">
                            <p className="text-[9px] font-black uppercase tracking-tighter text-white">{badge}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── SLIDE 1: Women's "The Elite Trio" ──
function Slide1() {
    return (
        <TripleSlide
            title="THE ELITE TRIO"
            sub="Pinterest Curation"
            desc="Curated selection of women's performance footwear. Built with elite aesthetics and engineered for every city stride."
            bg="#F7F3EE"
            color="#1e293b"
            accent="#f97316"
            images={[
                'https://i.pinimg.com/1200x/ab/9a/13/ab9a13943dd6042c2ff0f2708ca770c1.jpg',
                'https://i.pinimg.com/736x/85/60/66/85606634251b5e272480e2e5d49db000.jpg',
                'https://i.pinimg.com/1200x/d1/80/b5/d180b528806204e3adb37f235f9b1705.jpg'
            ]}
            link="/products"
            badge="Season 2026"
        />
    );
}

// ── SLIDE 2: Women's "Luxe Selection" ──
function Slide2() {
    return (
        <TripleSlide
            title="LUXE SELECTION"
            sub="Designer Series"
            desc="Unmatched elegance meets street culture. A triple-view experience of our most requested women's footwear."
            bg="linear-gradient(145deg, #fdf2f8, #fce7f3, #fff0f6)"
            color="#4a0020"
            accent="#db2777"
            images={[
                'https://i.pinimg.com/736x/81/2e/13/812e13cb55e78ba4db3c730311e659b1.jpg',
                'https://i.pinimg.com/1200x/e8/e0/c2/e8e0c2eeb4a01257d513346f5ef818c8.jpg',
                'https://i.pinimg.com/736x/47/39/0f/47390f2580d686d8b8eabbeea1f8a301.jpg'
            ]}
            link="/products"
        />
    );
}

// ── SLIDE 3: Women's "Urban Performance" ──
function Slide3() {
    return (
        <TripleSlide
            title="URBAN PERFORMANCE"
            sub="Street Culture"
            desc="Born in the lab, raised on concrete. The ultimate urban rotation for the modern woman who commands attention."
            bg="#0f0820"
            color="#ffffff"
            accent="#d9f99d"
            images={[
                'https://i.pinimg.com/736x/d6/c9/08/d6c9085e8b7bde94696685eb3550005d.jpg',
                'https://i.pinimg.com/736x/9b/aa/9f/9baa9f231a54b5c3a85e6b070d3c03db.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO2Kxh4ZUzKkiRxXSeBwHoFXLBeY7AqjPjwQ&s'
            ]}
            link="/products"
            badge="Limited Drop"
        />
    );
}

// ── SLIDE 4: Men's - Midnight Force ──
function Slide4() {
    return (
        <div className="relative flex flex-col-reverse lg:flex-row items-center overflow-hidden"
            style={{ minHeight: '88vh', background: '#080C14' }}>
            <div className="absolute right-0 top-0 h-full flex gap-3 w-full lg:w-[48%] overflow-hidden pointer-events-none opacity-40 lg:opacity-100">
                {[0.9, 0.65, 0.4, 0.2].map((op, i) => (
                    <div key={i} className="flex-1 h-full" style={{ background: '#3b82f6', opacity: op }} />
                ))}
            </div>

            <div className="relative z-20 w-full lg:w-[45%] px-8 lg:px-20 pb-16 lg:pb-0 pt-8 lg:pt-0 flex flex-col gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#3b82f6]">Men's Collection</p>
                <h1 className="font-black uppercase leading-[0.82] tracking-tight text-white" style={{ fontSize: 'clamp(52px, 9vw, 100px)' }}>
                    <span className="block">MIDNIGHT</span>
                    <span className="block text-[#3b82f6]">FORCE</span>
                </h1>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Zero-gravity cushioning. Midnight edition carbon mesh. Only 500 units crafted globally.
                </p>
                <Link to="/products" className="self-start px-10 py-4 rounded-full font-black text-sm uppercase tracking-[0.15em] hover:scale-105 transition-transform mt-2"
                    style={{ background: '#3b82f6', color: '#080C14' }}>Get Yours</Link>
            </div>

            <div className="relative z-10 w-full lg:w-[55%] flex items-center justify-center min-h-[45vh] lg:min-h-screen pt-16 lg:pt-0">
                <img src="https://lh3.googleusercontent.com/d/1JAkZKl652biLyzUdO5X05Y4s7a1AsqPU"
                    alt="Midnight Force" className="w-[85%] lg:w-[100%] max-w-[650px] object-contain -rotate-[12deg]"
                    style={{ filter: 'drop-shadow(0 50px 100px rgba(59,130,246,0.5))' }} />
            </div>
        </div>
    );
}

// ── ROOT COMPONENT ──────────────────────────────────────
const SLIDES = [
    { id: '1', dot: '#f97316' },
    { id: '2', dot: '#db2777' },
    { id: '3', dot: '#d9f99d' },
    { id: '4', dot: '#3b82f6' },
];

export const HomeHero = () => {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 7000);
        return () => clearInterval(t);
    }, []);

    const slides = [<Slide1 />, <Slide2 />, <Slide3 />, <Slide4 />];

    return (
        <section className="relative overflow-hidden w-full">
            <AnimatePresence mode="wait">
                <motion.div key={SLIDES[idx].id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                    {slides[idx]}
                </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button onClick={() => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)}
                className="absolute left-3 lg:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center hover:bg-black/30 transition-all border border-white/10 shadow-xl group">
                <ChevronLeft size={20} className="text-white group-hover:scale-125 transition-transform" />
            </button>
            <button onClick={() => setIdx(i => (i + 1) % SLIDES.length)}
                className="absolute right-3 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center hover:bg-black/30 transition-all border border-white/10 shadow-xl group">
                <ChevronRight size={20} className="text-white group-hover:scale-125 transition-transform" />
            </button>

            {/* Dot nav */}
            <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-black/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                {SLIDES.map((s, i) => (
                    <button key={s.id} onClick={() => setIdx(i)}
                        className="rounded-full transition-all duration-700 ease-out"
                        style={{
                            width: idx === i ? '32px' : '10px', height: '10px',
                            background: idx === i ? s.dot : 'rgba(255,255,255,0.2)',
                            boxShadow: idx === i ? `0 0 15px ${s.dot}66` : 'none'
                        }} />
                ))}
            </div>

            <div className="relative z-30 w-full mt-[-1px]">
                <HomeTicker isFooter={true} />
            </div>
        </section>
    );
};
