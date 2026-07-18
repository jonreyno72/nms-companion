import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface Props {
  show: boolean;
  onUpdate: () => void;
}

export function UpdatePrompt({ show, onUpdate }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-primary text-primary-foreground p-4 rounded-xl shadow-2xl flex items-center justify-between z-50"
        >
          <div className="text-sm font-medium">A new version is available!</div>
          <button
            onClick={onUpdate}
            className="px-4 py-2 bg-white text-primary rounded-lg text-sm font-bold shadow-sm hover:bg-opacity-90 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Update
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
