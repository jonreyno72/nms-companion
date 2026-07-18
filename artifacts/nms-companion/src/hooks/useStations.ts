import { useState, useEffect, useCallback } from 'react';
import { stationRepository } from '@/db/repositories/stationRepository';
import type { Station } from '@/types';

/**
 * Provides the full station list and a reload function.
 * Components should call reload() after any mutation.
 */
export function useStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading,  setLoading]  = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await stationRepository.getAll();
      setStations(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { stations, loading, reload };
}
