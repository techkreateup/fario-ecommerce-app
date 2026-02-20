import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
    { id: 1, image: "https://images.unsplash.com/photo-1488161628813-99425205adca?w=800&q=80", link: "/category/men" },
    { id: 2, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", link: "/category/women" }
];

function TiltCard({ cat, idx }) {
    const navigate = useNavigate();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: idx * 0.2 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate(cat.link)}
            className="relative h-[80vh] w-full cursor-pointer overflow-hidden rounded-none perspective-1000"
        >
            <motion.img
                style={{ scale: 1.1, transformStyle: "preserve-3d" }}
                src={cat.image}
                alt=""
                className="h-full w-full object-cover"
            />
            {/* Pure Visual Glint Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
}

export default function EditorialGrid() {
    return (
        <section className="py-0 bg-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {categories.map((cat, idx) => (
                    <TiltCard key={cat.id} cat={cat} idx={idx} />
                ))}
            </div>
        </section>
    );
}
