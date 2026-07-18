import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSearch } from '@/hooks/useSearch';
import type { Station, FilterState } from '@/types';

const baseFilters: FilterState = {
  searchQuery: '', guildFilter: 'all', favouritesOnly: false,
  outlawOnly: false, exosuitNotPurchasedOnly: false,
};

describe('Filtering (useSearch)', () => {
  const stations: Station[] = [
    { id: '1', name: 'Alpha', guildId: 'explorers', raceId: 'korvax', stationType: 'space', exosuitUpgradePurchased: true, favourite: true, rewards: ['storage_augmentation'], donationItems: [], notes: '', createdAt: 0, updatedAt: 0 },
    { id: '2', name: 'Beta', guildId: 'merchants', raceId: 'gek', stationType: 'outlaw', exosuitUpgradePurchased: false, favourite: false, rewards: ['cargo_bulkhead'], donationItems: [], notes: 'great economy', createdAt: 0, updatedAt: 0 },
    { id: '3', name: 'Gamma', guildId: 'mercenaries', raceId: 'vykeen', stationType: 'space', exosuitUpgradePurchased: false, favourite: true, rewards: ['sclass_upgrade_modules'], donationItems: [], notes: '', createdAt: 0, updatedAt: 0 },
    { id: '4', name: 'Delta Terminus', guildId: 'explorers', raceId: 'unknown', stationType: 'space', exosuitUpgradePurchased: true, favourite: false, rewards: [], donationItems: ['Carbon'], notes: '', createdAt: 0, updatedAt: 0 },
    { id: '5', name: 'Epsilon', guildId: 'unknown', raceId: 'unknown', stationType: 'outlaw', exosuitUpgradePurchased: false, favourite: false, rewards: [], donationItems: [], notes: 'has exotic', createdAt: 0, updatedAt: 0 },
  ];

  it('returns all stations when no filters applied', () => {
    const { result } = renderHook(() => useSearch(stations, baseFilters));
    expect(result.current.length).toBe(5);
  });

  it('filters by guild — only explorers returned', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, guildFilter: 'explorers' }));
    expect(result.current.map(s => s.id)).toEqual(['1', '4']);
  });

  it('filters by favourites only', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, favouritesOnly: true }));
    expect(result.current.map(s => s.id)).toEqual(['1', '3']);
  });

  it('filters by outlaw stations only', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, outlawOnly: true }));
    expect(result.current.map(s => s.id)).toEqual(['2', '5']);
  });

  it('filters by exosuit upgrade not purchased', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, exosuitNotPurchasedOnly: true }));
    expect(result.current.map(s => s.id)).toEqual(['2', '3', '5']);
  });

  it('combines outlaw-only and exosuit-not-purchased filters', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, outlawOnly: true, exosuitNotPurchasedOnly: true }));
    expect(result.current.map(s => s.id)).toEqual(['2', '5']);
  });

  it('text search by station name (normalised)', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, searchQuery: 'delta' }));
    expect(result.current.map(s => s.id)).toEqual(['4']);
  });

  it('text search by guild label text', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, searchQuery: 'mercenar' }));
    expect(result.current.map(s => s.id)).toEqual(['3']);
  });

  it('text search by reward label', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, searchQuery: 'cargo' }));
    expect(result.current.map(s => s.id)).toEqual(['2']);
  });

  it('combined filter: guild + favourites', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, guildFilter: 'explorers', favouritesOnly: true }));
    expect(result.current.map(s => s.id)).toEqual(['1']);
  });

  it('combined filter: guild + text search', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, guildFilter: 'explorers', searchQuery: 'term' }));
    expect(result.current.map(s => s.id)).toEqual(['4']);
  });

  it('empty search returns all stations matching guild filter', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, guildFilter: 'merchants', searchQuery: '   ' }));
    expect(result.current.map(s => s.id)).toEqual(['2']);
  });

  it('text search is case-insensitive and punctuation-agnostic', () => {
    const { result } = renderHook(() => useSearch(stations, { ...baseFilters, searchQuery: 'Al-pha' }));
    expect(result.current.map(s => s.id)).toEqual(['1']);
  });
});
