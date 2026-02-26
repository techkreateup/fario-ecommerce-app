import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ── CONFIG ──────────────────────────────────────────────────────────────────
const SPIN_DATE_KEY = 'fario_last_spin_date';
const SPIN_RESULT_KEY = 'fario_spin_result';

const SLOTS = [
    { id: 0, label: '5% OFF', emoji: '🎯', color: '#7C3AED', text: '#fff', isWin: true },
    { id: 1, label: 'Try Again', emoji: '🔄', color: '#1a0d2e', text: '#d9f99d', isWin: false },
    { id: 2, label: 'FREE BAG', emoji: '🎒', color: '#d9f99d', text: '#0e3039', isWin: true },
    { id: 3, label: 'Try Again', emoji: '🔄', color: '#2d1459', text: '#a78bfa', isWin: false },
    { id: 4, label: 'Try Again', emoji: '🔄', color: '#1a0d2e', text: '#d9f99d', isWin: false },
    { id: 5, label: '₹200 OFF', emoji: '💸', color: '#4C1D95', text: '#fff', isWin: false },
    { id: 6, label: 'Try Again', emoji: '🔄', color: '#2d1459', text: '#a78bfa', isWin: false },
    { id: 7, label: 'Try Again', emoji: '🔄', color: '#0f0820', text: '#d9f99d', isWin: false },
    { id: 8, label: '10% OFF', emoji: '💰', color: '#5B21B6', text: '#fff', isWin: false },
    { id: 9, label: 'Try Again', emoji: '🔄', color: '#1a0d2e', text: '#a78bfa', isWin: false },
];
const WIN_INDICES = [0, 2]; // 5% OFF and FREE BAG
const LOSS_INDICES = [1, 3, 4, 6, 7, 9];
const SEG = 360 / SLOTS.length;

const todayStr = () => new Date().toISOString().split('T')[0];

const hasSpunToday = () => {
    try { return localStorage.getItem(SPIN_DATE_KEY) === todayStr(); } catch { return false; }
};
const markSpunToday = (result: string) => {
    try {
        localStorage.setItem(SPIN_DATE_KEY, todayStr());
        localStorage.setItem(SPIN_RESULT_KEY, result);
    } catch { }
};

const pickSlot = (): number => {
    // 20% chance to win each day
    const win = Math.random() < 0.2;
    if (win) return WIN_INDICES[Math.floor(Math.random() * WIN_INDICES.length)];
    return LOSS_INDICES[Math.floor(Math.random() * LOSS_INDICES.length)];
};

// Rotation so pointer (top-center) lands on slotIdx
const targetRotation = (slotIdx: number, base: number): number => {
    // Slot 0 starts at 12 o'clock when rotation=0
    // We need the centre of slotIdx to be under the pointer (top = 270° in math)
    const centreAngle = slotIdx * SEG + SEG / 2;
    const spins = 5 + Math.floor(Math.random() * 3);
    return base + spins * 360 + (360 - centreAngle);
};

