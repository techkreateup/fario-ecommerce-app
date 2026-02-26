import React from 'react';
import { motion } from 'framer-motion';

const features = [
    { title: "Aerodynamic Mesh", desc: "Reduces drag by 14% while maximizing airflow." },
    { title: "Carbon Plate", desc: "Full-length carbon fiber plate for propulsive energy return." },
    { title: "React Foam", desc: "Our softest, most responsive cushioning ever created." }
];

export default function ProFeatures() {
    return (
        <section className="py-32 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Interaction Side */}
                    <div className="relative h-[600px] bg-white border border-gray-200 p-8 flex items-center justify-center">
                        {/* Simulated 3D Model / SVG Drawing */}
                        <div className="relative w-full h-full">
                            <motion.svg
                                viewBox="0 0 500 300"
                                className="w-full h-full drop-shadow-xl"
                                initial="hidden"
                                whileInView="visible"
                            >
                                {/* Abstract Shoe Outline */}
                                <motion.path
                                    d="M 50 200 Q 150 100 250 150 T 450 200"
                                    fill="transparent"
                                    stroke="black"
                                    strokeWidth="2"
                                    variants={{
                                        hidden: { pathLength: 0, opacity: 0 },
                                        visible: { pathLength: 1, opacity: 1, transition: { duration: 2, ease: "easeInOut" } }
                                    }}
                                />
                                <motion.path
                                    d="M 50 210 L 450 210 L 450 240 L 50 240 Z"
                                    fill="transparent"
                                    stroke="#e5e7eb"
                                    strokeWidth="1"
                                    variants={{
                                        hidden: { pathLength: 0, opacity: 0 },
                                        visible: { pathLength: 1, opacity: 1, transition: { duration: 1.5, delay: 0.5 } }
                                    }}
                                />
                                {/* Detail Circles */}
                                <motion.circle cx="150" cy="150" r="5" fill="black"
                                    initial={{ scale: 0 }} whileInView={{ scale: 1, transition: { delay: 1 } }}
                                />
                                <motion.circle cx="350" cy="180" r="5" fill="black"
                                    initial={{ scale: 0 }} whileInView={{ scale: 1, transition: { delay: 1.2 } }}
                                />
                            </motion.svg>

                            {/* Floating Labels */}
                            <motion.div
                                className="absolute top-[30%] left-[20%] bg-black text-white text-xs px-2 py-1 uppercase font-bold"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 2 }}
                            >
                                Upper Matrix
                            </motion.div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div>
                        <h2 className="text-[3vw] font-bold leading-none mb-12 uppercase tracking-tighter">
                            Deconstructed <br /> Excellence
                        </h2>

                        <div className="flex flex-col gap-8">
                            {features.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="border-l-2 border-gray-200 pl-6 hover:border-black transition-colors duration-300 group cursor-default"
                                >
                                    <h4 className="text-xl font-bold uppercase mb-2 group-hover:text-fario-purple transition-colors">{f.title}</h4>
                                    <p className="text-gray-500 leading-relaxed max-w-sm">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
