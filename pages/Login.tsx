import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { logAction } from '../services/logService';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';

export default function Login() {
    const navigate = useNavigate();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'input' | 'verify'>('input');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !name || !phone) {
            setError('All fields are required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Invalid email format');
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            setError('Phone must be 10 digits');
            return;
        }

        setLoading(true);

        // --- MOCK TESTING BYPASS ---
        if (email === 'user@fario.com' || email === 'scout.01@google.com' || email === 'test@example.com') {
            setTimeout(() => {
                toast.success(`Mock OTP sent to ${email}! (Use 123456)`);
                setStep('verify');
                setLoading(false);
            }, 500);
            return;
        }
        // ---------------------------

        try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    data: {
                        name,
                        phone
                    },
                    shouldCreateUser: true
                }
            });

            if (otpError) throw otpError;

            toast.success(`OTP sent to ${email}!`);
            setStep('verify');
        } catch (err: any) {
            console.error('OTP send error:', err);
            setError(err.message || 'Failed to send OTP');
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!/^[0-9]{6,8}$/.test(otp)) {
            setError('OTP must be 6-8 digits');
            return;
        }

        setLoading(true);

        // --- MOCK TESTING BYPASS ---
        if ((email === 'user@fario.com' || email === 'scout.01@google.com' || email === 'test@example.com') && otp === '123456') {
            setTimeout(() => {
                const mockUser = {
                    id: 'mock-user-' + Date.now(),
                    email: email,
                    user_metadata: { name, phone }
                };
                localStorage.setItem('sb-mock-auth-token', JSON.stringify({
                    access_token: 'mock-jwt-token-123',
                    user: mockUser
                }));
                toast.success(`Welcome back, ${name}`);
                setLoading(false);
                navigate('/profile');
                window.location.reload(); // Force context refresh
            }, 1000);
            return;
        }
        // ---------------------------

        try {
            const verifyResult = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email'
            });

            const { data, error: verifyError } = verifyResult;

            if (verifyError) throw verifyError;

            if (data.user) {
                const isAdminEmail = data.user.email?.toLowerCase() === 'reachkreateup@gmail.com' || data.user.email?.toLowerCase() === 'kreateuptech@gmail.com';

                const { error: upsertError } = await supabase.from('profiles').upsert({
                    id: data.user.id,
                    email: data.user.email,
                    name: name,
                    phone: phone,
                    role: isAdminEmail ? 'admin' : 'user',
                    updatedat: new Date().toISOString()
                }, { onConflict: 'id' });

                if (upsertError) console.error("Profile upsert failed:", upsertError);

                toast.success(`Welcome back, ${name}`);
                await logAction('user_login', { email: data.user.email });

                if (isAdminEmail) {
                    window.location.href = '/#/admin/dashboard';
                } else {
                    navigate('/profile');
                }
            }
        } catch (err: any) {
            console.error('OTP verify error:', err);
            setError(err.message || 'Invalid OTP');
            toast.error('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden font-sans">

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-6 md:p-10 relative z-10 border border-slate-100"
            >
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="mb-5 p-3.5 rounded-3xl bg-slate-50/50 border border-slate-100 shadow-sm">
                        <Logo size={48} className="mix-blend-multiply" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-1.5 tracking-tight">FARIO REGISTRY</h1>
                    <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                        {step === 'input' ? 'Authorize Secure Access' : 'Enter Verification Node'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'input' ? (
                        <motion.form
                            key="input-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleSendOTP}
                            className="space-y-4"
                        >
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        Email Registry
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors w-4 h-4" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm group-focus-within:shadow-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        Legal Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors w-4 h-4" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm group-focus-within:shadow-md"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                                        Contact Link (10 digits)
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors w-4 h-4" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            placeholder="10-digit mobile number"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 text-sm font-medium placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm group-focus-within:shadow-md"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-red-500 text-xs font-semibold bg-red-50 p-3 rounded-xl flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !email || !name || phone.length !== 10}
                                className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-600/20 mt-5 group hover:shadow-2xl hover:shadow-purple-600/30"
                            >
                                {loading ? 'Processing...' : 'Generate Access Key'}
                                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="verify-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleVerifyOTP}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 mb-1 border border-purple-100">
                                    <Mail className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Check your inbox</h3>
                                    <p className="text-slate-500 text-xs mt-1 font-medium">
                                        Code sent to <span className="font-bold text-slate-900">{email}</span>
                                    </p>
                                </div>

                                <div className="pt-1">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                        className="w-full px-4 py-5 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 text-center text-3xl font-black tracking-[0.4em] placeholder-slate-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-sm"
                                        placeholder="000000"
                                        maxLength={8}
                                        autoFocus
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-xs font-semibold bg-red-50 p-3 rounded-xl text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-600/20 hover:shadow-2xl hover:shadow-purple-600/30"
                                >
                                    {loading ? 'Validating...' : 'Authorize Session'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('input');
                                        setOtp('');
                                        setError('');
                                    }}
                                    className="w-full py-2.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-purple-600 transition-colors"
                                >
                                    ← Change Email
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        No password required • Secure OTP
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
