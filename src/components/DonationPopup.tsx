import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Sparkles, Gift, HeartHandshake } from "lucide-react";
import { useSupporters } from "@/hooks/useSupporters";

interface DonationPopupProps {
  trigger?: "timer" | "scroll" | "exit";
  delayMs?: number;
}

export function DonationPopup({ trigger = "timer", delayMs = 30000 }: DonationPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { count, loading, recordSupporter } = useSupporters();
  const [showThankYou, setShowThankYou] = useState(false);

  const donationLink = "https://razorpay.me/@adnan4402";

  useEffect(() => {
    // Check if already shown in this session
    const shown = sessionStorage.getItem("donation_popup_shown");
    if (shown) {
      setHasShown(true);
      return;
    }

    if (trigger === "timer" && !hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("donation_popup_shown", "true");
      }, delayMs);
      return () => clearTimeout(timer);
    }

    if (trigger === "scroll" && !hasShown) {
      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50) {
          setIsOpen(true);
          setHasShown(true);
          sessionStorage.setItem("donation_popup_shown", "true");
          window.removeEventListener("scroll", handleScroll);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    if (trigger === "exit" && !hasShown) {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsOpen(true);
          setHasShown(true);
          sessionStorage.setItem("donation_popup_shown", "true");
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [trigger, delayMs, hasShown]);

  const handleDonate = async () => {
    const newSupporter = await recordSupporter();
    if (newSupporter) {
      setShowThankYou(true);
    }
    setTimeout(() => {
      window.open(donationLink, "_blank", "noopener,noreferrer");
    }, 300);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="love-card p-6 md:p-8 max-w-md w-full relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <HeartHandshake className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <h2 className="font-display text-2xl md:text-3xl font-bold text-gradient-love mb-2">
                Spread the Love! 💕
              </h2>
              
              <p className="text-muted-foreground mb-4">
                Love Triangle is built with passion and kept free for all couples. Your support helps us keep spreading love!
              </p>

              {/* Supporters counter */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                <Sparkles className="h-4 w-4 text-accent" />
                {loading ? (
                  <span>Loading supporters…</span>
                ) : (
                  <span>
                    <strong className="text-foreground">{count.toLocaleString()}</strong> couples have already shown their love
                  </span>
                )}
              </div>

              {/* Benefits */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-primary" />
                  What your support does:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✨ Keeps Love Triangle free forever</li>
                  <li>💝 Funds new romantic features</li>
                  <li>🌹 Helps more couples connect</li>
                </ul>
              </div>

              {/* Thank you message */}
              <AnimatePresence>
                {showThankYou && (
                  <motion.div
                    className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-center mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-sm font-medium text-primary">
                      💕 Thank you for supporting Love Triangle!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <motion.button
                  className="gold-button w-full"
                  onClick={handleDonate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Support with ₹50+
                  </span>
                </motion.button>
                
                <button
                  onClick={handleClose}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Manual trigger component for showing donation popup
export function DonationTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { count, loading, recordSupporter } = useSupporters();
  const [showThankYou, setShowThankYou] = useState(false);

  const donationLink = "https://razorpay.me/@adnan4402";

  const handleDonate = async () => {
    const newSupporter = await recordSupporter();
    if (newSupporter) {
      setShowThankYou(true);
    }
    setTimeout(() => {
      window.open(donationLink, "_blank", "noopener,noreferrer");
    }, 300);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="love-card p-6 md:p-8 max-w-md w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <HeartHandshake className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="font-display text-xl font-bold mb-2">Support Love Triangle</h3>
                <p className="text-muted-foreground mb-4">
                  Help us keep the love alive for couples everywhere!
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                  <Sparkles className="h-4 w-4 text-accent" />
                  {loading ? (
                    <span>Loading...</span>
                  ) : (
                    <span><strong>{count.toLocaleString()}</strong> supporters</span>
                  )}
                </div>

                <AnimatePresence>
                  {showThankYou && (
                    <motion.div
                      className="rounded-xl bg-primary/10 border border-primary/30 p-3 mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-sm font-medium text-primary">💕 Thank you!</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  className="gold-button w-full"
                  onClick={handleDonate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Donate Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
