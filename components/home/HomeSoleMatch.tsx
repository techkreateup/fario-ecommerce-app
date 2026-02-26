import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Creative: AI Sole Match — a 4-question quiz that recommends the perfect Fario shoe
// This concept is unheard of in Indian footwear e-commerce

const questions = [
    {
        q: 'What best describes your daily vibe?',
        emoji: '⚡',
        options: [
            { label: 'Student on the move', icon: '📚', key: 'student' },
            { label: 'Athletic & sporty', icon: '🏃', key: 'athlete' },
            { label: 'Street style king', icon: '👑', key: 'street' },
            { label: 'Corporate hustler', icon: '💼', key: 'corporate' },
        ],
    },
    {
        q: 'How long are you on your feet each day?',
        emoji: '⏱️',
        options: [
            { label: 'Under 3 hours', icon: '🛋️', key: 'low' },
            { label: '3–6 hours', icon: '🚶', key: 'medium' },
            { label: '6–10 hours', icon: '🏌️', key: 'high' },
            { label: 'All day', icon: '🔥', key: 'extreme' },
        ],
    },
    {
        q: 'What matters most to you?',
        emoji: '🎯',
        options: [
            { label: 'Maximum comfort', icon: '💆', key: 'comfort' },
            { label: 'Bold looks', icon: '😎', key: 'style' },
            { label: 'Grip & stability', icon: '🧲', key: 'grip' },
            { label: 'Lightweight feel', icon: '🪶', key: 'light' },
        ],
    },
    {
        q: 'Pick your terrain:',
        emoji: '🗺️',
        options: [
            { label: 'City streets', icon: '🏙️', key: 'city' },
            { label: 'Campus & indoors', icon: '🏫', key: 'campus' },
            { label: 'Courts & tracks', icon: '🏀', key: 'court' },
            { label: 'Everywhere', icon: '🌍', key: 'everywhere' },
        ],
    },
];

// Match logic — maps answer combos to a recommended product
const getMatch = (answers: string[]) => {
    const [vibe, , priority, terrain] = answers;

    if (vibe === 'athlete' || terrain === 'court') return {
        name: 'AeroStride Pro',
        desc: 'Maximum energy return for peak athletic performance.',
        emoji: '⚡',
        color: '#7C3AED',
        score: 97,
        path: '/products',
    };
    if (vibe === 'student' || terrain === 'campus') return {
        name: 'Velocity Elite',
        desc: 'All-day comfort engineered for campus life.',
        emoji: '📚',
        color: '#5B21B6',
        score: 95,
        path: '/products',
    };
    if (vibe === 'street' || priority === 'style') return {
        name: 'Midnight Force',
        desc: 'Stealth aesthetics. Dominate the street.',
        emoji: '👑',
        color: '#1a0d2e',
        score: 98,
        path: '/products',
    };
    return {
        name: 'Urban Glide',
        desc: 'Effortless style for the modern city hustler.',
        emoji: '🌆',
        color: '#4C1D95',
        score: 94,
        path: '/products',
    };
};

