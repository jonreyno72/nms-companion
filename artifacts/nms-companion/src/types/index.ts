// ─── Stable ID types ──────────────────────────────────────────────────────────
export type GuildId = 'explorers' | 'merchants' | 'mercenaries' | 'unknown';
export type RaceId = 'korvax' | 'gek' | 'vykeen' | 'unknown';
export type StationType = 'space' | 'outlaw';
export type EconomyTypeId =
  | 'unknown'
  | 'advanced_materials'
  | 'scientific'
  | 'technology'
  | 'manufacturing'
  | 'mining'
  | 'power_generation'
  | 'trading'
  | 'commercial'
  | 'industrial'
  | 'construction'
  | 'high_tech'
  | 'agricultural';
/** 0 = not set. 1-3 = wealth rating. Kept as a plain number rather than a
 * boolean tuple so it can be compared/filtered like the star count it represents. */
export type WealthRating = 0 | 1 | 2 | 3;

// Rewards:
//   storage_augmentation   = expands STARSHIP inventory
//   exosuit_expansion_unit = expands EXOSUIT inventory
export type RewardId =
  | 'salvaged_frigate_module'
  | 'cargo_bulkhead'
  | 'storage_augmentation'       // starship inventory expansion
  | 'exosuit_expansion_unit'     // exosuit inventory expansion
  | 'multitool_expansion_slot'
  | 'exosuit_upgrade_chart'
  | 'sclass_upgrade_modules'
  | 'other';

// ─── Constant definition shapes ────────────────────────────────────────────────
export interface GuildDef  { id: GuildId;  label: string; icon: string; color: string; }
export interface RaceDef   { id: RaceId;   label: string; icon: string; }
export interface RewardDef { id: RewardId; label: string; shortLabel: string; icon: string; }
export interface EconomyTypeDef { id: EconomyTypeId; label: string; icon: string; description: string; }

// ─── Core entity ────────────────────────────────────────────────────────────────
export interface Station {
  id: string;           // UUID v4
  name: string;
  guildId: GuildId;
  raceId: RaceId;
  stationType: StationType;          // 'space' (default) | 'outlaw'
  economyType: EconomyTypeId;        // 'unknown' (default) or one of the 12 economy types
  wealth: WealthRating;              // 0 (not set) to 3
  exosuitUpgradePurchased: boolean;  // whether the exosuit upgrade chart reward has been redeemed
  favourite: boolean;
  rewards: RewardId[];
  donationItems: string[];   // free-text list (one item per entry)
  notes: string;
  createdAt: number;         // Unix ms
  updatedAt: number;         // Unix ms
}

// ─── Draft state: editable fields only ─────────────────────────────────────────
// id, createdAt, updatedAt are retained OUTSIDE the draft; never editable
export interface StationDraft {
  name: string;
  guildId: GuildId;
  raceId: RaceId;
  stationType: StationType;
  economyType: EconomyTypeId;
  wealth: WealthRating;
  exosuitUpgradePurchased: boolean;
  favourite: boolean;
  rewards: RewardId[];
  donationItems: string[];
  notes: string;
}

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

// ─── Backup envelope ────────────────────────────────────────────────────────────
export interface BackupFile {
  format: 'nms-companion';
  version: 1;
  exportedAt: string;    // ISO 8601
  stations: Station[];
}

// ─── Import warning (structured) ────────────────────────────────────────────────
export type ImportWarningCode =
  | 'UNKNOWN_GUILD_ID'
  | 'UNKNOWN_RACE_ID'
  | 'UNKNOWN_REWARD_ID'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_FIELD_TYPE'
  | 'DUPLICATE_ID';

export interface ImportWarning {
  code: ImportWarningCode;
  stationIndex?: number;
  stationName?: string;
  message: string;
}

export interface ImportPreview {
  stations: Station[];
  count: number;
  warnings: ImportWarning[];
}

export type ImportMode = 'merge' | 'replace';

// ─── Filter state ────────────────────────────────────────────────────────────────
export interface FilterState {
  searchQuery: string;
  guildFilter: GuildId | 'all';
  favouritesOnly: boolean;
  outlawOnly: boolean;
  exosuitNotPurchasedOnly: boolean;
  /** 'all' = no wealth filter. '1'/'2'/'3' = exact match. 'none' = wealth not set (0). */
  wealthFilter: 'all' | '1' | '2' | '3' | 'none';
}

// ─── App settings (persisted separately from stations) ────────────────────────
export interface AppSettings {
  lastBackupAt: number | null; // Unix ms, set whenever a JSON export is taken
}

// ─── Future entity placeholders (kept visible for migration planning) ────────────
// interface Ship       { id: string; /* ... */ }
// interface Freighter  { id: string; /* ... */ }
// interface Settlement { id: string; /* ... */ }
// interface Base       { id: string; /* ... */ }
// interface MultiTool  { id: string; /* ... */ }
