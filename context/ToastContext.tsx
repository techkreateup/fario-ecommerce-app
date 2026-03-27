import React, { createContext, useContext, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
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
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev.slice(-2), { id, message, type }]); // Keep last 3

        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

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
            
            {/* GLOBAL TOAST CONTAINER */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 w-full max-w-xs md:max-w-md pointer-events-none px-4">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                                flex items-center gap-3 px-5 py-3.5 rounded-full shadow-2xl border backdrop-blur-xl transition-all duration-300
                                ${t.type === 'success' 
                                    ? 'bg-white/90 border-fario-purple/20 text-gray-900 shadow-fario-purple/5' 
                                    : t.type === 'error' 
                                        ? 'bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-500/5' 
                                        : 'bg-white/90 border-gray-200 text-gray-900 shadow-gray-400/5'}
                            `}>
                                <div className={`
                                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                                    ${t.type === 'success' 
                                        ? 'bg-fario-purple/10 text-fario-purple' 
                                        : t.type === 'error' 
                                            ? 'bg-rose-100 text-rose-600' 
                                            : 'bg-gray-100 text-gray-600'}
                                `}>
                                    {t.type === 'success' && <CheckCircle2 size={18} strokeWidth={2.5} />}
                                    {t.type === 'error' && <XCircle size={18} strokeWidth={2.5} />}
                                    {t.type === 'info' && <Info size={18} strokeWidth={2.5} />}
                                </div>
                                
                                <p className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                                    {t.message}
                                </p>

                                <button 
                                    onClick={() => removeToast(t.id)}
                                    className="ml-2 hover:bg-black/5 p-1 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                                >
                                    <X size={14} strokeWidth={3} />
                                </button>
                            </div>
                            
                            {/* Milky Gradient Glow */}
                            <div className={`
                                absolute -inset-0.5 -z-10 rounded-full blur-md opacity-20 pointer-events-none
                                ${t.type === 'success' ? 'bg-fario-purple' : t.type === 'error' ? 'bg-rose-500' : 'bg-gray-400'}
                            `} />
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
