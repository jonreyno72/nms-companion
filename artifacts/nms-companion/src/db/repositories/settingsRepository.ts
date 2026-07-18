/**
 * Settings repository — small key/value store for app-level settings that
 * aren't per-station, e.g. lastBackupAt. Same access rule as stationRepository:
 * this is the only place that touches the 'settings' IndexedDB store.
 */
import { getDb } from '@/db/db';

export const settingsRepository = {
  async getLastBackupAt(): Promise<number | null> {
    const db = await getDb();
    const value = await db.get('settings', 'lastBackupAt');
    return typeof value === 'number' ? value : null;
  },

  async setLastBackupAt(timestamp: number): Promise<void> {
    const db = await getDb();
    await db.put('settings', timestamp, 'lastBackupAt');
  },
};
