import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Copy, Check, RefreshCw } from 'lucide-react';
import { ShareButton } from './ShareButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ExcuseGeneratorProps {
  player1Name: string;
  player2Name: string;
}

const EXCUSE_TEMPLATES = [
  "Sorry, can't make it! {name1} and I have to practice our synchronized sneezing routine for the world championships.",
  "We'd love to come, but {name2} and I have a mandatory blanket fort inspection at 7 PM. Safety first!",
  "Can't tonight—{name1} and I are training our houseplant to do tricks. We're THIS close to a breakthrough.",
  "Rain check? {name2} and I are competing in an intense staring contest. We're on hour 3.",
  "We have to cancel—{name1} accidentally superglued us together. Long story. Very romantic though.",
  "Sorry, {name2} and I are busy watching paint dry. It's actually riveting. You should see the beige.",
  "We're organizing our sock drawer by emotional significance tonight. It's more complex than it sounds.",
  "Can't come—we're having a philosophical debate about whether a hot dog is a sandwich. It's getting heated.",
  "We're scheduled to have our monthly 'who's cuter' argument. Very important relationship maintenance.",
  "{name1} is teaching me how to properly peel a banana. Apparently I've been doing it wrong my whole life.",
  "We're busy calculating how many pizzas we've eaten together. The math is intense.",
  "Sorry, we're practicing for our couples escape room championship. The living room is currently booby-trapped.",
  "We have to stay in—{name2} is showing me their complete rock collection. All 347 of them.",
  "Can't make it! We're busy having a dance-off in the kitchen. The refrigerator is judging.",
  "We're conducting very important research on which streaming service has the best loading animation.",
];

export function ExcuseGenerator({ player1Name, player2Name }: ExcuseGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const excuse = useMemo(() => {
    const template = EXCUSE_TEMPLATES[Math.floor(Math.random() * EXCUSE_TEMPLATES.length)];
    return template
      .replace('{name1}', player1Name)
      .replace('{name2}', player2Name);
  }, [player1Name, player2Name, key]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(excuse);
    setCopied(true);
    toast.success('Excuse copied to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
    setCopied(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="love-button-outline w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            🙈 Date Night Excuse Generator
          </span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-rose-light border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center font-display text-2xl text-gradient-love">
            🙈 Excuse Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <p className="text-center text-muted-foreground text-sm">
            Need to skip boring plans for quality time together? We've got you covered!
          </p>

          {/* Excuse Display */}
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-xl bg-gold-light border border-accent/30 relative"
          >
            <motion.p 
              className="text-lg text-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              "{excuse}"
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              className="love-button flex-1"
              onClick={handleCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={copied}
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
                    Copy
                  </>
                )}
              </span>
            </motion.button>
            
            <ShareButton
              variant="compact"
              getText={() => `🙈 My excuse for tonight:\n"${excuse}"\n\n💕 Generated by Love Triangle!`}
            />
            
            <motion.button
              className="love-button-outline flex-1"
              onClick={handleRefresh}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                New
              </span>
            </motion.button>
          </div>

          {/* Pro Tips */}
          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs text-muted-foreground">
              💡 Pro tip: Deliver with a completely straight face for maximum believability
            </p>
            <p className="text-xs text-muted-foreground/70">
              (We take no responsibility for any friendships tested)
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
