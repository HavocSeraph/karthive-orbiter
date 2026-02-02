import { motion } from "framer-motion";

const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0 w-full h-[200%]"
        animate={{ y: [0, -50] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          className="w-full h-full opacity-[0.15]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.5"
              />
            </pattern>
            <linearGradient id="gridFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="1" />
              <stop offset="70%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="gridMask">
              <rect width="100%" height="100%" fill="url(#gridFade)" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#grid)"
            mask="url(#gridMask)"
          />
        </svg>
      </motion.div>

      {/* Perspective Lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-muted-foreground to-transparent"
            style={{
              width: "200%",
              left: "-50%",
              top: `${15 + i * 10}%`,
              transform: `rotate(${-5 + i * 1.5}deg)`,
            }}
            animate={{ x: ["-10%", "10%"] }}
            transition={{
              duration: 25 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 vignette-overlay pointer-events-none" />
      
      {/* Top gradient fade */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      
      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default AnimatedGrid;
