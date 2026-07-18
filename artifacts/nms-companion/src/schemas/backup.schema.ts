import { z } from 'zod';
import type { ImportWarning, Station } from '@/types';

const VALID_GUILD_IDS = ['explorers', 'merchants', 'mercenaries', 'unknown'] as const;
const VALID_RACE_IDS  = ['korvax', 'gek', 'vykeen', 'unknown'] as const;
const VALID_STATION_TYPES = ['space', 'outlaw'] as const;
const VALID_REWARD_IDS = [
  'salvaged_frigate_module', 'cargo_bulkhead', 'storage_augmentation',
  'exosuit_expansion_unit', 'multitool_expansion_slot',
  'exosuit_upgrade_chart', 'sclass_upgrade_modules', 'other',
] as const;

// Lenient station schema for parsing — unknown IDs are kept as-is and flagged as warnings
// after parsing, not rejected during parse.
export const RawStationSchema = z.object({
  id:            z.string().min(1),
  name:          z.string().min(1),
  guildId:       z.string(),
  raceId:        z.string(),
  // Both new in this version — optional so backups taken before this update still import cleanly.
  stationType:              z.string().optional(),
  exosuitUpgradePurchased:  z.boolean().optional(),
  favourite:     z.boolean(),
  rewards:       z.array(z.string()),
  donationItems: z.array(z.string()).default([]),
  notes:         z.string().default(''),
  createdAt:     z.number().int().positive(),
  updatedAt:     z.number().int().positive(),
});

export const BackupFileSchema = z.object({
  format:     z.literal('nms-companion'),
  version:    z.literal(1),
  exportedAt: z.string(),
  stations:   z.array(RawStationSchema),
});

// Validates the parsed stations and collects structured warnings for unknown IDs.
// Returns { stations: Station[], warnings: ImportWarning[] }
export function validateAndCoerceStations(
  rawStations: z.infer<typeof RawStationSchema>[]
): { stations: Station[]; warnings: ImportWarning[] } {
  const warnings: ImportWarning[] = [];
  const seenIds = new Set<string>();
  const stations: Station[] = [];

  rawStations.forEach((raw, idx) => {
    const name = raw.name;

    if (seenIds.has(raw.id)) {
      warnings.push({
        code: 'DUPLICATE_ID',
        stationIndex: idx,
        stationName: name,
        message: `Duplicate station ID "${raw.id}" at index ${idx}; a new ID will be assigned.`,
      });
    }
    seenIds.add(raw.id);

    // Validate guildId
    if (!VALID_GUILD_IDS.includes(raw.guildId as any)) {
      warnings.push({
        code: 'UNKNOWN_GUILD_ID',
        stationIndex: idx,
        stationName: name,
        message: `Unknown guild ID "${raw.guildId}" — defaulting to "unknown".`,
      });
    }

    // Validate raceId
    if (!VALID_RACE_IDS.includes(raw.raceId as any)) {
      warnings.push({
        code: 'UNKNOWN_RACE_ID',
        stationIndex: idx,
        stationName: name,
        message: `Unknown race ID "${raw.raceId}" — defaulting to "unknown".`,
      });
    }

    // Validate each reward
    const validatedRewards = raw.rewards.filter(r => {
      if (!VALID_REWARD_IDS.includes(r as any)) {
        warnings.push({
          code: 'UNKNOWN_REWARD_ID',
          stationIndex: idx,
          stationName: name,
          message: `Unknown reward ID "${r}" at index ${idx} removed.`,
        });
        return false;
      }
      return true;
    });

    const stationId = seenIds.has(raw.id) && warnings.some(w => w.code === 'DUPLICATE_ID' && w.stationIndex === idx)
      ? crypto.randomUUID()
      : raw.id;

    stations.push({
      id:            stationId,
      name:          raw.name,
      guildId:       VALID_GUILD_IDS.includes(raw.guildId as any) ? raw.guildId as any : 'unknown',
      raceId:        VALID_RACE_IDS.includes(raw.raceId as any) ? raw.raceId as any : 'unknown',
      stationType:   VALID_STATION_TYPES.includes(raw.stationType as any) ? raw.stationType as any : 'space',
      exosuitUpgradePurchased: raw.exosuitUpgradePurchased ?? false,
      favourite:     raw.favourite,
      rewards:       validatedRewards as any[],
      donationItems: raw.donationItems,
      notes:         raw.notes,
      createdAt:     raw.createdAt,
      updatedAt:     raw.updatedAt,
    });
  });

  return { stations, warnings };
}
