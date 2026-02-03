import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import AnimatedGrid from "./AnimatedGrid";
import Marquee from "./Marquee";
import OrbitingLogos from "./OrbitingLogos";
import MagneticButton from "./MagneticButton";
import CustomCursor from "./CustomCursor";

interface HeroProps {
  onSearch?: (query: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (!searchValue) setIsFocused(false);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Animated Grid Background */}
      <AnimatedGrid />

      {/* Kinetic Marquee */}
      <Marquee />

      {/* Main Content */}
      <div className="relative z-50 flex flex-col items-center justify-center h-full px-4">
        {/* Logo & Tagline */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Compare prices across 50+ stores instantly
            </span>
          </motion.div>

          <h1 className="font-clash font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-4">
            <span className="text-foreground">Kart</span>
            <span className="text-gradient-lime">Hive</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
            Find the best deals. Never overpay again.
          </p>
        </motion.div>

        {/* Search Bar Container with Orbital System */}
        <div className="relative flex items-center justify-center">
          {/* Orbiting Logos */}
          <OrbitingLogos isVisible={isFocused} />

          {/* Command Center Search Bar */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              className="relative flex items-center rounded-full border bg-secondary/80 backdrop-blur-xl overflow-hidden"
              animate={{
                width: isFocused ? 600 : 400,
                borderColor: isFocused
                  ? "hsl(var(--primary))"
                  : "hsl(var(--border))",
                backgroundColor: isFocused
                  ? "hsl(0 0% 4% / 0.95)"
                  : "hsl(var(--secondary) / 0.8)",
              }}
              style={{
                boxShadow: isFocused
                  ? "0 0 40px -5px hsla(75, 100%, 50%, 0.4), 0 0 80px -10px hsla(75, 100%, 50%, 0.2)"
                  : "none",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <div className="flex items-center px-5 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>

              <input
                ref={inputRef}
                type="text"
                placeholder="Search any product..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="flex-1 py-4 pr-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
                style={{ cursor: "none" }}
              />

              <AnimatePresence>
                {(isFocused || searchValue) && (
                  <motion.div
                    className="pr-3"
                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MagneticButton>
                      <button 
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                        onClick={handleSearch}
                      >
                        <span>Search</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </MagneticButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Search Suggestions */}
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>Try:</span>
                    {["iPhone 15 Pro", "MacBook Air", "Sony WH-1000XM5"].map(
                      (suggestion, i) => (
                        <motion.button
                          key={suggestion}
                          className="px-3 py-1.5 rounded-full bg-secondary/50 border border-border hover:border-primary/50 hover:text-foreground transition-colors"
                          style={{ cursor: "none" }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          onClick={() => {
                            setSearchValue(suggestion);
                            inputRef.current?.focus();
                          }}
                        >
                          {suggestion}
                        </motion.button>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { value: "50+", label: "Stores" },
            { value: "10M+", label: "Products" },
            { value: "₹500Cr+", label: "Saved" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              <div className="font-clash font-bold text-2xl md:text-3xl text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
