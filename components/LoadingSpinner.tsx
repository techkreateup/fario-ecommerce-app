import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    fullScreen?: boolean;
    message?: string;
    className?: string;
    color?: string;
}

const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    fullScreen = false,
    message,
    className = '',
    color = 'currentColor'
}) => {
    const spinnerSize = sizeMap[size];

    const content = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <Loader2
                size={spinnerSize}
                color={color}
                className="animate-spin"
            />
            {message && (
                <p className="text-sm font-medium text-gray-500 animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return content;
};

export default LoadingSpinner;
