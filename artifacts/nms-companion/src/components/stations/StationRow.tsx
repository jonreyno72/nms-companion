import React from 'react';
import { motion } from 'framer-motion';
import { Star, Edit2, Trash2 } from 'lucide-react';
import type { Station } from '@/types';
import { GUILD_MAP } from '@/constants/guilds';
import { RACE_MAP } from '@/constants/races';
import { REWARD_MAP } from '@/constants/rewards';

interface Props {
  station: Station;
  onEdit: (station: Station) => void;
  onDelete: (id: string) => void;
  onToggleFavourite: (station: Station) => void;
}

export function StationRow({ station, onEdit, onDelete, onToggleFavourite }: Props) {
  const guild = GUILD_MAP[station.guildId];
  const race = RACE_MAP[station.raceId];

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="group flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
      role="listitem"
      aria-label={`${station.name}, ${guild?.label || 'Unknown'} station`}
    >
      <button
        onClick={() => onToggleFavourite(station)}
        className="touch-target text-muted-foreground hover:text-accent transition-colors shrink-0"
        aria-label={station.favourite ? "Remove from favourites" : "Add to favourites"}
        aria-pressed={station.favourite}
      >
        <Star className={`w-6 h-6 ${station.favourite ? 'fill-accent text-accent' : ''}`} />
      </button>

      <div className="flex-1 min-w-0 flex flex-col gap-1 cursor-pointer" onClick={() => onEdit(station)}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg truncate text-foreground leading-tight">
            {station.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          {guild && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-muted">
              {guild.icon} {guild.label}
            </span>
          )}
          {race && race.id !== 'unknown' && (
            <span className="inline-flex items-center gap-1 text-xs">
              {race.icon} {race.label}
            </span>
          )}
        </div>

        {station.rewards.length > 0 && (
          <div className="flex gap-1 mt-1 overflow-x-auto scrollbar-hide shrink-0 pb-1">
            {station.rewards.map(rId => {
              const reward = REWARD_MAP[rId];
              if (!reward) return null;
              return (
                <span key={rId} className="inline-flex items-center justify-center w-6 h-6 bg-input rounded text-sm shrink-0" title={reward.label}>
                  {reward.icon}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(station)}
          className="touch-target text-muted-foreground hover:text-primary transition-colors"
          aria-label="Edit station"
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete ${station.name}?`)) {
              onDelete(station.id);
            }
          }}
          className="touch-target text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete station"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.li>
  );
}
