import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LoveTriangleGame } from "@/components/LoveTriangleGame";
import { SplashScreen } from "@/components/SplashScreen";

const SPLASH_MS = 1600;

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? <SplashScreen key="splash" /> : <LoveTriangleGame key="game" />}
    </AnimatePresence>
  );
};

export default Index;

