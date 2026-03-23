import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const AVAILABLE_CATEGORIES = ["Formal Shoes", "Casual Shoes", "Sports Shoes", "Sneakers"];

const MENU_DATA = [
    {
        title: "Men",
        links: ["Formal Shoes", "Casual Shoes", "Sports Shoes", "Moccasins", "Loafers", "Sandals", "Slippers / Flip Flops", "Sneakers", "Boots", "Kolhapuri", "Clogs", "Ethnic Shoes"]
    },
    {
        title: "Women",
        links: ["Formal Shoes", "Casual Shoes", "Sports Shoes", "Sandals", "Ballerinas", "Pumps", "Loafers", "Sneakers", "Boots", "Ethnic Shoes", "Flats", "Heels", "Block Heels", "Stilettos", "Wedges", "Kitten Heels", "Peep Toes", "Slippers / Slides"]
    },
    {
        title: "Kids",
        links: ["Formal Shoes", "Casual Shoes", "Sneakers", "Moccasins", "Derby Shoes", "Sandals", "Slippers", "Boots", "Clogs", "School Shoes", "Ballerinas"]
    },
    {
        title: "Bags / Accessories",
        links: ["Handbags", "Clutches", "Wallets", "Belts", "Foot Care", "Shoe Care"]
    },
    {
        title: "Brands",
        links: ["Fario", "Metro", "Mochi"]
    },
    {
        title: "Sale / New Arrivals",
        links: ["Latest Drops", "Clearance Sale", "Festive Offers"]
    }
];

export const HomeSubNav = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    const renderLink = (link: string, lIdx: number) => {
        const isAvailable = AVAILABLE_CATEGORIES.includes(link);
        return (
            <li key={lIdx}>
                <Link
                    to={`/products?category=${encodeURIComponent(link)}`}
                    className={`text-sm font-medium transition-colors relative group inline-flex items-center gap-2 whitespace-nowrap ${isAvailable ? 'text-gray-500 hover:text-[#7a51a0]' : 'text-gray-400 hover:text-gray-500'}`}
                    onClick={() => setOpenIndex(null)}
                >
                    {link}
                    {!isAvailable && (
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-purple-50 text-purple-400 px-1.5 py-0.5 rounded-sm">Soon</span>
                    )}
                    {isAvailable && <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#7a51a0] transition-all group-hover:w-full"></span>}
                </Link>
            </li>
        );
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle scroll to make it sticky below header
    useEffect(() => {
        const handleScroll = () => {
            // Trigger stickiness after scrolling past the initial top margin (adjusted for ticker/header)
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div
                className={`w-full bg-gradient-to-r from-purple-50/90 via-white to-purple-50/90 backdrop-blur-xl border-y border-purple-200/60 shadow-[0_15px_40px_-15px_rgba(122,81,160,0.15)] z-[90] sticky top-16 lg:top-24 transition-all duration-300 mt-8 lg:mt-14`}
                ref={navRef}
                onMouseLeave={() => setOpenIndex(null)}
            >
                <div className="container mx-auto px-2 lg:px-10 h-16 flex items-center justify-start md:justify-center gap-4 md:gap-10 lg:gap-16 flex-nowrap overflow-x-auto no-scrollbar relative">

                    {/* Decorative glowing orb behind categories */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[30px] bg-purple-400/10 blur-2xl pointer-events-none rounded-full" />

                    {MENU_DATA.map((col, idx) => {
                        const isOpen = openIndex === idx;
                        const isSale = col.title === "Sale / New Arrivals";

                        return (
                            <button
                                key={idx}
                                className={`relative text-[10px] md:text-sm lg:text-[15px] font-black uppercase tracking-[0.05em] md:tracking-[0.1em] lg:tracking-[0.2em] flex items-center gap-1.5 transition-all duration-300 h-full px-2 whitespace-nowrap shrink-0 
                                    ${isOpen
                                        ? 'text-[#7a51a0] scale-105 drop-shadow-md'
                                        : isSale
                                            ? 'text-rose-600 hover:text-rose-700 hover:scale-105'
                                            : 'text-[#1a0d2e] hover:text-[#7a51a0] hover:scale-105'
                                    }`}
                                onMouseEnter={() => setOpenIndex(idx)}
                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                            >
                                {col.title}
                                {isOpen ? <ChevronUp size={14} className="transition-transform duration-300" /> : <ChevronDown size={14} className="opacity-50 transition-transform duration-300 group-hover:opacity-100" />}

                                {/* Active indicator line */}
                                {isOpen && (
                                    <motion.div
                                        layoutId="activeSubNav"
                                        className="absolute bottom-0 left-0 w-full h-[3px] bg-[#7a51a0] rounded-t-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {openIndex !== null && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-b border-gray-100 shadow-xl absolute top-full left-0 w-full bg-white z-50 origin-top"
                        >
                            <div className="container mx-auto px-6 lg:px-10 py-8 flex justify-center">
                                <div className="flex flex-col gap-4 min-w-[200px]">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#1a0d2e] pb-2 border-b border-purple-100 text-center">
                                        {MENU_DATA[openIndex].title}
                                    </h3>
                                    {MENU_DATA[openIndex].links.length > 8 ? (
                                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
                                            {Array.from({ length: Math.ceil(MENU_DATA[openIndex].links.length / 4) }).map((_, cIdx) => (
                                                <ul key={cIdx} className="flex flex-col gap-3 text-left">
                                                    {MENU_DATA[openIndex].links.slice(cIdx * 4, (cIdx + 1) * 4).map((link, lIdx) => renderLink(link, lIdx))}
                                                </ul>
                                            ))}
                                        </div>
                                    ) : (
                                        <ul className="flex flex-col gap-3 text-center">
                                            {MENU_DATA[openIndex].links.map((link, lIdx) => renderLink(link, lIdx))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};
