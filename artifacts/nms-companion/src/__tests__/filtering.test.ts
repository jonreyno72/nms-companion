import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSearch } from '@/hooks/useSearch';
import type { Station } from '@/types';

describe('Filtering (useSearch)', () => {
  const stations: Station[] = [
    { id: '1', name: 'Alpha', guildId: 'explorers', raceId: 'korvax', favourite: true, rewards: ['storage_augmentation'], donationItems: [], notes: '', createdAt: 0, updatedAt: 0 },
    { id: '2', name: 'Beta', guildId: 'merchants', raceId: 'gek', favourite: false, rewards: ['cargo_bulkhead'], donationItems: [], notes: 'great economy', createdAt: 0, updatedAt: 0 },
    { id: '3', name: 'Gamma', guildId: 'mercenaries', raceId: 'vykeen', favourite: true, rewards: ['sclass_upgrade_modules'], donationItems: [], notes: '', createdAt: 0, updatedAt: 0 },
    { id: '4', name: 'Delta Terminus', guildId: 'explorers', raceId: 'unknown', favourite: false, rewards: [], donationItems: ['Carbon'], notes: '', createdAt: 0, updatedAt: 0 },
    { id: '5', name: 'Epsilon', guildId: 'unknown', raceId: 'unknown', favourite: false, rewards: [], donationItems: [], notes: 'has exotic', createdAt: 0, updatedAt: 0 },
  ];

  it('returns all stations when no filters applied', () => {
    const { result } = renderHook(() => useSearch(stations, { searchQuery: '', guildFilter: 'all', favouritesOnly: false }));
    expect(result.current.length).toBe(5);
  });

  it('filters by guild — only explorers returned', () => {
    const { result } = renderHook(() => useSearch(stations, { searchQuery: '', guildFilter: 'explorers', favouritesOnly: false }));
    expect(result.current.map(s => s.id)).toEqual(['1', '4']);
  });

  it('filters by favourites only', () => {
    const { result } = renderHook(() => useSearch(stations, { searchQuery: '', guildFilter: 'all', favouritesOnly: true }));
    expect(result.current.map(s => s.id)).toEqual(['1', '3']);
  });

  it('text search by station name (normalised)', () => {
    const { result } = renderHook(() => useSearch(stations, { searchQuery: 'delta', guildFilter: 'all', favouritesOnly: false }));
    expect(result.current.map(s => s.id)).toEqual(['4']);
  });

  it('text search by guild label text', () => {
    const { result } = renderHook(() => useSearch(stations, { searchQuery: 'mercenar', guildFilter: 'all', favouritesOnly: false }));
    expect(result.current.map(s => s.id)).toEqual(['3']);
  });

  it('text search by reward label', () => {
    const { result } = renderHook(() => useSearch(stations, { searchQuery: 'cargo', guildFilter: 'all', favouritesOnly: false }));
    expect(result.current.map(s => s.id)).toEqual(['2']);
  });

  it('combined filter: guild + favourites', () => {
    const { result } = renderHook(() => useSearch(stations, { searchQuery: '', guildFilter: 'explorers', favouritesOnly: true }));
    expect(result.current.map(s => s.id)).toEqual(['1']);
  });

  it('combined filter: guild + text search', () => {
    const { result } = renderHook(() => useSearch(stations, { searchQuery: 'term', guildFilter: 'explorers', favouritesOnly: false }));
    expect(result.current.map(s => s.id)).toEqual(['4']);
  });

  it('empty search returns all stations matching guild filter', () => {
    const { result } = renderHook(() => useSearch(stations, { searchQuery: '   ', guildFilter: 'merchants', favouritesOnly: false }));
    expect(result.current.map(s => s.id)).toEqual(['2']);
  });

  it('text search is case-insensitive and punctuation-agnostic', () => {
    const { result } = renderHook(() => useSearch(stations, { searchQuery: 'Al-pha', guildFilter: 'all', favouritesOnly: false }));
    expect(result.current.map(s => s.id)).toEqual(['1']);
  });
});
