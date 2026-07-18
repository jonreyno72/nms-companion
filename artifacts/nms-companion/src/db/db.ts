import { openDB, type IDBPDatabase } from 'idb';
import type { Station, AppSettings } from '@/types';

// Database name and version — bump DB_VERSION when adding new stores/indexes
const DB_NAME    = 'nms-companion';
const DB_VERSION = 2;

export interface NMSDatabase {
  stations: {
    key: string;
    value: Station;
    indexes: {
      'by-name':      string;
      'by-guild':     string;
      'by-favourite': number;    // 0 | 1 (IDB doesn't index booleans natively)
    };
  };
  settings: {
    key: string;
    value: AppSettings[keyof AppSettings];
  };
  // Future stores added here as new DB_VERSION increments:
  // ships:       { key: string; value: Ship; }
  // freighters:  { key: string; value: Freighter; }
}

let dbPromise: Promise<IDBPDatabase<NMSDatabase>> | null = null;

/**
 * Opens (or reuses) the IndexedDB database connection.
 * All migrations run inside upgrade() keyed by version number.
 */
export function getDb(): Promise<IDBPDatabase<NMSDatabase>> {
  if (!dbPromise) {
    dbPromise = openDB<NMSDatabase>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // v0 → v1: create stations store
        if (oldVersion < 1) {
          const stationsStore = db.createObjectStore('stations', { keyPath: 'id' });
          stationsStore.createIndex('by-name',      'name',      { unique: false });
          stationsStore.createIndex('by-guild',     'guildId',   { unique: false });
          stationsStore.createIndex('by-favourite', 'favourite', { unique: false });
        }
        // v1 → v2: add settings store (key/value) for app-level settings such
        // as lastBackupAt. Existing stations are left as-is; missing
        // stationType / exosuitUpgradePurchased fields are defaulted at read
        // time in stationRepository, not migrated in place, to keep this
        // upgrade fast and side-effect free.
        if (oldVersion < 2) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

/** Reset the singleton — used only in tests. */
export function resetDbForTesting(): void {
  dbPromise = null;
}
