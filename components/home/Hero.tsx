import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ASSETS } from '../../constants';
import Button from '../Button';
import Logo from '../Logo';
import * as RouterDOM from 'react-router-dom';

// Fix missing NavLink in react-router-dom
const { NavLink } = RouterDOM as any;

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 100]);
  const rotateParallax = useTransform(scrollY, [0, 500], [0, 15]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      originalX: number;
      originalY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.originalX = this.x;
        this.originalY = this.y;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        const colors = ['rgba(255,255,255,0.3)', 'rgba(217,249,157,0.2)', 'rgba(122,81,160,0.15)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        else if (this.y < 0) this.y = canvas!.height;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 2;
          const directionY = forceDirectionY * force * 2;

          this.x -= directionX;
          this.y -= directionY;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Cast to any to bypass prop errors
  const MotionDiv = (motion as any).div;
  const MotionImg = (motion as any).img;

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">

      {/* LEFT SIDE - DARK / CINEMATIC CONTENT */}
      <div className="w-full lg:w-[45%] bg-fario-dark relative flex flex-col justify-center items-center min-h-[60vh] lg:min-h-screen z-10 overflow-hidden group">

        {/* Cinematic Background Layer */}
        <div className="absolute inset-0 z-[0] bg-fario-dark overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(122,81,160,0.15),transparent_70%)]" />
          <MotionDiv
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-[50%] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(14,48,57,1)_0deg,rgba(122,81,160,0.05)_120deg,rgba(14,48,57,1)_360deg)] opacity-30"
          />
        </div>

        {/* Interactive Canvas Background Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-[1]"
        />

        {/* Background Patterns */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-[1]" />
        <div className="absolute top-10 left-10 text-9xl font-semibold font-heading text-outline-white opacity-10 select-none rotate-90 origin-top-left whitespace-nowrap z-0 tracking-widest uppercase">
          Step In. Stand Out.
        </div>

        {/* Main Product Hero Asset */}
        <MotionDiv
          className="relative z-20 w-[80%] max-w-lg"
          style={{ y: yParallax, rotate: rotateParallax } as any}
        >
          <MotionDiv
            className="absolute inset-0 bg-fario-purple/30 blur-[100px] rounded-full scale-110"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <MotionImg
            src={ASSETS.heroShoe}
            alt="Hero Shoe"
            onError={(e) => {
              console.error('Failed to load Hero Shoe image:', ASSETS.heroShoe);
              (e.target as HTMLImageElement).style.opacity = '0.2';
            }}
            className="w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            initial={{ scale: 0.8, opacity: 0, y: 50, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: -15 }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
          />
        </MotionDiv>

        {/* Left CTA */}
        <div className="absolute bottom-10 left-10 z-20">
          <NavLink to="/contact" className="flex items-center gap-3 text-white group">
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-fario-dark transition-all">
              ↗
            </div>
            <span className="font-semibold tracking-wider">Contact Us</span>
          </NavLink>
        </div>
      </div>

      {/* TORN PAPER DIVIDER */}
      <div className="absolute left-0 lg:left-[44.9%] top-0 bottom-0 z-30 w-16 hidden lg:block pointer-events-none h-full">
        <svg className="h-[105%] w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M30,0 L60,5 L30,10 L70,15 L30,20 L65,25 L35,30 L75,35 L30,40 L65,45 L35,50 L70,55 L30,60 L65,65 L35,70 L70,75 L30,80 L75,85 L35,90 L65,95 L30,100 V0 Z" fill="#ffffff" transform="scale(1.5, 1)" />
        </svg>
      </div>

      {/* Mobile Tear */}
      <div className="w-full h-12 bg-white -mt-6 relative z-20 lg:hidden clip-path-jagged-top"></div>

      {/* RIGHT SIDE - CONTENT */}
      <div className="w-full lg:w-[55%] bg-white relative flex flex-col justify-center px-8 lg:px-20 pt-32 pb-20 z-10">
        <div className="absolute inset-0 bg-topo-pattern opacity-40 pointer-events-none" />

        <MotionDiv
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="px-4 py-1 bg-fario-dark text-white text-xs font-bold uppercase tracking-widest rounded-sm font-heading">New Collection</span>
            <div className="h-0.5 bg-gray-200 w-16"></div>
          </div>

          <h1 className="text-6xl lg:text-7xl font-semibold font-heading text-fario-dark leading-[0.9] mb-6 tracking-tighter">
            WALK ON <br />
            <span className="text-outline">AIR.</span> <br />
            <span className="text-fario-purple italic font-light">DESIGN ON POINT.</span>
          </h1>

          <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed font-medium">
            We stripped away the noise to reveal the essence. Fario isn't just a shoe; it's a statement of clarity in a chaotic world. Handcrafted sustainable materials, zero branding, pure aesthetic.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <NavLink to="/products">
              <Button variant="primary" className="!px-10 !py-4 text-lg shadow-[8px_8px_0px_rgba(14,48,57,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all border-2 border-fario-dark font-heading">
                Shop the Collection
              </Button>
            </NavLink>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" />
                </div>
              ))}
            </div>
          </div>
        </MotionDiv>

        {/* Decorative elements */}
        <MotionDiv className="absolute bottom-10 right-10 w-40 h-40 border-2 border-dashed border-gray-300 rounded-full animate-spin-slow pointer-events-none" />
        <MotionDiv
          className="absolute bottom-[-50px] right-[-50px] w-64 h-64 opacity-50 lg:opacity-100"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1 }}
        >
          <img
            src={ASSETS.products.shoe2}
            onError={(e) => {
              console.error('Failed to load decorative shoe image:', ASSETS.products.shoe2);
              (e.target as HTMLImageElement).style.opacity = '0.2';
            }}
            className="w-full h-full object-contain rotate-12 mix-blend-multiply"
            alt="Decoration"
          />
        </MotionDiv>
      </div>

    </section>
  );
};

export default Hero;