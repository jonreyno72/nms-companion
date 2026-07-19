import React from 'react';
import type { FilterState, GuildId } from '@/types';
import { GUILDS } from '@/constants/guilds';
import { Star } from 'lucide-react';

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  const isDefault = filters.guildFilter === 'all' && !filters.favouritesOnly
    && !filters.outlawOnly && !filters.exosuitNotPurchasedOnly && filters.wealthFilter === 'all';

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
      <button
        onClick={() => onChange({
          ...filters, guildFilter: 'all', favouritesOnly: false,
          outlawOnly: false, exosuitNotPurchasedOnly: false, wealthFilter: 'all',
        })}
        aria-pressed={isDefault}
        className={`touch-target shrink-0 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
          isDefault
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        All Stations
      </button>

      <button
        onClick={() => onChange({ ...filters, favouritesOnly: !filters.favouritesOnly, guildFilter: 'all' })}
        aria-pressed={filters.favouritesOnly}
        className={`touch-target shrink-0 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
          filters.favouritesOnly
            ? 'bg-accent text-accent-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        <Star className={`w-4 h-4 ${filters.favouritesOnly ? 'fill-current' : ''}`} /> Favourites
      </button>

      <select
        value={filters.guildFilter}
        onChange={e => onChange({ ...filters, guildFilter: e.target.value as GuildId | 'all', favouritesOnly: false })}
        aria-label="Filter by guild"
        className={`touch-target shrink-0 px-4 rounded-full text-sm font-medium whitespace-nowrap border-none ${
          filters.guildFilter !== 'all'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <option value="all">Guild: All</option>
        {GUILDS.filter(g => g.id !== 'unknown').map(guild => (
          <option key={guild.id} value={guild.id}>{guild.icon} {guild.label}</option>
        ))}
      </select>

      <button
        onClick={() => onChange({ ...filters, outlawOnly: !filters.outlawOnly })}
        aria-pressed={filters.outlawOnly}
        className={`touch-target shrink-0 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
          filters.outlawOnly
            ? 'bg-destructive text-destructive-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        ☠️ Outlaw Only
      </button>

      <button
        onClick={() => onChange({ ...filters, exosuitNotPurchasedOnly: !filters.exosuitNotPurchasedOnly })}
        aria-pressed={filters.exosuitNotPurchasedOnly}
        aria-label="Filter: Exosuit upgrade not purchased"
        title="Exosuit upgrade not purchased"
        className={`touch-target shrink-0 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
          filters.exosuitNotPurchasedOnly
            ? 'bg-accent text-accent-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        🧥 Exosuit
      </button>

      <select
        value={filters.wealthFilter}
        onChange={e => onChange({ ...filters, wealthFilter: e.target.value as FilterState['wealthFilter'] })}
        aria-label="Filter by wealth"
        className={`touch-target shrink-0 px-4 rounded-full text-sm font-medium whitespace-nowrap border-none ${
          filters.wealthFilter !== 'all'
            ? 'bg-accent text-accent-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <option value="all">Wealth: All</option>
        <option value="3">★★★ (3)</option>
        <option value="2">★★☆ (2)</option>
        <option value="1">★☆☆ (1)</option>
        <option value="4">💀 Outlaw System</option>
        <option value="none">No information set</option>
      </select>
    </div>
  );
}
