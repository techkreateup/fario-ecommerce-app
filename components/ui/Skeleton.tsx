import React from 'react';

interface SkeletonProps {
    className?: string;
    count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
    return (
        <div className="animate-pulse flex flex-col gap-2">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`bg-gray-700/50 rounded ${className}`}
                ></div>
            ))}
        </div>
    );
};
