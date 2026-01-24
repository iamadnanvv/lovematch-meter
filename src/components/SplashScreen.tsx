import { motion } from "framer-motion";
import logoImage from "@/assets/love-triangle-logo.png";
import { FloatingHearts } from "@/components/FloatingHearts";

interface SplashScreenProps {
  /** Duration should be controlled by the parent; this is only for accessibility / optional skip UI later. */
  title?: string;
}

export function SplashScreen({ title = "Love Triangle" }: SplashScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient hearts */}
      <FloatingHearts />

      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="love-card p-8 md:p-12 max-w-lg w-full text-center"
          initial={{ scale: 0.96, y: 18 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto mb-6 w-28 h-28 md:w-32 md:h-32"
            initial={{ scale: 0.7, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <img
              src={logoImage}
              alt="Love Triangle logo"
              className="w-full h-full object-contain drop-shadow-xl"
              loading="eager"
              decoding="async"
            />
          </motion.div>

          <motion.h1
            className="font-display text-4xl md:text-5xl font-bold text-gradient-love"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="mt-3 text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45 }}
          >
            Loading your love story…
          </motion.p>

          <motion.div
            className="mt-8 mx-auto h-2 w-44 rounded-full bg-secondary overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.35 }}
            aria-hidden="true"
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.35, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
