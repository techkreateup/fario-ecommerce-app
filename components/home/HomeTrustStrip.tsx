import React from 'react';
import { motion } from 'framer-motion';
import { BG_WHITE, PUR_BORDER, PURPLE, DARK_TXT, TRUST } from './HomeConstants';

export const HomeTrustStrip = () => (
    <div style={{ background: BG_WHITE, borderTop: `1px solid ${PUR_BORDER}`, borderBottom: `1px solid ${PUR_BORDER}` }}>
        <div className="container mx-auto px-8 md:px-20 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST.map((t, i) => (
                <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    className="flex flex-col items-center text-center gap-3 cursor-default"
                >
                    <motion.div style={{ color: PURPLE }}
                        whileHover={{ rotate: [-10, 10, -10, 0] }} transition={{ duration: 0.4 }}
                    >{t.icon}</motion.div>
                    <p className="font-bold text-sm uppercase tracking-wide" style={{ color: DARK_TXT }}>{t.title}</p>
                    <p className="text-xs opacity-50" style={{ color: DARK_TXT }}>{t.sub}</p>
                </motion.div>
            ))}
        </div>
    </div>
);
