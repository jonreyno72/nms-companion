import type { StationType } from '@/types';

export interface StationTypeDef { id: StationType; label: string; icon: string; }

export const STATION_TYPES: StationTypeDef[] = [
  { id: 'space',  label: 'Space Station',  icon: '🛰️' },
  { id: 'outlaw', label: 'Outlaw Station', icon: '☠️' },
];
export const STATION_TYPE_MAP = Object.fromEntries(STATION_TYPES.map(t => [t.id, t])) as Record<string, StationTypeDef>;
