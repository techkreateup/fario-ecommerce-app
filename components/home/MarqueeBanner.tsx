import React from 'react';
import { motion } from 'framer-motion';

export default function MarqueeBanner({ text = "NEW DROP AVAILABLE NOW  •  FARIO STUDIOS  •  LIMITED QUANTITY  •  ", speed = 20 }) {
    return (
        <div className="bg-yellow-400 text-black overflow-hidden py-3 border-y-4 border-black">
            <div className="relative flex whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
                    className="flex gap-8"
                >
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
                            {text}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
