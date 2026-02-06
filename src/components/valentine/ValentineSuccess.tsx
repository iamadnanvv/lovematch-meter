import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CelebrationEffects } from '@/components/results/CelebrationEffects';
import { toast } from 'sonner';

interface ValentineSuccessProps {
  onPlayAgain?: () => void;
}

export function ValentineSuccess({ onPlayAgain }: ValentineSuccessProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.origin + '/valentine';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied! Share with someone special 💕");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Will you be my Valentine? 💖",
          text: "Someone special wants to ask you something...",
          url: shareUrl,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Celebration effects */}
      <CelebrationEffects score={100} />

      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/20"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 50,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: -100,
              rotate: Math.random() * 360 + 360
            }}
            transition={{ 
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          >
            <Heart className="w-6 h-6 fill-primary/10" />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="love-card p-8 md:p-12 max-w-md w-full text-center relative z-10"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        {/* Success emoji */}
        <motion.div
          className="text-7xl mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          🥰
        </motion.div>

        {/* Success message */}
        <motion.h1
          className="font-display text-3xl md:text-4xl font-bold text-gradient-love mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Yay! You Said Yes!
        </motion.h1>

        <motion.p
          className="text-lg text-muted-foreground mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Happy Valentine's Day! 💕
        </motion.p>

        <motion.p
          className="text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          You just made someone's heart skip a beat! 💓
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={handleShare}
            className="love-button w-full text-base"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share with Someone Special
          </Button>

          <Button
            onClick={handleCopy}
            variant="outline"
            className="w-full text-base border-primary/30 hover:bg-rose-light/50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-primary" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </>
            )}
          </Button>

          {onPlayAgain && (
            <Button
              onClick={onPlayAgain}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-primary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ask Again
            </Button>
          )}
        </motion.div>

        {/* Share encouragement */}
        <motion.div
          className="mt-8 p-4 bg-rose-light/50 rounded-xl border border-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-muted-foreground">
            💖 <span className="font-medium text-foreground">Spread the love!</span>
            <br />
            Share this with your crush or partner
          </p>
        </motion.div>
      </motion.div>

      {/* Bottom branding */}
      <motion.p
        className="absolute bottom-4 text-xs text-muted-foreground/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Made with 💕 by Love Triangle
      </motion.p>
    </motion.div>
  );
}
