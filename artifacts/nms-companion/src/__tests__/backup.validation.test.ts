import { describe, it, expect } from 'vitest';
import { BackupFileSchema, validateAndCoerceStations } from '@/schemas/backup.schema';
import type { BackupFile } from '@/types';

describe('Backup Validation', () => {
  const validStation = {
    id: '123',
    name: 'Test Station',
    guildId: 'explorers',
    raceId: 'korvax',
    favourite: true,
    rewards: ['storage_augmentation'],
    donationItems: ['Carbon'],
    notes: 'A note',
    createdAt: 1000,
    updatedAt: 1000,
  };

  it('accepts a valid backup file', () => {
    const file = {
      format: 'nms-companion',
      version: 1,
      exportedAt: new Date().toISOString(),
      stations: [validStation],
    };
    expect(() => BackupFileSchema.parse(file)).not.toThrow();
    
    const { warnings } = validateAndCoerceStations([validStation]);
    expect(warnings).toHaveLength(0);
  });

  it('rejects wrong format literal', () => {
    const file = { format: 'wrong', version: 1, exportedAt: '', stations: [] };
    expect(() => BackupFileSchema.parse(file)).toThrow();
  });

  it('rejects wrong version', () => {
    const file = { format: 'nms-companion', version: 2, exportedAt: '', stations: [] };
    expect(() => BackupFileSchema.parse(file)).toThrow();
  });

  it('rejects missing stations array', () => {
    const file = { format: 'nms-companion', version: 1, exportedAt: '' };
    expect(() => BackupFileSchema.parse(file)).toThrow();
  });

  it('rejects station with missing name', () => {
    const s = { ...validStation, name: '' };
    const file = { format: 'nms-companion', version: 1, exportedAt: '', stations: [s] };
    expect(() => BackupFileSchema.parse(file)).toThrow();
  });

  it('accepts station with unknown guildId and adds warning', () => {
    const s = { ...validStation, guildId: 'pirates' };
    const { stations, warnings } = validateAndCoerceStations([s]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].code).toBe('UNKNOWN_GUILD_ID');
    expect(stations[0].guildId).toBe('unknown');
  });

  it('accepts station with unknown raceId and adds warning', () => {
    const s = { ...validStation, raceId: 'robot' };
    const { stations, warnings } = validateAndCoerceStations([s]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].code).toBe('UNKNOWN_RACE_ID');
    expect(stations[0].raceId).toBe('unknown');
  });

  it('accepts station with unknown rewardId, removes it, adds warning', () => {
    const s = { ...validStation, rewards: ['storage_augmentation', 'magic_wand'] };
    const { stations, warnings } = validateAndCoerceStations([s]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].code).toBe('UNKNOWN_REWARD_ID');
    expect(stations[0].rewards).toEqual(['storage_augmentation']);
  });

  it('detects duplicate IDs and assigns new ID to duplicate', () => {
    const s2 = { ...validStation, name: 'Duplicate' };
    const { stations, warnings } = validateAndCoerceStations([validStation, s2]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].code).toBe('DUPLICATE_ID');
    expect(stations[0].id).toBe('123');
    expect(stations[1].id).not.toBe('123');
    expect(stations[1].id.length).toBeGreaterThan(0);
  });

  it('coerces missing donationItems to empty array', () => {
    const { donationItems, ...rest } = validStation;
    const parsed = BackupFileSchema.parse({
      format: 'nms-companion', version: 1, exportedAt: '', stations: [rest]
    });
    expect(parsed.stations[0].donationItems).toEqual([]);
  });

  it('coerces missing notes to empty string', () => {
    const { notes, ...rest } = validStation;
    const parsed = BackupFileSchema.parse({
      format: 'nms-companion', version: 1, exportedAt: '', stations: [rest]
    });
    expect(parsed.stations[0].notes).toBe('');
  });
});
