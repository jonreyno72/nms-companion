/**
 * Station repository — the ONLY place IndexedDB is accessed for stations.
 * React components and hooks must not import from 'idb' or 'db.ts' directly.
 */
import { getDb } from '@/db/db';
import type { Station } from '@/types';

export const stationRepository = {
  /** Return all stations sorted by name. */
  async getAll(): Promise<Station[]> {
    const db = await getDb();
    return db.getAllFromIndex('stations', 'by-name');
  },

  /** Return a single station by ID, or undefined. */
  async getById(id: string): Promise<Station | undefined> {
    const db = await getDb();
    return db.get('stations', id);
  },

  /** Insert or update a station (upsert). */
  async save(station: Station): Promise<void> {
    const db = await getDb();
    await db.put('stations', station);
  },

  /** Delete a station by ID. */
  async delete(id: string): Promise<void> {
    const db = await getDb();
    await db.delete('stations', id);
  },

  /** Replace ALL stations atomically (for import-replace). */
  async replaceAll(stations: Station[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction('stations', 'readwrite');
    await tx.store.clear();
    await Promise.all(stations.map(s => tx.store.put(s)));
    await tx.done;
  },

  /** Merge stations into existing data (upsert by ID, no deletions). */
  async mergeAll(stations: Station[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction('stations', 'readwrite');
    await Promise.all(stations.map(s => tx.store.put(s)));
    await tx.done;
  },

  /** Return all stations as a raw array (for export). */
  async exportAll(): Promise<Station[]> {
    const db = await getDb();
    return db.getAll('stations');
  },
};
