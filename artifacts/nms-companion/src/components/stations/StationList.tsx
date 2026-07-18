import React from 'react';
import { Rocket } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import type { Station } from '@/types';
import { StationRow } from './StationRow';

interface Props {
  stations: Station[];
  onEdit: (station: Station) => void;
  onDelete: (id: string) => void;
  onToggleFavourite: (station: Station) => void;
}

export function StationList({ stations, onEdit, onDelete, onToggleFavourite }: Props) {
  if (stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6 bg-card border border-border border-dashed rounded-xl">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Rocket className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No stations found</h3>
        <p className="text-muted-foreground max-w-[250px]">
          Try adjusting your search filters or add a new space station.
        </p>
      </div>
    );
  }

  return (
    <ul role="list" className="flex flex-col gap-2 pb-24 lg:pb-6">
      <AnimatePresence mode="popLayout">
        {stations.map(station => (
          <StationRow
            key={station.id}
            station={station}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavourite={onToggleFavourite}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
