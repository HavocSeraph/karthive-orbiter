import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, TrendingDown } from "lucide-react";
import TextReveal from "./TextReveal";

interface SaleItem {
  id: number;
  product: string;
  percent: number;
  retailer: string;
  timestamp: Date;
}

const mockProducts = [
  { name: "MacBook Air M3", retailer: "Amazon" },
  { name: "Sony WH-1000XM5", retailer: "Flipkart" },
  { name: "iPhone 15 Pro Max", retailer: "Croma" },
  { name: "Samsung Galaxy S24", retailer: "Amazon" },
  { name: "iPad Pro 12.9", retailer: "Apple Store" },
  { name: "AirPods Pro 2", retailer: "Flipkart" },
  { name: "PS5 Console", retailer: "Amazon" },
  { name: "Nintendo Switch OLED", retailer: "Croma" },
  { name: "Dyson V15 Detect", retailer: "Amazon" },
  { name: "LG C3 OLED TV 55\"", retailer: "Flipkart" },
  { name: "Bose QC Ultra", retailer: "Amazon" },
  { name: "Google Pixel 8 Pro", retailer: "Flipkart" },
];

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

    // Add new sale every 2 seconds
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Live Feed
          </motion.p>
          <h2 className="font-clash text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
            <TextReveal text="Deals Happening Now" />
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Terminal Window */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
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
                      initial={{ opacity: 0, y: -20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="mb-3"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground/50 text-xs shrink-0">
                          [{formatTime(sale.timestamp)}]
                        </span>
                        <div className="flex-1">
                          <span className="text-foreground">{sale.product}</span>
                          <span className="text-muted-foreground"> dropped by </span>
                          <span className="text-success font-bold">-{sale.percent}%</span>
                          <span className="text-muted-foreground"> on </span>
                          <span className="text-cyber-lime">{sale.retailer}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Blinking cursor */}
                <motion.span
                  className="inline-block w-2 h-4 bg-cyber-lime"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Stat Cards */}
            {[
              { label: "Price Drops Today", value: "2,847", trend: "+12%" },
              { label: "Active Trackers", value: "156K", trend: "+8%" },
              { label: "Money Saved", value: "₹4.2Cr", trend: "+24%" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
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
