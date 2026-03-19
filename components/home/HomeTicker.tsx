import React from 'react';
import { motion } from 'framer-motion';
import { PURPLE, LIME, TICKER } from './HomeConstants';

export const HomeTicker = ({ isFooter = false }: { isFooter?: boolean }) => (
    <div className={`overflow-hidden max-w-[100vw] border-y ${isFooter ? 'py-4 mt-0' : 'py-3 mt-0'}`} style={{ background: PURPLE, borderColor: `${PURPLE}AA` }}>
        <motion.div
            animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
            className="flex gap-12 whitespace-nowrap w-max items-center"
        >
            {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
                <span key={i} className="text-sm md:text-base font-bold uppercase tracking-widest" style={{ color: LIME }}>★ {t}</span>
            ))}
        </motion.div>
    </div >
);
