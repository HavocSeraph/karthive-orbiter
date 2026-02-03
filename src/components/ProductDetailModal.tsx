import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ExternalLink, Bell, Shield, Zap, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
} from "recharts";
import { Product } from "./ProductCard";

// ============================================
// PERFORMANCE: All variants defined OUTSIDE components
// ============================================

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const scanlineAnimation = {
  y: ["0%", "100%"],
  transition: {
    duration: 0.8,
    ease: "linear",
  },
};

const toggleSpringConfig = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
};

// ============================================
// Mock Price History Data
// ============================================

const mockPriceHistory = [
  { day: "Mon", price: 72000 },
  { day: "Tue", price: 71500 },
  { day: "Wed", price: 73000 },
  { day: "Thu", price: 70000 },
  { day: "Fri", price: 69500 },
  { day: "Sat", price: 71000 },
  { day: "Sun", price: 68000 },
];

// ============================================
// Vendor Data
// ============================================

const getVendorData = (product: Product) => [
  {
    name: "Amazon",
    price: product.price,
    delivery: "2-3 days",
    isWinner: true,
    logo: "#FF9900",
  },
  {
    name: "Flipkart",
    price: Math.round(product.price * 1.05),
    delivery: "3-4 days",
    isWinner: false,
    logo: "#2874F0",
  },
  {
    name: "Croma",
    price: Math.round(product.price * 1.08),
    delivery: "5-7 days",
    isWinner: false,
    logo: "#0DB14B",
  },
];

// ============================================
// AI Messages for Typewriter
// ============================================

const aiMessages = [
  "ANALYZING_PRICE_TRENDS...",
  "SCANNING_HISTORICAL_DATA...",
  "CALCULATING_BEST_TIME_TO_BUY...",
  "VERDICT: BUY NOW. PRICE IS 15% BELOW 30-DAY AVERAGE.",
];

// ============================================
// Custom Chart Tooltip
// ============================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomChartTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-cyber-lime/50 px-3 py-2 rounded font-mono text-xs">
        <span className="text-muted-foreground">{"// "}</span>
        <span className="text-cyber-lime">{label}</span>
        <span className="text-muted-foreground">{" :: "}</span>
        <span className="text-foreground">₹{payload[0].value.toLocaleString()}</span>
      </div>
    );
  }
  return null;
};

// ============================================
// Animated Chart Line Component
// ============================================

