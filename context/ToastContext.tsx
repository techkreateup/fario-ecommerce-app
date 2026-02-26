import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: {
        success: (msg: string) => void;
        error: (msg: string) => void;
        info: (msg: string) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const contextValue = {
        toast: {
            success: (msg: string) => addToast(msg, 'success'),
            error: (msg: string) => addToast(msg, 'error'),
            info: (msg: string) => addToast(msg, 'info'),
        },
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-[90%] md:max-w-md">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 40, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.2 } }}
                            layout
                            className={`pointer-events-auto relative overflow-hidden backdrop-blur-xl text-white px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-4 border ${t.type === 'success' ? 'bg-emerald-900/90 border-emerald-800/50' :
                                    t.type === 'error' ? 'bg-rose-900/90 border-rose-800/50' :
                                        'bg-gray-900/95 border-gray-700/50'
                                }`}
                        >
                            <div className={`shrink-0 p-1.5 rounded-full ${t.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                                    t.type === 'error' ? 'bg-rose-500/20 text-rose-400' :
                                        'bg-blue-500/20 text-blue-400'
                                }`}>
                                {t.type === 'success' && <CheckCircle2 size={24} />}
                                {t.type === 'error' && <AlertCircle size={24} />}
                                {t.type === 'info' && <Info size={24} />}
                            </div>

                            <p className="text-[15px] font-medium flex-1 leading-snug tracking-wide">{t.message}</p>

                            <button
                                onClick={() => removeToast(t.id)}
                                className="shrink-0 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>

                            {/* Animated Progress Bar */}
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: 4, ease: 'linear' }}
                                className={`absolute bottom-0 left-0 h-1 ${t.type === 'success' ? 'bg-emerald-500' :
                                        t.type === 'error' ? 'bg-rose-500' :
                                            'bg-blue-500'
                                    }`}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context.toast;
};
