import { useState, useCallback } from 'react';
import type { Station, StationDraft } from '@/types';

/**
 * Manages an in-memory draft for station editing.
 *
 * The draft contains only editable fields.
 * The original station's id, createdAt, and updatedAt are preserved
 * separately and merged back at save time.
 */
export function useDraft() {
  const [draft,    setDraft]    = useState<StationDraft | null>(null);
  const [original, setOriginal] = useState<Station | null>(null);   // null = creating new

  const initNew = useCallback(() => {
    setOriginal(null);
    setDraft({
      name: '', guildId: 'unknown', raceId: 'unknown',
      favourite: false, rewards: [], donationItems: [], notes: '',
    });
  }, []);

  const initEdit = useCallback((station: Station) => {
    setOriginal(station);
    setDraft({
      name:          station.name,
      guildId:       station.guildId,
      raceId:        station.raceId,
      favourite:     station.favourite,
      rewards:       [...station.rewards],
      donationItems: [...station.donationItems],
      notes:         station.notes,
    });
  }, []);

  const update = useCallback(<K extends keyof StationDraft>(
    key: K, value: StationDraft[K]
  ) => {
    setDraft(prev => prev ? { ...prev, [key]: value } : prev);
  }, []);

  const cancel = useCallback(() => {
    setDraft(null);
    setOriginal(null);
  }, []);

  /**
   * Builds the full Station object from the draft, retaining the original's
   * id and createdAt (or generating them fresh for a new station).
   */
  const buildStation = useCallback((): Station | null => {
    if (!draft) return null;
    const now = Date.now();
    return {
      id:        original?.id        ?? crypto.randomUUID(),
      createdAt: original?.createdAt ?? now,
      updatedAt: now,
      ...draft,
    };
  }, [draft, original]);

  return { draft, original, initNew, initEdit, update, cancel, buildStation };
}