const AnimatedAreaChart = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={mockPriceHistory}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(75, 100%, 50%)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="hsl(75, 100%, 50%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" hide />
        <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: 'hsl(75, 100%, 50%)', strokeWidth: 1, strokeDasharray: '5 5' }} />
        <Area
          type="monotone"
          dataKey="price"
          stroke="hsl(75, 100%, 50%)"
          strokeWidth={2}
          fill="url(#priceGradient)"
          strokeDasharray={animate ? "0" : "1000"}
          strokeDashoffset={animate ? "0" : "1000"}
          style={{
            transition: "stroke-dasharray 1.5s ease-out, stroke-dashoffset 1.5s ease-out",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ============================================
// Vendor Row Component
// ============================================

interface VendorRowProps {
  vendor: {
    name: string;
    price: number;
    delivery: string;
    isWinner: boolean;
    logo: string;
  };
}

const VendorRow = ({ vendor }: VendorRowProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl p-4 border transition-all duration-300 ${
        vendor.isWinner
          ? "bg-cyber-lime/10 border-cyber-lime/50"
          : "bg-white/5 border-white/10 opacity-60 hover:opacity-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={itemVariants}
    >
      {/* Scanline effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-lime to-transparent"
            initial={{ y: "0%" }}
            animate={scanlineAnimation}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Winner badge */}
      {vendor.isWinner && (
        <motion.div
          className="absolute top-2 right-2 px-2 py-0.5 bg-cyber-lime text-background text-[10px] font-bold font-mono rounded"
          animate={{ 
            boxShadow: ["0 0 10px 2px hsla(75, 100%, 50%, 0.3)", "0 0 20px 5px hsla(75, 100%, 50%, 0.5)", "0 0 10px 2px hsla(75, 100%, 50%, 0.3)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          WINNER
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: vendor.logo }}
          >
            {vendor.name[0]}
          </div>
          <div>
            <p className="font-inter font-medium text-foreground">{vendor.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{vendor.delivery}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className={`font-mono text-xl font-bold ${vendor.isWinner ? "text-cyber-lime" : "text-foreground"}`}>
            ₹{vendor.price.toLocaleString()}
          </p>
          <motion.button
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// Missile Toggle Component
// ============================================

const MissileToggle = () => {
  const [isArmed, setIsArmed] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleToggle = useCallback(() => {
    const newState = !isArmed;
    setIsArmed(newState);

    if (newState) {
      // Create particle explosion
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 600);
    }
  }, [isArmed]);

  return (
    <motion.div 
      className="relative"
      variants={itemVariants}
    >
      <motion.button
        className={`relative w-full py-4 px-6 rounded-xl border-2 flex items-center justify-between transition-colors duration-300 overflow-hidden ${
          isArmed
            ? "bg-success/20 border-success"
            : "bg-white/5 border-white/20 hover:border-white/40"
        }`}
        onClick={handleToggle}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background glow when armed */}
        {isArmed && (
          <motion.div
            className="absolute inset-0 bg-success/10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="flex items-center gap-3 relative z-10">
          <Bell className={`w-5 h-5 ${isArmed ? "text-success" : "text-muted-foreground"}`} />
          <span className={`font-mono text-sm ${isArmed ? "text-success" : "text-foreground"}`}>
            {isArmed ? "TRACKING_ACTIVE" : "ARM_ALERTS"}
          </span>
        </div>

        {/* Toggle switch */}
        <div className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
          isArmed ? "bg-success/30" : "bg-white/10"
        }`}>
          <motion.div
            className={`absolute top-1 w-6 h-6 rounded-full ${
              isArmed ? "bg-success" : "bg-white/40"
            }`}
            animate={{ left: isArmed ? "calc(100% - 28px)" : "4px" }}
            transition={toggleSpringConfig}
            style={{
              boxShadow: isArmed ? "0 0 15px 3px hsla(160, 84%, 39%, 0.5)" : "none",
            }}
          />
        </div>

        {/* Particle explosion */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full bg-success"
              initial={{ x: "50%", y: "50%", opacity: 1, scale: 1 }}
              animate={{
                x: `calc(50% + ${particle.x}px)`,
                y: `calc(50% + ${particle.y}px)`,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

// ============================================
// AI Analysis Component
// ============================================

const AIAnalysis = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const message = aiMessages[currentMessageIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= message.length) {
        setDisplayText(message.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        
        // Move to next message after delay
        setTimeout(() => {
          if (currentMessageIndex < aiMessages.length - 1) {
            setCurrentMessageIndex((prev) => prev + 1);
            setDisplayText("");
          }
        }, currentMessageIndex === aiMessages.length - 1 ? 5000 : 800);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentMessageIndex]);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const isVerdict = currentMessageIndex === aiMessages.length - 1 && displayText.includes("VERDICT");

  return (
    <motion.div
      className="bg-black/60 border border-white/10 rounded-xl p-4"
      variants={itemVariants}
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-cyber-lime" />
        <span className="font-mono text-xs text-cyber-lime">AI_ANALYSIS</span>
      </div>
      
      <div className="font-mono text-sm min-h-[60px]">
        <span className="text-muted-foreground">{"> "}</span>
        <span className={isVerdict ? "text-success" : "text-foreground"}>
          {displayText}
        </span>
        <span className={`${showCursor ? "opacity-100" : "opacity-0"} text-cyber-lime`}>█</span>
      </div>
    </motion.div>
  );
};

// ============================================
// Main Modal Component
// ============================================

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const vendors = getVendorData(product);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-3xl"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-6xl mx-4 my-8 bg-background/95 border border-white/10 rounded-2xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-foreground" />
            </motion.button>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Left Column - Visuals */}
              <motion.div className="space-y-6 lg:sticky lg:top-8" variants={itemVariants}>
                {/* Product Image */}
                <motion.div
                  layoutId={`product-image-${product.id}`}
                  className="relative aspect-square bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl overflow-hidden flex items-center justify-center"
                >
                  {/* Rotating glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-conic from-cyber-lime/20 via-transparent to-cyber-lime/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ opacity: 0.3 }}
                  />
                  
                  {/* Product placeholder */}
                  <div className="relative w-2/3 h-2/3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                    <span className="font-clash text-6xl text-muted-foreground/30">
                      {product.name[0]}
                    </span>
                  </div>

                  {/* Best deal badge */}
                  {product.isLowestPrice && (
                    <motion.div
                      className="absolute top-4 right-4 px-4 py-2 bg-cyber-lime text-background text-sm font-bold font-mono rounded-lg"
                      animate={{ 
                        boxShadow: ["0 0 20px 5px hsla(75, 100%, 50%, 0.4)", "0 0 40px 10px hsla(75, 100%, 50%, 0.6)", "0 0 20px 5px hsla(75, 100%, 50%, 0.4)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      BEST DEAL
                    </motion.div>
                  )}
                </motion.div>

                {/* System Status Badges */}
                <motion.div className="flex flex-wrap gap-2" variants={itemVariants}>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-success/20 border border-success/30 rounded-lg">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="font-mono text-xs text-success">VERIFIED_SELLER</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-cyber-lime/20 border border-cyber-lime/30 rounded-lg">
                    <TrendingDown className="w-4 h-4 text-cyber-lime" />
                    <span className="font-mono text-xs text-cyber-lime">-{discount}%_OFF</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">FAST_DELIVERY</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Telemetry */}
              <motion.div className="space-y-6" variants={itemVariants}>
                {/* Title & Price */}
                <motion.div variants={itemVariants}>
                  <motion.h2
                    layoutId={`product-title-${product.id}`}
                    className="font-clash text-2xl lg:text-3xl font-bold text-foreground mb-4"
                  >
                    {product.name}
                  </motion.h2>
                  
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-4xl font-bold text-cyber-lime">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="font-mono text-xl text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Price Chart */}
                <motion.div 
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-muted-foreground">PRICE_HISTORY_7D</span>
                    <span className="font-mono text-xs text-success">▼ 5.5%</span>
                  </div>
                  <div className="h-40">
                    <AnimatedAreaChart />
                  </div>
                </motion.div>

                {/* Vendor Matrix */}
                <motion.div className="space-y-3" variants={itemVariants}>
                  <span className="font-mono text-xs text-muted-foreground">VENDOR_MATRIX</span>
                  <div className="space-y-2">
                    {vendors.map((vendor) => (
                      <VendorRow key={vendor.name} vendor={vendor} />
                    ))}
                  </div>
                </motion.div>

                {/* Missile Toggle */}
                <MissileToggle />

                {/* AI Analysis */}
                <AIAnalysis />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
