import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastItemProps {
    toast: Toast;
    onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
    const icons = {
        success: <CheckCircle size={20} className="text-green-600" strokeWidth={2.5} />,
        error: <XCircle size={20} className="text-red-600" strokeWidth={2.5} />,
        warning: <AlertCircle size={20} className="text-orange-600" strokeWidth={2.5} />,
        info: <Info size={20} className="text-blue-600" strokeWidth={2.5} />
    };

    const styles = {
        success: 'bg-green-50 border-green-200 text-green-900',
        error: 'bg-red-50 border-red-200 text-red-900',
        warning: 'bg-orange-50 border-orange-200 text-orange-900',
        info: 'bg-blue-50 border-blue-200 text-blue-900'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm ${styles[toast.type]} min-w-[300px] max-w-md`}
        >
            <div className="flex-shrink-0">
                {icons[toast.type]}
            </div>
            <p className="flex-1 text-sm font-bold tracking-wide">
                {toast.message}
            </p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
                aria-label="Dismiss"
            >
                <X size={16} strokeWidth={2.5} />
            </button>
        </motion.div>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
    return (
        <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onDismiss={onDismiss} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};
