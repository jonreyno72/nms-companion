import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { SaveState } from '@/types';

interface Props {
  state: SaveState;
}

export function SaveIndicator({ state }: Props) {
  return (
    <div className="h-6 flex items-center justify-end" aria-live="polite">
      <AnimatePresence mode="wait">
        {state === 'saving' && (
          <motion.div
            key="saving"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-muted-foreground flex items-center gap-1.5"
          >
            <div className="w-3 h-3 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            Saving...
          </motion.div>
        )}
        {state === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-green-500 flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            Saved
          </motion.div>
        )}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-destructive flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Error saving
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
