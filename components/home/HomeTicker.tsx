import React from 'react';
import { motion } from 'framer-motion';
import { PURPLE, LIME, TICKER } from './HomeConstants';

export const HomeTicker = () => (
    <div className="overflow-hidden py-4 border-y" style={{ background: PURPLE, borderColor: `${PURPLE}AA` }}>
        <motion.div
            animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}
            className="flex gap-12 whitespace-nowrap w-max"
        >
            {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: LIME }}>★ {t}</span>
            ))}
        </motion.div>
    </div>
);
