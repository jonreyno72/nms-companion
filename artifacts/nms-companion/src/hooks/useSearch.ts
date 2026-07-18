import { useMemo } from 'react';
import type { Station, FilterState, GuildId } from '@/types';
import { REWARD_MAP } from '@/constants/rewards';
import { normaliseName } from '@/utils/normalise';

/** Applies all active filters to the station list. Returns a filtered array. */
export function useSearch(stations: Station[], filters: FilterState): Station[] {
  return useMemo(() => {
    const q = normaliseName(filters.searchQuery);

    return stations.filter(station => {
      // Favourites filter
      if (filters.favouritesOnly && !station.favourite) return false;

      // Guild filter
      if (filters.guildFilter !== 'all' && station.guildId !== filters.guildFilter) return false;

      // Text search (name, guild, race, notes, rewards)
      if (q) {
        const haystack = [
          normaliseName(station.name),
          station.guildId,
          station.raceId,
          ...station.rewards.map(r => normaliseName(REWARD_MAP[r]?.label ?? r)),
          normaliseName(station.notes),
          ...station.donationItems.map(normaliseName),
        ].join(' ');
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [stations, filters]);
}
