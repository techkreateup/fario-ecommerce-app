
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative bg-black text-white py-3 px-4 text-center text-sm overflow-hidden"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600 opacity-20" />

            <div className="relative z-10 flex items-center justify-center gap-2">
                <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-yellow-400 font-bold"
                >
                    🎉
                </motion.span>
                <span className="font-semibold">
                    FREE SHIPPING on orders above Rs. 999 |
                    <span className="text-yellow-400 ml-2">Use code: FARIO50</span>
                </span>
            </div>

            {/* Close Button */}
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
                <X size={16} />
            </button>
        </motion.div>
    )
}
