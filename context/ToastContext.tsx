import React, { createContext, useContext, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
    toast: {
        success: (msg: string) => void;
        error: (msg: string) => void;
        info: (msg: string) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    // Maintain the interface so other components calling toast.success() do not crash the app,
    // but we strictly do not render any visual UI for it based on client request.
    const addToast = useCallback((message: string, type: ToastType) => {
        console.log(`[Toast hidden] ${type}: ${message}`);
    }, []);

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
            {/* The visual UI (AnimatePresence, motion.div) has been completely removed */}
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
