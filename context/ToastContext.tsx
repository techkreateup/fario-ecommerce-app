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
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            layout
                            className="pointer-events-auto min-w-[300px] bg-gray-900/95 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10"
                        >
                            <div className={`shrink-0 ${t.type === 'success' ? 'text-green-400' : t.type === 'error' ? 'text-rose-400' : 'text-blue-400'}`}>
                                {t.type === 'success' && <CheckCircle2 size={20} />}
                                {t.type === 'error' && <AlertCircle size={20} />}
                                {t.type === 'info' && <Info size={20} />}
                            </div>
                            <p className="text-sm font-medium flex-1">{t.message}</p>
                            <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
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
