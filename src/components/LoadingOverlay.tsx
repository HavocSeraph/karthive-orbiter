import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// ============================================
// PERFORMANCE: All variants defined OUTSIDE components
// ============================================

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const contentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { delay: 0.1, duration: 0.3 }
  }
};

const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }
};

// Status messages that cycle rapidly
const statusMessages = [
  "> INITIALIZING_SCRAPERS...",
  "> BYPASSING_AMAZON_BOT_GUARD...",
  "> TRIANGULATING_LOWEST_PRICE...",
  "> PARSING_JSON_BLOB...",
  "> QUERYING_FLIPKART_API...",
  "> DECRYPTING_PRICE_DATA...",
  "> CALCULATING_BEST_DEALS...",
  "> FINALIZING_RESULTS...",
] as const;

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % statusMessages.length);
    }, 300);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div 
            className="flex flex-col items-center gap-8"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Cyber Hexagon Spinner */}
            <div className="relative w-32 h-32">
              {/* Outer ring */}
              <motion.svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
                variants={spinnerVariants}
                animate="animate"
              >
                <polygon
                  points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                  fill="none"
                  stroke="hsl(var(--cyber-lime))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="10 5"
                />
              </motion.svg>

              {/* Inner spinning hexagon */}
              <motion.svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <polygon
                  points="50,20 80,35 80,65 50,80 20,65 20,35"
                  fill="none"
                  stroke="hsl(var(--cyber-lime))"
                  strokeWidth="1.5"
                  opacity={0.5}
                />
              </motion.svg>

              {/* Center pulse */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-4 h-4 bg-cyber-lime rounded-full" />
              </motion.div>
            </div>

            {/* Status Terminal */}
            <div className="w-80 bg-black/60 border border-white/10 rounded-lg p-4 font-mono">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <div className="w-2 h-2 rounded-full bg-accent" />
                <div className="w-2 h-2 rounded-full bg-cyber-lime" />
                <span className="text-xs text-muted-foreground ml-2">system.log</span>
              </div>
              
              <div className="space-y-1 text-xs">
                {/* Previous messages (faded) */}
                {[...Array(3)].map((_, i) => {
                  const idx = (messageIndex - 3 + i + statusMessages.length) % statusMessages.length;
                  return (
                    <div 
                      key={i} 
                      className="text-muted-foreground/30"
                    >
                      {statusMessages[idx]}
                    </div>
                  );
                })}
                
                {/* Current message (highlighted) */}
                <motion.div 
                  className="text-cyber-lime"
                  key={messageIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {statusMessages[messageIndex]}
                  <motion.span
                    className="inline-block w-2 h-3 bg-cyber-lime ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Loading text */}
            <p className="text-muted-foreground text-sm font-inter">
              Finding the best deals for you...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
