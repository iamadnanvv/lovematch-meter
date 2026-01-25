import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Copy, Check, Loader2, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuizSession } from "@/hooks/useQuizSession";

interface PlayWithFriendProps {
  player1Name: string;
  selectedCategories: string[];
  player1Answers: number[];
  onSessionCreated?: (shareCode: string) => void;
}

export function PlayWithFriend({
  player1Name,
  selectedCategories,
  player1Answers,
  onSessionCreated,
}: PlayWithFriendProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { loading, error, createSession, getShareUrl } = useQuizSession();

  const handleCreateSession = async () => {
    const session = await createSession({
      player1_name: player1Name,
      selected_categories: selectedCategories,
      player1_answers: player1Answers,
    });

    if (session) {
      setShareCode(session.share_code);
      onSessionCreated?.(session.share_code);
    }
  };

  const handleCopy = async () => {
    if (!shareCode) return;

    const url = getShareUrl(shareCode);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (!shareCode) return;

    const url = getShareUrl(shareCode);
    const text = `💕 ${player1Name} challenges you to Love Triangle! Take the same quiz and compare your answers. Think you know them well? 👀`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Love Triangle Challenge",
          text,
          url,
        });
      } catch {
        // Cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setShareCode(null);
      setCopied(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.button
          className="love-button-outline w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            Play with a Friend
          </span>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Challenge Your Partner! 💕</DialogTitle>
          <DialogDescription>
            Create a shareable link so your partner can take the same quiz from their device. Compare results when they're done!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!shareCode ? (
              <motion.div
                key="create"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="rounded-xl bg-secondary p-4">
                  <p className="text-sm text-muted-foreground">
                    When you create a challenge, your answers will be saved. Your partner can then answer the same questions, and you'll both see how your answers compare!
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}

                <motion.button
                  type="button"
                  className="gold-button w-full"
                  onClick={handleCreateSession}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Users className="w-5 h-5" />
                      Create Challenge Link
                    </span>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="share"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Your challenge code:</p>
                  <p className="font-mono text-3xl font-bold text-primary tracking-widest">
                    {shareCode}
                  </p>
                </div>

                <div className="rounded-xl bg-secondary p-3">
                  <p className="text-xs text-muted-foreground break-all">
                    {getShareUrl(shareCode)}
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    className="love-button flex-1"
                    onClick={handleCopy}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </>
                      )}
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    className="gold-button flex-1"
                    onClick={handleShare}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </span>
                  </motion.button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Send this link to your partner. When they complete the quiz, you'll both see your compatibility score!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
