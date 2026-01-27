import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share, X, Smartphone, Plus } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface InstallPromptProps {
  variant?: 'banner' | 'card' | 'modal';
}

export function InstallPrompt({ variant = 'banner' }: InstallPromptProps) {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWA();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed || !isInstallable) return null;

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === 'ios') {
      setShowIOSInstructions(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <motion.div
          className="fixed bottom-16 left-4 right-4 z-40 bg-card rounded-xl shadow-2xl border border-border p-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">Install Love Triangle</h3>
              <p className="text-xs text-muted-foreground">Add to home screen for the best experience</p>
            </div>
            <motion.button
              className="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
              onClick={handleInstall}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Install
            </motion.button>
          </div>
        </motion.div>

        {/* iOS Instructions Modal */}
        <AnimatePresence>
          {showIOSInstructions && (
            <motion.div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIOSInstructions(false)}
            >
              <motion.div
                className="love-card p-6 w-full max-w-md m-4 rounded-2xl"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-display text-xl font-bold text-foreground mb-4 text-center">
                  Install on iOS
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-rose-light rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Tap the</span>
                      <Share className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold">Share button</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-rose-light rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Select</span>
                      <Plus className="w-5 h-5 text-primary" />
                      <span className="text-sm font-semibold">Add to Home Screen</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-rose-light rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <span className="text-sm">Tap <span className="font-semibold">Add</span> to confirm</span>
                  </div>
                </div>

                <motion.button
                  className="love-button w-full mt-6"
                  onClick={() => setShowIOSInstructions(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Got it!
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return null;
}
