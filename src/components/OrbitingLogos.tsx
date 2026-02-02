import { motion, AnimatePresence } from "framer-motion";

interface OrbitingLogosProps {
  isVisible: boolean;
}

const logos = [
  { name: "Amazon", angle: 0, color: "#FF9900" },
  { name: "Flipkart", angle: 90, color: "#2874F0" },
  { name: "Croma", angle: 180, color: "#00B33C" },
  { name: "Apple", angle: 270, color: "#A2AAAD" },
];

const OrbitingLogos = ({ isVisible }: OrbitingLogosProps) => {
  const radius = 180;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Orbit Ring */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="relative"
              style={{ width: radius * 2, height: radius * 2 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Dashed Circle */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
              >
                <circle
                  cx={radius}
                  cy={radius}
                  r={radius - 2}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  strokeDasharray="8 8"
                  className="opacity-50"
                />
              </svg>

              {/* Orbiting Logos */}
              {logos.map((logo, index) => {
                const angleRad = (logo.angle * Math.PI) / 180;
                const x = radius + (radius - 20) * Math.cos(angleRad) - 24;
                const y = radius + (radius - 20) * Math.sin(angleRad) - 24;

                return (
                  <motion.div
                    key={logo.name}
                    className="absolute w-12 h-12 flex items-center justify-center"
                    style={{
                      left: x,
                      top: y,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      rotate: -360,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      scale: {
                        delay: index * 0.1,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                      },
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center shadow-lg"
                      style={{
                        boxShadow: `0 0 20px -5px ${logo.color}40`,
                      }}
                    >
                      <span
                        className="text-xs font-semibold font-clash"
                        style={{ color: logo.color }}
                      >
                        {logo.name.charAt(0)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Glow Ring */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="rounded-full opacity-20 blur-xl"
              style={{
                width: radius * 2 + 40,
                height: radius * 2 + 40,
                background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrbitingLogos;
