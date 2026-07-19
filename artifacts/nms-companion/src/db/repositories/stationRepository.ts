/**
 * Station repository — the ONLY place IndexedDB is accessed for stations.
 * React components and hooks must not import from 'idb' or 'db.ts' directly.
 */
import { getDb } from '@/db/db';
import type { Station } from '@/types';
import { ECONOMY_TYPE_MAP } from '@/constants/economyTypes';

/**
 * Stations saved before stationType / exosuitUpgradePurchased existed won't
 * have those fields in IndexedDB. Default them on read rather than running a
 * one-off migration, so old records display correctly without a write pass.
 *
 * Also handles the Economy Type correction (12 invented categories -> the
 * real 7): any station already saved with one of the dropped values
 * (e.g. 'commercial', 'industrial') falls back to 'unknown' on read, same as
 * a missing/unset value, rather than showing a value the dropdown no longer
 * offers.
 */
function withDefaults(station: Station): Station {
  // Cast: records saved before these fields existed won't actually have them
  // in IndexedDB at runtime, even though the Station type says they're required.
  const raw = station as Partial<Pick<Station, 'stationType' | 'exosuitUpgradePurchased' | 'economyType' | 'wealth'>> & Station;
  const economyType = raw.economyType && ECONOMY_TYPE_MAP[raw.economyType] ? raw.economyType : 'unknown';
  return {
    ...raw,
    stationType: raw.stationType ?? 'space',
    exosuitUpgradePurchased: raw.exosuitUpgradePurchased ?? false,
    economyType,
    wealth: raw.wealth ?? 0,
  };
}

export const stationRepository = {
  /** Return all stations sorted by name. */
  async getAll(): Promise<Station[]> {
    const db = await getDb();
    const stations = await db.getAllFromIndex('stations', 'by-name');
    return stations.map(withDefaults);
  },

  /** Return a single station by ID, or undefined. */
  async getById(id: string): Promise<Station | undefined> {
    const db = await getDb();
    const station = await db.get('stations', id);
    return station ? withDefaults(station) : undefined;
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
    const stations = await db.getAll('stations');
    return stations.map(withDefaults);
  },
};
