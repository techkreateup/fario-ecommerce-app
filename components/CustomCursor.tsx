import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clicks, setClicks] = useState<{ x: number; y: number; id: number }[]>([]);

  // Mouse position state (using motion values for performance)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics for the trailing circle
  // Slightly increased stiffness for a more responsive, premium feel
  const springConfig = { damping: 35, stiffness: 900, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Optimization: Only run custom cursor logic on desktop
    if (window.matchMedia("(max-width: 768px)").matches) return;

    // 1. Mouse Move Handler
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    // 2. Click/Touch Handler for Ripple Effect
    const handleClick = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      if ('touches' in e) {
        // Touch logic not strict necessary here if we block mobile, but good for hybrid
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const id = Date.now();
      setClicks((prev) => [...prev, { x: clientX, y: clientY, id }]);

      // Cleanup click after animation
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
      }, 800);
    };

    // 3. Hover Detection for Interactive Elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Optimization: Quick tag check before expensive heavy DOM traversal
      if (target.tagName === 'DIV' || target.tagName === 'SECTION' || target.tagName === 'MAIN') {
        // Check strictly for cursor-pointer class to avoid deep traversal
        if (target.classList.contains('cursor-pointer')) {
          setIsHovering(true);
          return;
        }
      }

      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.cursor-pointer') ||
        target.getAttribute('role') === 'button';

      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleClick);
    // window.addEventListener('touchstart', handleClick); // Removed touch for desktop-only cursor
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleClick);
      // window.removeEventListener('touchstart', handleClick);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // Cast motion components to any to bypass prop errors
  const MotionDiv = (motion as any).div;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">

      {/* --- PRIMARY DOT --- */}
      <MotionDiv
        className="hidden md:block absolute top-0 left-0 mix-blend-difference"
        style={{ x: cursorX, y: cursorY, transform: 'translate(-50%, -50%)' } as any}
      >
        <MotionDiv
          // Added a subtle drop-shadow to define the dot even if blend mode is low contrast
          className="h-2 w-2 bg-white rounded-full shadow-[0_0_1px_rgba(0,0,0,0.5)]"
          animate={{ scale: isHovering ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </MotionDiv>

      {/* --- SECONDARY TRAILING RING --- */}
      <MotionDiv
        className="hidden md:block absolute top-0 left-0 mix-blend-difference"
        style={{ x: cursorXSpring, y: cursorYSpring, transform: 'translate(-50%, -50%)' } as any}
      >
        <MotionDiv
          // Added shadow and border-opacity logic to prevent "mingling"
          className="rounded-full border border-white/90 shadow-[0_0_2px_rgba(0,0,0,0.2)]"
          animate={{
            height: isHovering ? 84 : 36,
            width: isHovering ? 84 : 36,
            backgroundColor: isHovering ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)',
            borderWidth: isHovering ? '1px' : '1.5px',
            opacity: isVisible ? 1 : 0
          }}
          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        />
      </MotionDiv>


      {/* --- CLICK/TOUCH RIPPLES --- */}
      <AnimatePresence>
        {clicks.map((click) => (
          <MotionDiv
            key={click.id}
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute rounded-full border border-fario-purple/30 bg-fario-purple/10"
            style={{
              top: click.y,
              left: click.x,
              width: 40,
              height: 40,
              transform: 'translate(-50%, -50%)'
            } as any}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CustomCursor;