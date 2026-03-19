import { useEffect, useState, useRef, useCallback } from 'react';
import { useScroll, useSpring, useTransform, useMotionValue, MotionValue } from 'framer-motion';

// Types for Pro Scroll System
interface ProScrollOptions {
    smooth?: boolean;
    lerp?: number;
    direction?: 'vertical' | 'horizontal';
}

interface ScrollState {
    scrollY: number;
    scrollX: number;
    progress: number;
    velocity: number;
    direction: 'up' | 'down' | 'stopped';
    isScrolling: boolean;
}

/**
 * useProScroll - The Core Engine for the Gemini 3 Pro Homepage.
 * Orchestrates complex scroll-linked animations, velocity tracking,
 * and inertial physics for a high-fidelity feel.
 */
export function useProScroll(_options: ProScrollOptions = { smooth: true, lerp: 0.1, direction: 'vertical' }) {
    // Motion Values for high-performance updates
    const scrollY = useMotionValue(0);
    const scrollX = useMotionValue(0);
    const progress = useMotionValue(0);
    const velocity = useMotionValue(0);

    // React State for lower-frequency logic
    const [scrollState, setScrollState] = useState<ScrollState>({
        scrollY: 0,
        scrollX: 0,
        progress: 0,
        velocity: 0,
        direction: 'stopped',
        isScrolling: false
    });

    // Refs for tracking deltas
    const lastScrollY = useRef(0);
    const lastTimestamp = useRef(0);
    const rafId = useRef<number | null>(null);

    // Framer Motion Hook
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, {
        mass: 0.1,
        stiffness: 100,
        damping: 20,
        restDelta: 0.001
    });

    /**
     * Physics Loop
     * Calculates velocity, direction, and applies inertia.
     */
    const updatePhysics = useCallback((timestamp: number) => {
        const currentScrollY = window.scrollY;
        const deltaY = currentScrollY - lastScrollY.current;
        const deltaTime = timestamp - lastTimestamp.current;

        if (deltaTime > 0) {
            const v = deltaY / deltaTime; // pixels per ms
            velocity.set(v);

            // Update State only if significant change to prevent re-renders
            if (Math.abs(v) > 0.1) {
                setScrollState(prev => ({
                    ...prev,
                    velocity: v,
                    direction: v > 0 ? 'down' : 'up',
                    isScrolling: true
                }));
            } else {
                if (scrollState.isScrolling) {
                    setScrollState(prev => ({ ...prev, isScrolling: false, direction: 'stopped' }));
                }
            }
        }

        lastScrollY.current = currentScrollY;
        lastTimestamp.current = timestamp;

        // Sync MotionValues
        scrollY.set(currentScrollY);
        progress.set(currentScrollY / (document.body.scrollHeight - window.innerHeight));

        rafId.current = requestAnimationFrame(updatePhysics);
    }, [scrollState.isScrolling, velocity, scrollY, progress]);

    // Initialize Physics Loop
    useEffect(() => {
        rafId.current = requestAnimationFrame(updatePhysics);
        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [updatePhysics]);


    /**
     * Parallax Calculator
     * Returns a transform that moves an element at a different speed.
     */
    const useParallax = (value: MotionValue<number>, distance: number) => {
        return useTransform(value, [0, 1], [0, -distance]);
    };

    /**
     * Scroll Trigger
     * Returns true when an element enters a specific viewport threshold.
     */
    const useInView = (ref: React.RefObject<HTMLElement>, threshold: number = 0.5) => {
        const [isInView, setIsInView] = useState(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    setIsInView(entry.isIntersecting);
                },
                { threshold }
            );

            if (ref.current) {
                observer.observe(ref.current);
            }

            return () => {
                if (ref.current) observer.unobserve(ref.current);
            };
        }, [ref, threshold]);

        return isInView;
    };

    return {
        scrollY,
        scrollX,
        progress: smoothProgress,
        velocity,
        scrollState,
        useParallax,
        useInView
    };
}
