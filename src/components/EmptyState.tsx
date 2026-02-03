import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { RotateCcw } from "lucide-react";

// ============================================
// PERFORMANCE: All variants defined OUTSIDE components
// ============================================

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// ASCII Art Robot
const asciiRobot = `
    ╔═══════════════╗
    ║   ◉     ◉     ║
    ║       ▼       ║
    ║   ╰─────╯     ║
    ╚═══════════════╝
          ║║║
     ╔════╩╩╩════╗
     ║  ERROR    ║
     ║   404     ║
     ╚═══════════╝
        ║     ║
        ╨     ╨
`;

interface EmptyStateProps {
  onRetry: () => void;
  searchQuery?: string;
}

const EmptyState = ({ onRetry, searchQuery }: EmptyStateProps) => {
  const [isGlitching, setIsGlitching] = useState(false);

  const handleHover = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ASCII Art */}
      <div className="relative mb-8">
        <pre className="font-mono text-muted-foreground text-xs md:text-sm leading-tight whitespace-pre">
          {asciiRobot}
        </pre>
        
        {/* Glitch layers */}
        <motion.pre 
          className="absolute inset-0 font-mono text-destructive text-xs md:text-sm leading-tight whitespace-pre"
          animate={{
            x: isGlitching ? [0, -2, 2, 0] : 0,
            opacity: isGlitching ? [0, 0.8, 0] : 0,
          }}
          transition={{ duration: 0.15 }}
        >
          {asciiRobot}
        </motion.pre>
        <motion.pre 
          className="absolute inset-0 font-mono text-cyber-lime text-xs md:text-sm leading-tight whitespace-pre"
          animate={{
            x: isGlitching ? [0, 2, -2, 0] : 0,
            opacity: isGlitching ? [0, 0.8, 0] : 0,
          }}
          transition={{ duration: 0.15, delay: 0.05 }}
        >
          {asciiRobot}
        </motion.pre>
      </div>

      {/* Error Message */}
      <div className="text-center mb-8">
        <h3 className="font-mono text-xl md:text-2xl text-foreground mb-2">
          <span className="text-destructive">SYSTEM_FAILURE</span>
          <span className="text-muted-foreground"> // </span>
          <span className="text-foreground">PRODUCT_NOT_FOUND</span>
        </h3>
        {searchQuery && (
          <p className="text-muted-foreground font-mono text-sm">
            No results for "{searchQuery}"
          </p>
        )}
      </div>

      {/* Retry Button with Chromatic Aberration */}
      <motion.button
        className="relative group px-8 py-4 font-mono text-sm border border-white/20 rounded-lg overflow-hidden"
        onMouseEnter={handleHover}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
      >
        {/* Background */}
        <motion.div
          className="absolute inset-0 bg-cyber-lime/10"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: "left" }}
        />
        
        {/* Chromatic aberration text layers */}
        <span className="relative z-10 flex items-center gap-2 text-foreground">
          {/* Red layer */}
          <motion.span
            className="absolute inset-0 flex items-center justify-center gap-2 text-destructive opacity-0"
            animate={{
              x: isGlitching ? -2 : 0,
              opacity: isGlitching ? 0.7 : 0,
            }}
          >
            <RotateCcw className="w-4 h-4" />
            {">"} RETRY_SEARCH
          </motion.span>
          
          {/* Cyan layer */}
          <motion.span
            className="absolute inset-0 flex items-center justify-center gap-2 text-cyber-lime opacity-0"
            animate={{
              x: isGlitching ? 2 : 0,
              opacity: isGlitching ? 0.7 : 0,
            }}
          >
            <RotateCcw className="w-4 h-4" />
            {">"} RETRY_SEARCH
          </motion.span>
          
          {/* Main text */}
          <RotateCcw className="w-4 h-4" />
          {">"} RETRY_SEARCH
        </span>
      </motion.button>

      {/* Suggestions */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground font-mono mb-3">
          {">"} SUGGESTED_ACTIONS:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Check spelling", "Try broader terms", "Remove filters"].map((suggestion) => (
            <span
              key={suggestion}
              className="px-3 py-1 text-xs font-mono text-muted-foreground border border-white/10 rounded"
            >
              {suggestion}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
