import { useState } from "react";
import { HeartHandshake, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useSupporters } from "@/hooks/useSupporters";
import { motion, AnimatePresence } from "framer-motion";

interface DonationDialogProps {
  href: string;
  player1Name: string;
  player2Name: string;
}

export function DonationDialog({ href, player1Name, player2Name }: DonationDialogProps) {
  const { count, loading, recordSupporter } = useSupporters();
  const [showThankYou, setShowThankYou] = useState(false);

  const handleDonationClick = async () => {
    const newSupporter = await recordSupporter();
    if (newSupporter) {
      setShowThankYou(true);
    }
    // Open donation link after a brief delay so the user sees feedback
    setTimeout(() => {
      window.open(href, "_blank", "noopener,noreferrer");
    }, 400);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="love-button-outline w-full" type="button">
          <span className="flex items-center justify-center gap-2">
            <HeartHandshake className="h-5 w-5" />
            Support Love Triangle
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">You two made this moment real</DialogTitle>
          <DialogDescription>
            If this felt special, help us keep Love Triangle beautifully alive—so more couples get to feel this kind of spark.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Personalized nudge */}
          <div className="rounded-xl bg-secondary p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{player1Name}</span> &{" "}
              <span className="font-semibold text-foreground">{player2Name}</span>,
              <br />
              this is your gentle nudge to say: "we invest in us."
            </p>
          </div>

          {/* Supporters counter */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            {loading ? (
              <span>Loading supporters…</span>
            ) : (
              <span>
                <strong className="text-foreground">{count.toLocaleString()}</strong> couples have already shown their love
              </span>
            )}
          </div>

          {/* Donation CTA */}
          <motion.button
            type="button"
            className="gold-button w-full"
            onClick={handleDonationClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Open donation link
          </motion.button>

          {/* Thank you message */}
          <AnimatePresence>
            {showThankYou && (
              <motion.div
                className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-sm font-medium text-primary">
                  💕 Thank you for supporting Love Triangle!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your kindness keeps the spark alive for couples everywhere.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-muted-foreground text-center">
            No pressure—just appreciation. Thank you for supporting a more loving internet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
