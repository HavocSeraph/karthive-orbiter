import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { ShoppingCart } from "lucide-react";

// ============================================
// PERFORMANCE: All variants defined OUTSIDE components
// ============================================

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const badgePulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1],
};

const imageHoverAnimation = {
  scale: 1.1,
};

// Noise texture SVG
const noiseTextureSVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

// ============================================
// Store Logos
// ============================================

const storeLogos: Record<string, { bg: string; text: string }> = {
  amazon: { bg: "#FF9900", text: "A" },
  flipkart: { bg: "#2874F0", text: "F" },
  croma: { bg: "#0DB14B", text: "C" },
  apple: { bg: "#000000", text: "" },
  reliance: { bg: "#E42529", text: "R" },
};

// ============================================
// Product Interface
// ============================================

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  store: string;
  rating: number;
  isLowestPrice?: boolean;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

// ============================================
// ProductCard Component with 3D Tilt
// ============================================

const ProductCard = ({ product, index }: ProductCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
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

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const storeLogo = storeLogos[product.store.toLowerCase()] || storeLogos.amazon;

  return (
    <motion.div
      ref={ref}
      className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden group"
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: noiseTextureSVG }}
      />

      {/* Best Deal Badge */}
      {product.isLowestPrice && (
        <motion.div
          className="absolute top-3 right-3 z-20 px-3 py-1 bg-cyber-lime text-background text-xs font-bold rounded-full font-mono"
          animate={badgePulseAnimation}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            boxShadow: "0 0 20px 5px hsla(75, 100%, 50%, 0.4)"
          }}
        >
          BEST DEAL
        </motion.div>
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-success text-success-foreground text-xs font-bold rounded font-mono">
          -{discount}%
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-48 bg-black/40 overflow-hidden flex items-center justify-center">
        <motion.div
          className="w-32 h-32 flex items-center justify-center"
          whileHover={imageHoverAnimation}
          transition={{ duration: 0.3 }}
        >
          {/* Placeholder product icon */}
          <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground/50" />
          </div>
        </motion.div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      </div>

      {/* Product Info */}
      <div className="p-4 relative z-10">
        {/* Title */}
        <h3 className="font-inter text-sm text-foreground line-clamp-2 mb-3 min-h-[40px]">
          {product.name}
        </h3>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          {/* Store Logo */}
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: storeLogo.bg }}
          >
            {product.store.toLowerCase() === "apple" ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            ) : (
              <span className="text-white">{storeLogo.text}</span>
            )}
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="font-mono text-xl font-bold text-success">
              ₹{product.price.toLocaleString()}
            </div>
            {product.originalPrice > product.price && (
              <div className="font-mono text-xs text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i < Math.floor(product.rating) ? "bg-cyber-lime" : "bg-white/20"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-1">
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        animate={{
          boxShadow: isHovered 
            ? "inset 0 0 60px 10px hsla(75, 100%, 50%, 0.1)"
            : "inset 0 0 0 0 transparent"
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default ProductCard;
