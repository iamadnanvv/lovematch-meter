import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  getText: () => string;
  className?: string;
  variant?: 'full' | 'compact';
}

export function ShareButton({ getText, className = '', variant = 'full' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = getText();
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // User cancelled or share failed, fall through to copy
      }
    }
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard! Share it with your friends! 💕');
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'compact') {
    return (
      <motion.button
        className={`love-button-outline flex-1 ${className}`}
        onClick={handleShare}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="flex items-center justify-center gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Share'}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      className={`love-button-outline w-full ${className}`}
      onClick={handleShare}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="flex items-center justify-center gap-2">
        {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        {copied ? 'Copied!' : '📤 Share This'}
      </span>
    </motion.button>
  );
}
