import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ValentineLetterProps {
  player1Name: string;
  player2Name: string;
  score: number;
}

export function ValentineLetter({ player1Name, player2Name, score }: ValentineLetterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getLetterContent = () => {
    if (score >= 90) {
      return {
        greeting: "To My Perfect Match",
        body: `${player1Name} & ${player2Name}, your connection is nothing short of magical. With a ${score}% compatibility, you've proven that soulmates truly exist. Every answer you shared echoed the other's heart. This Valentine's Day, celebrate the beautiful bond you share—it's rare and precious.`,
        closing: "Forever intertwined,",
        signature: "Love Triangle 💕",
      };
    }
    if (score >= 70) {
      return {
        greeting: "To Two Hearts Beating as One",
        body: `${player1Name} & ${player2Name}, your ${score}% compatibility shows a love that's growing stronger each day. You understand each other in ways that matter most. This Valentine's Day, cherish the harmony you've built together—it's the foundation of something beautiful.`,
        closing: "With warmth and admiration,",
        signature: "Love Triangle 💗",
      };
    }
    if (score >= 50) {
      return {
        greeting: "To an Adventure in the Making",
        body: `${player1Name} & ${player2Name}, your ${score}% compatibility is the start of something exciting! Your differences aren't obstacles—they're opportunities to discover new sides of each other. This Valentine's Day, embrace the journey of learning and growing together.`,
        closing: "Here's to your beautiful adventure,",
        signature: "Love Triangle 💫",
      };
    }
    return {
      greeting: "To Two Unique Souls",
      body: `${player1Name} & ${player2Name}, with ${score}% compatibility, you bring wonderfully different perspectives to your relationship. Like two colors blending to create something new, your uniqueness is your strength. This Valentine's Day, celebrate what makes each of you special.`,
      closing: "Wishing you discovery and delight,",
      signature: "Love Triangle ✨",
    };
  };

  const letter = getLetterContent();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="love-button-outline w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            Read Your Love Letter
          </span>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-display text-center flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            Valentine's Love Letter
            <Heart className="w-5 h-5 text-primary fill-primary" />
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="relative bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-xl p-6 border border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 text-primary/20">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <div className="absolute bottom-2 left-2 text-accent/20">
            <Heart className="w-6 h-6 fill-current" />
          </div>

          <div className="space-y-4 relative z-10">
            <p className="font-display text-xl text-foreground italic">
              {letter.greeting},
            </p>

            <p className="text-muted-foreground leading-relaxed text-sm">
              {letter.body}
            </p>

            <div className="pt-4">
              <p className="text-muted-foreground text-sm italic">
                {letter.closing}
              </p>
              <p className="font-display text-lg text-gradient-love mt-1">
                {letter.signature}
              </p>
            </div>
          </div>
        </motion.div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Happy Valentine's Day! 💕
        </p>
      </DialogContent>
    </Dialog>
  );
}