// ── CANVAS WHEEL ─────────────────────────────────────────────────────────────
const WheelCanvas: React.FC<{ rotation: number }> = ({ rotation }) => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const c = ref.current; if (!c) return;
        const ctx = c.getContext('2d'); if (!ctx) return;
        const S = c.width, cx = S / 2, cy = S / 2, r = S / 2 - 6;
        ctx.clearRect(0, 0, S, S);
        const rot = (rotation * Math.PI) / 180;

        SLOTS.forEach((sl, i) => {
            const a0 = rot + (i * 2 * Math.PI) / SLOTS.length;
            const a1 = rot + ((i + 1) * 2 * Math.PI) / SLOTS.length;
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.closePath();
            ctx.fillStyle = sl.color; ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1.5; ctx.stroke();
            // Label
            ctx.save(); ctx.translate(cx, cy); ctx.rotate(a0 + Math.PI / SLOTS.length);
            ctx.textAlign = 'right'; ctx.fillStyle = sl.text;
            ctx.font = `bold ${S * 0.031}px Inter,sans-serif`;
            ctx.fillText(`${sl.emoji} ${sl.label}`, r - 14, 4.5);
            ctx.restore();
        });

        // Outer ring glow
        const grad = ctx.createLinearGradient(0, 0, S, S);
        grad.addColorStop(0, 'rgba(217,249,157,0.25)');
        grad.addColorStop(1, 'rgba(124,58,237,0.25)');
        ctx.beginPath(); ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
        ctx.strokeStyle = grad; ctx.lineWidth = 3; ctx.stroke();

        // Centre hub
        ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0820'; ctx.fill();
        ctx.strokeStyle = '#d9f99d'; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.fillStyle = '#d9f99d';
        ctx.font = `black ${S * 0.055}px Inter,sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('F', cx, cy);
    }, [rotation]);

    return <canvas ref={ref} width={460} height={460} className="w-full max-w-[420px]" />;
};

// ── NEEDLE ────────────────────────────────────────────────────────────────────
const Needle = () => (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-[0_0_10px_rgba(217,249,157,0.9)]">
        <svg width="28" height="44" viewBox="0 0 28 44" fill="none">
            <polygon points="14,2 26,42 14,34 2,42" fill="#d9f99d" stroke="#0f0820" strokeWidth="1.5" />
            <circle cx="14" cy="36" r="5" fill="#0f0820" stroke="#d9f99d" strokeWidth="2" />
        </svg>
    </div>
);

// ── MAIN ─────────────────────────────────────────────────────────────────────
export const HomeSpinWheel: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<typeof SLOTS[0] | null>(null);
    const [done, setDone] = useState(hasSpunToday());
    const [showModal, setShowModal] = useState(false);

    const spin = useCallback(() => {
        if (!user || spinning || done) return;
        const idx = pickSlot();
        const slot = SLOTS[idx];
        const finalRot = targetRotation(idx, rotation);
        setSpinning(true);
        setShowModal(false);
        setRotation(finalRot);
        setTimeout(() => {
            markSpunToday(slot.label);
            setSpinning(false);
            setDone(true);
            setResult(slot);
            setShowModal(true);
        }, 4800);
    }, [user, spinning, done, rotation]);

    const isLocked = !user || done;
    const lockReason = !user ? 'Sign in to spin' : 'Come back tomorrow!';
    const lockEmoji = !user ? '🔒' : '✅';

    return (
        <section className="relative py-12 md:py-20 overflow-hidden bg-[#0f0820]">
            {/* Glow bg */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 bg-purple-700" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-[100px] opacity-12 bg-[#d9f99d]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.span initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5"
                        style={{ background: 'rgba(217,249,157,0.1)', color: '#d9f99d', border: '1px solid rgba(217,249,157,0.25)' }}>
                        🎰 Daily Lucky Spin
                    </motion.span>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black font-heading uppercase tracking-tighter text-white mb-3">
                        Spin & Win
                    </motion.h2>
                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-sm max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {user ? '1 free spin per day. 2 in 10 people win a real prize.' : 'Sign in to unlock your daily free spin.'}
                    </motion.p>
                </div>

                {/* Wheel + Panel */}
                <div className="flex flex-col xl:flex-row items-center justify-center gap-8 md:gap-14">

                    {/* Wheel */}
                    <div className="relative">
                        <Needle />
                        {/* Outer glow ring */}
                        <div className="absolute rounded-full z-0"
                            style={{
                                inset: '-10px',
                                background: 'conic-gradient(from 0deg, #7C3AED55, #d9f99d55, #5B21B655, #d9f99d55, #7C3AED55)',
                                borderRadius: '50%',
                                filter: spinning ? 'blur(4px)' : 'blur(1px)',
                                transition: 'filter 0.4s',
                            }} />
                        <div className="absolute rounded-full bg-[#0f0820] z-10" style={{ inset: '-2px', borderRadius: '50%' }} />

                        <motion.div
                            animate={{ rotate: rotation }}
                            transition={{ duration: 4.6, ease: [0.12, 0.05, 0.05, 1.0] }}
                            className="relative z-20"
                            style={{ width: 'min(380px, 88vw)', height: 'min(380px, 88vw)' }}
                        >
                            <WheelCanvas rotation={0} />
                        </motion.div>
                    </div>

                    {/* Right panel */}
                    <div className="flex flex-col items-center xl:items-start gap-5 w-full max-w-xs md:max-w-sm px-4 xl:px-0">

                        {/* Spin / Lock button */}
                        {isLocked ? (
                            <div className="w-full rounded-2xl p-5 text-center border border-white/10"
                                style={{ background: 'rgba(255,255,255,0.04)' }}>
                                <div className="text-4xl mb-3">{lockEmoji}</div>
                                <p className="text-white font-black text-sm mb-1">{lockReason}</p>
                                {!user && (
                                    <button onClick={() => navigate('/login')}
                                        className="mt-3 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:scale-105 transition-transform"
                                        style={{ background: '#d9f99d', color: '#0f0820' }}>
                                        Sign In Free →
                                    </button>
                                )}
                            </div>
                        ) : (
                            <motion.button
                                onClick={spin} disabled={spinning}
                                whileHover={{ scale: spinning ? 1 : 1.04 }}
                                whileTap={{ scale: spinning ? 1 : 0.96 }}
                                className="w-full py-5 px-8 rounded-2xl font-black text-base uppercase tracking-widest transition-all"
                                style={{
                                    background: spinning ? 'rgba(217,249,157,0.3)' : '#d9f99d',
                                    color: '#0f0820',
                                    boxShadow: spinning ? 'none' : '0 0 50px rgba(217,249,157,0.5)',
                                    cursor: spinning ? 'not-allowed' : 'pointer',
                                }}>
                                {spinning ? '🎰 Spinning...' : '🎯 SPIN NOW'}
                            </motion.button>
                        )}

                        {/* Prize board */}
                        <div className="w-full rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                            <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>🏆 Prize Board</p>
                            {SLOTS.filter(s => s.isWin).map(s => (
                                <div key={s.id} className="flex items-center gap-3 mb-3">
                                    <span className="text-xl">{s.emoji}</span>
                                    <span className="text-sm font-bold text-white">{s.label}</span>
                                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-black"
                                        style={{ background: 'rgba(217,249,157,0.15)', color: '#d9f99d' }}>Win ✓</span>
                                </div>
                            ))}
                            <p className="text-[10px] mt-3" style={{ color: 'rgba(255,255,255,0.18)' }}>2 in 10 spins win a real prize · 1 spin/day</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Modal */}
            <AnimatePresence>
                {showModal && result && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6"
                        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.6, y: 40 }} animate={{ scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                            className="rounded-3xl p-10 text-center max-w-sm w-full relative"
                            style={{
                                background: result.isWin ? 'linear-gradient(135deg,#1a0d2e,#2d1459)' : 'linear-gradient(135deg,#0f0820,#1a0d2e)',
                                border: `2px solid ${result.isWin ? '#d9f99d' : 'rgba(255,255,255,0.1)'}`,
                                boxShadow: result.isWin ? '0 0 80px rgba(217,249,157,0.3)' : '0 24px 60px rgba(0,0,0,0.6)',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-6xl mb-4">{result.isWin ? '🎉' : '😅'}</div>
                            <h3 className="text-2xl font-black text-white mb-2">
                                {result.isWin ? 'You Won!' : 'Not today!'}
                            </h3>
                            <p className="font-black text-lg mb-1" style={{ color: result.isWin ? '#d9f99d' : 'rgba(255,255,255,0.4)' }}>
                                {result.isWin ? result.label : 'Better luck tomorrow 🤞'}
                            </p>
                            {result.isWin && (
                                <p className="text-xs text-white/40 mb-6 mt-2">
                                    Your coupon code has been saved. Apply at checkout.
                                </p>
                            )}
                            <button onClick={() => setShowModal(false)}
                                className="mt-4 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                style={{ background: result.isWin ? '#d9f99d' : 'rgba(255,255,255,0.1)', color: result.isWin ? '#0f0820' : '#fff' }}>
                                {result.isWin ? '🛒 Shop Now' : 'Close'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
