import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  visible: boolean;
}

export function DuplicateWarning({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-2 p-3 text-sm text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-md">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>A station with a similar name already exists.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
