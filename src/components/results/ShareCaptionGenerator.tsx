import { useState, useMemo } from "react";
import { Copy, Check, Instagram } from "lucide-react";
import { motion } from "framer-motion";

interface ShareCaptionGeneratorProps {
  player1Name: string;
  player2Name: string;
  score: number;
  categoryNames: string;
}

export function ShareCaptionGenerator({
  player1Name,
  player2Name,
  score,
  categoryNames,
}: ShareCaptionGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const caption = useMemo(() => {
    const emoji = score >= 80 ? "💕" : score >= 50 ? "💗" : "💫";
    return `${emoji} ${player1Name} & ${player2Name} scored ${score}% on Love Triangle!

📂 Categories: ${categoryNames}

Think you and your partner can beat that? Try Love Triangle now and see how in sync you really are 👀💘

#LoveTriangle #CouplesGame #RelationshipGoals #CompatibilityTest`;
  }, [player1Name, player2Name, score, categoryNames]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = caption;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-secondary/50 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Instagram className="h-4 w-4 text-primary" />
        Share your result
      </div>

      <pre className="whitespace-pre-wrap text-xs text-muted-foreground bg-background/50 rounded-lg p-3 max-h-32 overflow-auto">
        {caption}
      </pre>

      <motion.button
        type="button"
        className="love-button w-full"
        onClick={handleCopy}
        whileTap={{ scale: 0.97 }}
      >
        <span className="flex items-center justify-center gap-2">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy for Instagram
            </>
          )}
        </span>
      </motion.button>
    </div>
  );
}
