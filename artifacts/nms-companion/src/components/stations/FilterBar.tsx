import React from 'react';
import type { FilterState, GuildId } from '@/types';
import { GUILDS } from '@/constants/guilds';
import { Star } from 'lucide-react';

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
      <button
        onClick={() => onChange({ ...filters, guildFilter: 'all', favouritesOnly: false })}
        aria-pressed={filters.guildFilter === 'all' && !filters.favouritesOnly}
        className={`touch-target px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
          filters.guildFilter === 'all' && !filters.favouritesOnly
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        All Stations
      </button>
      
      {GUILDS.filter(g => g.id !== 'unknown').map(guild => (
        <button
          key={guild.id}
          onClick={() => onChange({ ...filters, guildFilter: guild.id, favouritesOnly: false })}
          aria-pressed={filters.guildFilter === guild.id}
          className={`touch-target px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            filters.guildFilter === guild.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          <span>{guild.icon}</span> {guild.label}
        </button>
      ))}

      <button
        onClick={() => onChange({ ...filters, favouritesOnly: !filters.favouritesOnly, guildFilter: 'all' })}
        aria-pressed={filters.favouritesOnly}
        className={`touch-target px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
          filters.favouritesOnly
            ? 'bg-accent text-accent-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        <Star className={`w-4 h-4 ${filters.favouritesOnly ? 'fill-current' : ''}`} /> Favourites
      </button>
    </div>
  );
}
