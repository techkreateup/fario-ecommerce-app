import React from 'react';
import { motion } from 'framer-motion';

export default function Marquee() {
    return (
        <div className="py-24 bg-black overflow-hidden whitespace-nowrap">
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="flex gap-24 items-center"
            >
                {[...Array(4)].map((_, i) => (
                    <h2 key={i} className="text-[12vw] font-black text-transparent stroke-white stroke-2 uppercase tracking-tighter leading-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
                        FARIO FOOTWEAR — REDEFINING LUXURY
                    </h2>
                ))}
            </motion.div>
        </div>
    );
}
