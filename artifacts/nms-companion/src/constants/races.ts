import type { RaceDef } from '@/types';
export const RACES: RaceDef[] = [
  { id: 'korvax', label: "Korvax",   icon: '🤖' },
  { id: 'gek',    label: 'Gek',      icon: '🦎' },
  { id: 'vykeen', label: "Vy'keen",  icon: '⚔️' },
  { id: 'unknown', label: 'Unknown', icon: '❓' },
];
export const RACE_MAP = Object.fromEntries(RACES.map(r => [r.id, r])) as Record<string, RaceDef>;