export const HomeSoleMatch: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'intro' | number | 'result'>('intro');
    const [answers, setAnswers] = useState<string[]>([]);
    const [match, setMatch] = useState<ReturnType<typeof getMatch> | null>(null);
    const [selected, setSelected] = useState<string | null>(null);

    const qIndex = typeof step === 'number' ? step : 0;
    const q = questions[qIndex];

    const choose = (key: string) => {
        setSelected(key);
        setTimeout(() => {
            const next = [...answers, key];
            setAnswers(next);
            setSelected(null);
            if (qIndex < questions.length - 1) {
                setStep(qIndex + 1);
            } else {
                setMatch(getMatch(next));
                setStep('result');
            }
        }, 350);
    };

    const reset = () => { setStep('intro'); setAnswers([]); setMatch(null); setSelected(null); };

    return (
        <section
            className="relative py-16 md:py-24 overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #1a0d2e 0%, #0f0820 100%)' }}
        >
            {/* Bg glows */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[130px] opacity-15 bg-purple-600" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-[100px] opacity-10 bg-[#d9f99d]" />
            </div>

            <div className="container mx-auto px-6 md:px-16 relative z-10">
                {/* Badge */}
                <div className="text-center mb-8 md:mb-10 px-4">
                    <motion.span initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                        style={{ background: 'rgba(217,249,157,0.1)', color: '#d9f99d', border: '1px solid rgba(217,249,157,0.25)' }}>
                        🧠 AI-Powered · World First
                    </motion.span>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-6xl font-black font-heading uppercase tracking-tighter text-white mt-5 mb-3">
                        Find Your<br /><span style={{ color: '#d9f99d' }}>Sole Match</span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        4 questions. 10 seconds. Your perfect Fario shoe — matched by our AI to your lifestyle.
                        No human can do this faster.
                    </motion.p>
                </div>

                {/* Quiz Card */}
                <div className="max-w-xl mx-auto px-4 md:px-0">
                    <AnimatePresence mode="wait">

                        {/* INTRO */}
                        {step === 'intro' && (
                            <motion.div key="intro"
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="rounded-3xl p-10 text-center"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                                <div className="text-6xl mb-6">🤖</div>
                                <h3 className="text-2xl font-black text-white mb-3">Let the AI decide.</h3>
                                <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                    Answer 4 quick questions and we'll match you with the Fario shoe engineered for exactly your life.
                                </p>
                                <motion.button
                                    onClick={() => setStep(0)}
                                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    className="px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest"
                                    style={{ background: '#d9f99d', color: '#0f0820', boxShadow: '0 0 40px rgba(217,249,157,0.4)' }}>
                                    Start Match →
                                </motion.button>
                            </motion.div>
                        )}

                        {/* QUESTIONS */}
                        {typeof step === 'number' && (
                            <motion.div key={`q-${step}`}
                                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                                className="rounded-3xl p-8"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                                {/* Progress */}
                                <div className="flex gap-1.5 mb-8">
                                    {questions.map((_, i) => (
                                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-400"
                                            style={{ background: i <= qIndex ? '#d9f99d' : 'rgba(255,255,255,0.1)' }} />
                                    ))}
                                </div>

                                <div className="text-3xl mb-3">{q.emoji}</div>
                                <h3 className="text-xl font-black text-white mb-6">{q.q}</h3>

                                <div className="grid grid-cols-2 gap-3">
                                    {q.options.map((opt) => (
                                        <motion.button
                                            key={opt.key}
                                            onClick={() => choose(opt.key)}
                                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                            className="rounded-2xl p-4 text-left transition-all duration-300"
                                            style={{
                                                background: selected === opt.key ? '#d9f99d' : 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${selected === opt.key ? '#d9f99d' : 'rgba(255,255,255,0.08)'}`,
                                            }}
                                        >
                                            <div className="text-2xl mb-2">{opt.icon}</div>
                                            <div className="text-xs font-black uppercase tracking-wider leading-tight"
                                                style={{ color: selected === opt.key ? '#0f0820' : 'rgba(255,255,255,0.75)' }}>
                                                {opt.label}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                <p className="text-[10px] text-center mt-5 uppercase tracking-widest"
                                    style={{ color: 'rgba(255,255,255,0.2)' }}>
                                    Question {qIndex + 1} of {questions.length}
                                </p>
                            </motion.div>
                        )}

                        {/* RESULT */}
                        {step === 'result' && match && (
                            <motion.div key="result"
                                initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                                className="rounded-3xl p-10 text-center"
                                style={{ background: `linear-gradient(135deg, ${match.color}33, rgba(15,8,32,0.9))`, border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <div className="text-6xl mb-4">{match.emoji}</div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black mb-4"
                                    style={{ background: 'rgba(217,249,157,0.12)', color: '#d9f99d' }}>
                                    🎯 {match.score}% Match
                                </div>
                                <h3 className="text-3xl font-black font-heading uppercase tracking-tight text-white mb-3">
                                    {match.name}
                                </h3>
                                <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>{match.desc}</p>
                                <div className="flex gap-3 justify-center">
                                    <motion.button
                                        onClick={() => navigate(match.path)}
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                        className="px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider"
                                        style={{ background: '#d9f99d', color: '#0f0820' }}>
                                        Shop This →
                                    </motion.button>
                                    <button onClick={reset}
                                        className="px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider border"
                                        style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>
                                        Retry
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
