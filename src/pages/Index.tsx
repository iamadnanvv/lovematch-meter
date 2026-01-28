import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { LoveTriangleGame } from "@/components/LoveTriangleGame";
import { SplashScreen } from "@/components/SplashScreen";
import { JoinGameFlow } from "@/components/JoinGameFlow";
import { ValentineScarcity } from "@/components/ValentineScarcity";

const SPLASH_MS = 1600;

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [joinCode, setJoinCode] = useState<string | null>(null);

  useEffect(() => {
    // Check for join parameter in URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get("join");
    if (code) {
      setJoinCode(code.toUpperCase());
    }

    const t = window.setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => window.clearTimeout(t);
  }, []);

  const handleExitJoin = useCallback(() => {
    setJoinCode(null);
  }, []);

  // If we have a join code, show the join game flow after splash
  if (joinCode && !showSplash) {
    return (
      <ValentineScarcity>
        <JoinGameFlow shareCode={joinCode} onExit={handleExitJoin} />
      </ValentineScarcity>
    );
  }

  return (
    <ValentineScarcity>
      <AnimatePresence mode="wait">
        {showSplash ? <SplashScreen key="splash" /> : <LoveTriangleGame key="game" />}
      </AnimatePresence>
    </ValentineScarcity>
  );
};

export default Index;
