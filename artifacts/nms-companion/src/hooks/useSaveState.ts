import { useState, useRef, useCallback } from 'react';
import type { SaveState } from '@/types';

/**
 * Manages saving state with debounce and a brief "Saved" flash period.
 */
export function useSaveState(debounceMs = 600) {
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async (fn: () => Promise<void>) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      setSaveState('saving');
      try {
        await fn();
        setSaveState('saved');
        // Reset to idle after 2 s
        setTimeout(() => setSaveState('idle'), 2000);
      } catch {
        setSaveState('error');
      }
    }, debounceMs);
  }, [debounceMs]);

  return { saveState, save };
}
