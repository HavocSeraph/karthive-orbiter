import { useRef, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TextReveal from "./TextReveal";

const MagneticCTA = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const y = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    );

    // Magnetic field radius of 100px
    if (distance < 100) {
      const pullStrength = (100 - distance) / 100;
      mouseX.set((e.clientX - centerX) * pullStrength * 0.4);
      mouseY.set((e.clientY - centerY) * pullStrength * 0.4);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="relative w-[200px] h-[200px] flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        ref={ref}
        className="relative w-[180px] h-[180px] rounded-full bg-cyber-lime text-background font-clash font-bold text-xl flex items-center justify-center gap-2 group overflow-hidden"
        style={{ x, y }}
        onMouseEnter={() => setIsHovered(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.5,
        }}
      >
        {/* Ripple effect on hover */}
        <motion.div
          className="absolute inset-0 bg-black/10 rounded-full"
          initial={{ scale: 0 }}
          animate={isHovered ? { scale: 2, opacity: 0 } : { scale: 0, opacity: 0.5 }}
          transition={{ duration: 0.6 }}
        />
        
        <span className="relative z-10">Get Started</span>
        <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </div>
  );
};

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-lime/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Massive Typography */}
      <motion.div
        className="relative text-center mb-16"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 
          className="font-clash font-bold text-[15vw] md:text-[15vw] leading-[0.85] tracking-tighter"
          style={{
            background: isHovered 
              ? "linear-gradient(180deg, #ffffff 0%, #ccff00 100%)"
              : "linear-gradient(180deg, #666666 0%, #333333 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            transition: "background 0.5s ease",
          }}
        >
          <TextReveal text="READY" />
          <br />
          <TextReveal text="TO HUNT?" delay={0.3} />
        </h2>
      </motion.div>

      {/* Magnetic CTA Button */}
      <MagneticCTA />

      {/* Footer Links */}
      <motion.div
        className="mt-24 w-full max-w-7xl border-t border-white/10 pt-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Extensions", "API"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Press"],
            },
            {
              title: "Resources",
              links: ["Documentation", "Help Center", "Community", "Status"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Cookies", "Licenses"],
            },
          ].map((column) => (
            <div key={column.title}>
              <h3 className="font-clash font-bold text-foreground mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-cyber-lime transition-colors font-inter text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-clash font-bold text-2xl text-cyber-lime">K</span>
            <span className="font-clash font-bold text-xl text-foreground">KartHive</span>
          </div>
          
          <p className="text-muted-foreground font-inter text-sm">
            © 2024 KartHive. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {["Twitter", "GitHub", "Discord"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-muted-foreground hover:text-cyber-lime transition-colors font-inter text-sm"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
