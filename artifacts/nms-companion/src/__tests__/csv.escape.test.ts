import { describe, it, expect } from 'vitest';
import { escapeCsvField, stationsToCsv } from '@/utils/csvExport';
import type { Station } from '@/types';

describe('CSV Export', () => {
  describe('escapeCsvField', () => {
    it('does not quote plain strings', () => {
      expect(escapeCsvField('hello world')).toBe('hello world');
    });

    it('quotes strings containing commas', () => {
      expect(escapeCsvField('hello, world')).toBe('"hello, world"');
    });

    it('escapes double-quotes by doubling', () => {
      expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""');
    });

    it('quotes strings containing newlines', () => {
      expect(escapeCsvField('line1\nline2')).toBe('"line1\nline2"');
    });

    it('quotes strings containing carriage returns', () => {
      expect(escapeCsvField('line1\rline2')).toBe('"line1\rline2"');
    });

    it('handles empty string', () => {
      expect(escapeCsvField('')).toBe('');
    });
  });

  describe('stationsToCsv', () => {
    const testStations: Station[] = [
      {
        id: '1',
        name: 'Alpha Station',
        guildId: 'explorers',
        raceId: 'korvax',
        stationType: 'outlaw',
        economyType: 'mining',
        wealth: 2,
        exosuitUpgradePurchased: true,
        favourite: true,
        rewards: ['storage_augmentation', 'cargo_bulkhead'],
        donationItems: ['Carbon', 'Pugneum'],
        notes: 'Good ships, nice multi-tools',
        createdAt: 1000,
        updatedAt: 2000,
      }
    ];

    it('CSV output has correct header row', () => {
      const csv = stationsToCsv([]);
      expect(csv.split('\n')[0]).toBe(
        'ID,Name,Guild,Race,Station Type,Economy Type,Wealth,Favourite,Exosuit Upgrade Purchased,Rewards,Donation Items,Notes,Created At,Updated At'
      );
    });

    it('CSV output includes station data row with correct columns', () => {
      const csv = stationsToCsv(testStations);
      const rows = csv.split('\n');
      expect(rows.length).toBe(2);
      expect(rows[1]).toContain('Alpha Station');
    });

    it('CSV output shows Outlaw Station label for outlaw stations', () => {
      const csv = stationsToCsv(testStations);
      const dataRow = csv.split('\n')[1];
      expect(dataRow).toContain('Outlaw Station');
    });

    it('CSV output shows economy type label', () => {
      const csv = stationsToCsv(testStations);
      const dataRow = csv.split('\n')[1];
      expect(dataRow).toContain('Mining');
    });

    it('CSV output shows numeric wealth when set', () => {
      const csv = stationsToCsv(testStations);
      const dataRow = csv.split('\n')[1];
      const cells = dataRow.split(',');
      // Wealth is the 7th column (ID, Name, Guild, Race, Station Type, Economy Type, Wealth, ...)
      expect(cells[6]).toBe('2');
    });

    it('CSV output shows "Not set" for wealth when unset', () => {
      const csv = stationsToCsv([{ ...testStations[0], wealth: 0 }]);
      const dataRow = csv.split('\n')[1];
      expect(dataRow).toContain('Not set');
    });

    it('CSV output shows "Outlaw System" for wealth value 4', () => {
      const csv = stationsToCsv([{ ...testStations[0], wealth: 4 }]);
      const dataRow = csv.split('\n')[1];
      expect(dataRow).toContain('Outlaw System');
    });

    it('CSV output uses display labels not IDs for guild and race', () => {
      const csv = stationsToCsv(testStations);
      const dataRow = csv.split('\n')[1];
      expect(dataRow).toContain('Explorers');
      expect(dataRow).toContain('Korvax');
      expect(dataRow).not.toContain('explorers'); // except maybe in ID but we check the cell value
    });

    it('CSV output joins multiple rewards with semicolons', () => {
      const csv = stationsToCsv(testStations);
      const dataRow = csv.split('\n')[1];
      expect(dataRow).toContain('Storage Augmentation; Cargo Bulkhead');
    });
  });
});
