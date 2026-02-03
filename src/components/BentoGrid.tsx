import { useRef, useState, useEffect, forwardRef } from "react";
import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Shield, Bell, Zap } from "lucide-react";
import TextReveal from "./TextReveal";

// 3D Tilt Card Component
const TiltCard = forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = "" }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const [isHovered, setIsHovered] = useState(false);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
      stiffness: 300,
      damping: 30,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
      stiffness: 300,
      damping: 30,
    });

    const handleMouseMove = (e: React.MouseEvent) => {
      const element = typeof ref === 'object' && ref?.current ? ref.current : null;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <motion.div
        ref={internalRef}
        className={`relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden ${className}`}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
});
TiltCard.displayName = "TiltCard";

// Speed Card - Counting Animation
const SpeedCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = 0.2;
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = end / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView]);

  return (
    <TiltCard className="md:col-span-8 col-span-1 p-8 flex flex-col justify-between">
      <div ref={ref} className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-cyber-lime" />
          <span className="text-sm text-muted-foreground font-inter uppercase tracking-wider">
            Lightning Fast
          </span>
        </div>
        <div className="font-clash text-[8rem] md:text-[12rem] font-bold leading-none text-foreground">
          {count.toFixed(1)}
          <span className="text-cyber-lime">s</span>
        </div>
        <p className="text-muted-foreground font-inter text-lg mt-4">
          Average scrape speed across all retailers
        </p>
      </div>
    </TiltCard>
  );
};

// Security Card - Pulsing Shield
const SecurityCard = () => {
  return (
    <TiltCard className="md:col-span-4 col-span-1 p-8 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full bg-cyber-lime/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ width: 120, height: 120, left: -10, top: -10 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-cyber-lime/10 blur-2xl"
          animate={{
            scale: [1.2, 1.5, 1.2],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{ width: 140, height: 140, left: -20, top: -20 }}
        />
        
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Shield className="w-24 h-24 text-cyber-lime relative z-10" strokeWidth={1.5} />
        </motion.div>
      </div>
      <p className="text-foreground font-clash text-xl mt-6 text-center">
        Bank-Grade Security
      </p>
      <p className="text-muted-foreground font-inter text-sm text-center mt-2">
        256-bit encryption
      </p>
    </TiltCard>
  );
};

// Price History Card - SVG Path Animation
const PriceHistoryCard = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const isInView = useInView(pathRef, { once: true, margin: "-100px" });

  // Mock price data points
  const path = "M 10 180 Q 50 150 80 160 T 150 120 T 220 140 T 290 80 T 360 100 T 430 40";

  return (
    <TiltCard className="md:col-span-4 md:row-span-2 col-span-1 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyber-lime animate-pulse" />
        <span className="text-sm text-muted-foreground font-inter uppercase tracking-wider">
          Price Tracking
        </span>
      </div>
      
      <div className="flex-1 relative">
        <svg 
          viewBox="0 0 450 200" 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 50, 100, 150, 200].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="450"
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 4"
            />
          ))}
          
          {/* Main path with draw animation */}
          <motion.path
            ref={pathRef}
            d={path}
            fill="none"
            stroke="hsl(var(--cyber-lime))"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          
          {/* Gradient fill under the line */}
          <motion.path
            d={`${path} L 430 200 L 10 200 Z`}
            fill="url(#priceGradient)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          />
          
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--cyber-lime))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--cyber-lime))" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Price labels */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between text-xs text-muted-foreground font-mono">
          <span>Jan</span>
          <span>Mar</span>
          <span>Jun</span>
          <span>Sep</span>
          <span>Dec</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-clash font-bold text-foreground">-34%</span>
          <span className="text-sm text-cyber-lime">↓ This Year</span>
        </div>
      </div>
    </TiltCard>
  );
};

// Alerts Card - Notification Animation
const AlertsCard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowNotification(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <TiltCard className="md:col-span-8 col-span-1 p-8 relative" ref={cardRef}>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-cyber-lime" />
          <span className="text-sm text-muted-foreground font-inter uppercase tracking-wider">
            Instant Alerts
          </span>
        </div>
        
        <h3 className="font-clash text-3xl md:text-4xl font-bold text-foreground mb-2">
          Never Miss a Deal
        </h3>
        <p className="text-muted-foreground font-inter text-lg max-w-md">
          Get real-time notifications when prices drop on your tracked items
        </p>
      </div>

      {/* Mac-style notification */}
      <motion.div
        className="absolute top-4 right-4 w-80 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl"
        initial={{ x: 100, opacity: 0, scale: 0.8 }}
        animate={showNotification ? { x: 0, opacity: 1, scale: 1 } : { x: 100, opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyber-lime/20 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-cyber-lime" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground font-inter">KartHive Alert</p>
            <p className="text-xs text-muted-foreground font-inter mt-0.5">
              AirPods Pro dropped to ₹18,999 on Amazon!
            </p>
            <p className="text-xs text-cyber-lime font-inter mt-1">
              -23% from your target price
            </p>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
};

const BentoGrid = () => {
  return (
    <section className="relative min-h-screen bg-background py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.p
            className="text-cyber-lime font-inter text-sm uppercase tracking-[0.3em] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Features
          </motion.p>
          <h2 className="font-clash text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
            <TextReveal text="Built for Hunters" />
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[300px] gap-4">
          <SpeedCard />
          <SecurityCard />
          <PriceHistoryCard />
          <AlertsCard />
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
