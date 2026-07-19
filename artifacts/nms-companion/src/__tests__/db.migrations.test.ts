import { describe, it, expect, beforeEach } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { stationRepository } from '@/db/repositories/stationRepository';
import { resetDbForTesting } from '@/db/db';
import type { Station } from '@/types';

// Setup fake-indexeddb globally before tests run
beforeEach(() => {
  globalThis.indexedDB = new IDBFactory();
  resetDbForTesting();
});

const makeStation = (id: string, name: string): Station => ({
  id, name, guildId: 'unknown', raceId: 'unknown', stationType: 'space',
  economyType: 'unknown', wealth: 0,
  exosuitUpgradePurchased: false, favourite: false, rewards: [], donationItems: [], notes: '', createdAt: 0, updatedAt: 0
});

describe('Database Migrations & Repositories', () => {
  it('saves and retrieves a station by ID', async () => {
    const s = makeStation('1', 'Test');
    await stationRepository.save(s);
    const retrieved = await stationRepository.getById('1');
    expect(retrieved).toEqual(s);
  });

  it('getAll returns stations sorted by name', async () => {
    await stationRepository.save(makeStation('1', 'Zeta'));
    await stationRepository.save(makeStation('2', 'Alpha'));
    await stationRepository.save(makeStation('3', 'Beta'));
    
    const all = await stationRepository.getAll();
    expect(all.map(s => s.name)).toEqual(['Alpha', 'Beta', 'Zeta']);
  });

  it('delete removes a station', async () => {
    await stationRepository.save(makeStation('1', 'Test'));
    await stationRepository.delete('1');
    const retrieved = await stationRepository.getById('1');
    expect(retrieved).toBeUndefined();
  });

  it('replaceAll replaces all existing stations', async () => {
    await stationRepository.save(makeStation('1', 'Old 1'));
    await stationRepository.save(makeStation('2', 'Old 2'));
    
    const newStations = [makeStation('3', 'New 3')];
    await stationRepository.replaceAll(newStations);
    
    const all = await stationRepository.getAll();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe('3');
  });

  it('mergeAll upserts without deleting existing stations', async () => {
    await stationRepository.save(makeStation('1', 'Old 1'));
    await stationRepository.save(makeStation('2', 'Old 2'));
    
    const mergeStations = [makeStation('2', 'Updated 2'), makeStation('3', 'New 3')];
    await stationRepository.mergeAll(mergeStations);
    
    const all = await stationRepository.getAll();
    expect(all.length).toBe(3);
    expect(all.find(s => s.id === '2')?.name).toBe('Updated 2');
  });

  it('save updates an existing station', async () => {
    await stationRepository.save(makeStation('1', 'Old'));
    const updated = makeStation('1', 'New');
    await stationRepository.save(updated);
    
    const retrieved = await stationRepository.getById('1');
    expect(retrieved?.name).toBe('New');
  });

  it('exportAll returns all stations', async () => {
    await stationRepository.save(makeStation('1', 'A'));
    await stationRepository.save(makeStation('2', 'B'));
    
    const exported = await stationRepository.exportAll();
    expect(exported.length).toBe(2);
  });

  it('handles empty store gracefully', async () => {
    const all = await stationRepository.getAll();
    expect(all).toEqual([]);
    
    const retrieved = await stationRepository.getById('999');
    expect(retrieved).toBeUndefined();
  });

  it('defaults stationType and exosuitUpgradePurchased for legacy records missing those fields', async () => {
    // Simulate a station saved before these fields existed by casting past the type.
    const legacy = { ...makeStation('legacy-1', 'Old Record') } as any;
    delete legacy.stationType;
    delete legacy.exosuitUpgradePurchased;
    await stationRepository.save(legacy);

    const retrieved = await stationRepository.getById('legacy-1');
    expect(retrieved?.stationType).toBe('space');
    expect(retrieved?.exosuitUpgradePurchased).toBe(false);

    const all = await stationRepository.getAll();
    expect(all.find(s => s.id === 'legacy-1')?.stationType).toBe('space');

    const exported = await stationRepository.exportAll();
    expect(exported.find(s => s.id === 'legacy-1')?.stationType).toBe('space');
  });

  it('defaults economyType and wealth for legacy records missing those fields', async () => {
    const legacy = { ...makeStation('legacy-2', 'Older Record') } as any;
    delete legacy.economyType;
    delete legacy.wealth;
    await stationRepository.save(legacy);

    const retrieved = await stationRepository.getById('legacy-2');
    expect(retrieved?.economyType).toBe('unknown');
    expect(retrieved?.wealth).toBe(0);
  });

  it('falls back to unknown for a station saved with a since-removed economy type category', async () => {
    // Simulates a station saved while the app briefly had 12 economy type
    // options (Commercial/Industrial/Construction/High Tech/Agricultural),
    // before it was corrected to the real 7 categories.
    const legacy = { ...makeStation('legacy-3', 'Farm World'), economyType: 'agricultural' } as any;
    await stationRepository.save(legacy);

    const retrieved = await stationRepository.getById('legacy-3');
    expect(retrieved?.economyType).toBe('unknown');

    const all = await stationRepository.getAll();
    expect(all.find(s => s.id === 'legacy-3')?.economyType).toBe('unknown');
  });
});
