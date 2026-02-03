import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Terminal, TrendingDown } from "lucide-react";
import TextReveal from "./TextReveal";

// ============================================
// PERFORMANCE: All variants defined OUTSIDE components
// ============================================

const feedItemVariants: Variants = {
  hidden: { opacity: 0, y: -20, height: 0 },
  visible: { 
    opacity: 1, 
    y: 0, 
    height: "auto",
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { opacity: 0, y: 20 }
};

const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6 }
  }
};

const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, delay: 0.2 }
  }
};

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
  }
};

const cursorBlinkAnimation = {
  opacity: [1, 0],
};

// ============================================
// Mock Data (Static - no re-renders)
// ============================================

const mockProducts = [
  { name: "MACBOOK_AIR_M3", retailer: "AMAZON" },
  { name: "SONY_XM5", retailer: "FLIPKART" },
  { name: "IPHONE_15_PRO", retailer: "CROMA" },
  { name: "GALAXY_S24_ULTRA", retailer: "AMAZON" },
  { name: "IPAD_PRO_12", retailer: "APPLE" },
  { name: "AIRPODS_PRO_2", retailer: "FLIPKART" },
  { name: "PS5_SLIM", retailer: "AMAZON" },
  { name: "SWITCH_OLED", retailer: "CROMA" },
  { name: "DYSON_V15", retailer: "AMAZON" },
  { name: "LG_C3_OLED_55", retailer: "FLIPKART" },
  { name: "BOSE_QC_ULTRA", retailer: "AMAZON" },
  { name: "PIXEL_8_PRO", retailer: "FLIPKART" },
] as const;

const statsData = [
  { label: "Price Drops Today", value: "2,847", trend: "+12%" },
  { label: "Active Trackers", value: "156K", trend: "+8%" },
  { label: "Money Saved", value: "₹4.2Cr", trend: "+24%" },
] as const;

// ============================================
// Types
// ============================================

interface SaleItem {
  id: number;
  product: string;
  percent: number;
  retailer: string;
  timestamp: Date;
}

// ============================================
// LiveFeed Component
// ============================================

const LiveFeed = () => {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  useEffect(() => {
    // Initial items
    const initialItems: SaleItem[] = Array.from({ length: 3 }, (_, i) => {
      const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      return {
        id: i,
        product: product.name,
        percent: Math.floor(Math.random() * 30) + 5,
        retailer: product.retailer,
        timestamp: new Date(Date.now() - i * 30000),
      };
    });
    setSales(initialItems);
    setIdCounter(3);

    // Simulate live socket: Add new sale every 2 seconds
    const interval = setInterval(() => {
      const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      setIdCounter((prev) => {
        const newId = prev + 1;
        setSales((prevSales) => {
          const newSale: SaleItem = {
            id: newId,
            product: product.name,
            percent: Math.floor(Math.random() * 30) + 5,
            retailer: product.retailer,
            timestamp: new Date(),
          };
          // Keep only last 8 items
          return [newSale, ...prevSales].slice(0, 8);
        });
        return newId;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <section className="relative min-h-screen bg-background py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <motion.p
            className="text-cyber-lime font-inter text-sm uppercase tracking-[0.3em] mb-4"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20%" }}
          >
            Live Feed
          </motion.p>
          <h2 className="font-clash text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
            <TextReveal text="Deals Happening Now" />
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Hacker Terminal Window */}
          <motion.div
            className="relative"
            variants={slideInLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20%" }}
          >
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <div className="w-3 h-3 rounded-full bg-cyber-lime" />
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">
                    karthive-live-feed — bash
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="p-4 h-[500px] overflow-hidden font-mono text-sm">
                <div className="text-muted-foreground mb-4">
                  <span className="text-cyber-lime">$</span> tail -f /var/log/price-drops.log
                </div>

                <AnimatePresence mode="popLayout">
                  {sales.map((sale) => (
                    <motion.div
                      key={sale.id}
                      layout
                      variants={feedItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="mb-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground/50 text-xs shrink-0">
                          [{formatTime(sale.timestamp)}]
                        </span>
                        <div className="flex-1">
                          <span className="text-yellow-500">ALERT</span>
                          <span className="text-muted-foreground"> :: </span>
                          <span className="text-foreground">{sale.product}</span>
                          <span className="text-muted-foreground"> :: DROP </span>
                          <span className="text-success font-bold">-{sale.percent}%</span>
                          <span className="text-muted-foreground"> @ </span>
                          <span className="text-cyber-lime">{sale.retailer}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Blinking cursor */}
                <motion.span
                  className="inline-block w-2 h-4 bg-cyber-lime"
                  animate={cursorBlinkAnimation}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            className="flex flex-col gap-6"
            variants={slideInRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20%" }}
          >
            {/* Stat Cards */}
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                <p className="text-muted-foreground font-inter text-sm uppercase tracking-wider mb-2">
                  {stat.label}
                </p>
                <div className="flex items-end justify-between">
                  <span className="font-clash text-5xl font-bold text-foreground">
                    {stat.value}
                  </span>
                  <div className="flex items-center gap-1 text-success">
                    <TrendingDown className="w-4 h-4 rotate-180" />
                    <span className="font-mono text-sm">{stat.trend}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Bottom CTA */}
            <motion.div
              className="bg-gradient-to-br from-cyber-lime/20 to-cyber-lime/5 border border-cyber-lime/30 rounded-2xl p-6 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-cyber-lime font-clash text-xl font-bold mb-2">
                Join the Hunt
              </p>
              <p className="text-muted-foreground font-inter text-sm">
                Start tracking prices in seconds
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveFeed;
