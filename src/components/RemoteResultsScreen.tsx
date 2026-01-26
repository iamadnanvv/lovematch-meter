import { useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, RotateCcw, Sparkles, Users } from "lucide-react";
import { getCompatibilityLevel, questionCategories } from "@/data/questions";
import { LoveMeter } from "./LoveMeter";
import { HeartbeatAnimation } from "./HeartbeatAnimation";
import { useCelebrationSounds } from "@/hooks/useCelebrationSounds";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import logoImage from "@/assets/love-triangle-logo.png";
import { CelebrationEffects } from "@/components/results/CelebrationEffects";
import { SoundToggle } from "@/components/results/SoundToggle";
import { ValentineLetter } from "@/components/results/ValentineLetter";
import { SurpriseGift } from "@/components/results/SurpriseGift";

interface RemoteResultsScreenProps {
  player1Name: string;
  player2Name: string;
  player1Answers: number[];
  player2Answers: number[];
  selectedCategories: string[];
  onPlayAgain: () => void;
}

export function RemoteResultsScreen({
  player1Name,
  player2Name,
  player1Answers,
  player2Answers,
  selectedCategories,
  onPlayAgain,
}: RemoteResultsScreenProps) {
  const matchCount = player1Answers.reduce((count, answer, index) => {
    return answer === player2Answers[index] ? count + 1 : count;
  }, 0);

  const totalQuestions = player1Answers.length;
  const score = Math.round((matchCount / totalQuestions) * 100);
  const compatibility = getCompatibilityLevel(score);

  const celebrationSounds = useCelebrationSounds();
  const haptics = useHapticFeedback();

  useEffect(() => {
    return () => celebrationSounds.cleanup();
  }, [celebrationSounds]);

  const handleCelebrationTrigger = useCallback(() => {
    celebrationSounds.playCelebration(score);
    haptics.vibrateOnCelebration();
  }, [celebrationSounds, haptics, score]);

  const categoryNames = selectedCategories
    .map((id) => questionCategories.find((c) => c.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  const handleShare = async () => {
    const shareText = `💕 ${player1Name} & ${player2Name} scored ${score}% on Love Triangle! ${compatibility.emoji}\n\n${compatibility.title} - ${compatibility.message}\n\nPlay now: `;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Love Triangle Results",
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareText + window.location.origin);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="love-card p-8 md:p-10 max-w-lg w-full text-center overflow-hidden relative"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sound Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <SoundToggle isMuted={celebrationSounds.isMuted} onToggle={celebrationSounds.toggleMute} />
        </div>

        {/* Celebration overlay */}
        <CelebrationEffects score={score} onTrigger={handleCelebrationTrigger} />

        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

        {/* Remote Play Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
            <Users className="w-3 h-3" />
            Remote Challenge Complete!
          </div>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-4"
        >
          <img src={logoImage} alt="Love Triangle" className="w-20 h-20 mx-auto" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-love mb-2">
            {compatibility.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {player1Name} & {player2Name}
          </p>
          <p className="text-sm text-muted-foreground mb-6">Categories: {categoryNames}</p>
        </motion.div>

        {/* Score Circle */}
        <motion.div
          className="relative mx-auto mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <div className="w-40 h-40 mx-auto relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="hsl(var(--rose-light))"
                strokeWidth="12"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#remoteScoreGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={440}
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * score) / 100 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="remoteScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <HeartbeatAnimation intensity="high" size="sm" />
              <motion.span
                className="text-3xl font-bold text-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {score}%
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <Heart
                  className={`w-6 h-6 ${
                    i < Math.ceil(score / 20) ? "text-primary fill-primary" : "text-rose-light"
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <p className="text-muted-foreground leading-relaxed">{compatibility.message}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="p-4 rounded-xl bg-rose-light">
            <div className="text-2xl font-bold text-primary">{matchCount}</div>
            <div className="text-sm text-muted-foreground">Matching Answers</div>
          </div>
          <div className="p-4 rounded-xl bg-gold-light">
            <div className="text-2xl font-bold text-accent">{totalQuestions - matchCount}</div>
            <div className="text-sm text-muted-foreground">Different Views</div>
          </div>
        </motion.div>

        {/* Surprise Gift */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <SurpriseGift player1Name={player1Name} player2Name={player2Name} score={score} />
        </motion.div>

        {/* Valentine Letter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <ValentineLetter player1Name={player1Name} player2Name={player2Name} score={score} />
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex gap-3 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <motion.button
            className="love-button flex-1"
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Share
            </span>
          </motion.button>

          <motion.button
            className="love-button-outline flex-1"
            onClick={onPlayAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              New Game
            </span>
          </motion.button>
        </motion.div>

        {/* Branding */}
        <motion.div
          className="mt-8 pt-6 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Made with love by</span>
            <span className="font-bold text-gradient-love">Love Triangle</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
