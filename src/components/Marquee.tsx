import { motion } from "framer-motion";

const Marquee = () => {
  const text = "STOP OVERPAYING // KARTHIVE // ";
  const repeatedText = text.repeat(4);

  return (
    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none z-0">
      <motion.div
        className="whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 15,
        }}
      >
        <span className="font-clash font-semibold text-[15vw] md:text-[12rem] text-foreground/[0.03] tracking-tight">
          {repeatedText}
          {repeatedText}
        </span>
      </motion.div>
    </div>
  );
};

export default Marquee;
