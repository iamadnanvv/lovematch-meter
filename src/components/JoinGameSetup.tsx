import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Users, ArrowRight, Loader2 } from "lucide-react";
import logoImage from "@/assets/love-triangle-logo.png";

interface JoinGameSetupProps {
  player1Name: string;
  onComplete: (player2Name: string) => void;
  loading?: boolean;
}

export function JoinGameSetup({ player1Name, onComplete, loading }: JoinGameSetupProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !loading) {
      onComplete(name.trim());
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="love-card p-8 md:p-10 max-w-md w-full text-center"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <img src={logoImage} alt="Love Triangle" className="w-24 h-24 mx-auto" />
        </motion.div>

        {/* Challenge Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Challenge Accepted!
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient-love mb-2">
            You've Been Invited!
          </h1>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">{player1Name}</span> wants to see how compatible you are!
          </p>
        </motion.div>

        {/* Decorative hearts */}
        <motion.div
          className="flex justify-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
            >
              <Heart className="w-5 h-5 text-primary/60 fill-primary/30" />
            </motion.div>
          ))}
        </motion.div>

        {/* Name Input Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              What's your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="love-input w-full text-center text-lg"
              autoFocus
              disabled={loading}
              maxLength={20}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="love-button w-full"
            disabled={!name.trim() || loading}
            whileHover={{ scale: name.trim() && !loading ? 1.02 : 1 }}
            whileTap={{ scale: name.trim() && !loading ? 0.98 : 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading Quiz...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Start the Quiz
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </motion.button>
        </form>

        {/* Info */}
        <motion.p
          className="text-xs text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Answer the same questions and see how you match up! 💕
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
