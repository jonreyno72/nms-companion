import type { GuildDef } from '@/types';
export const GUILDS: GuildDef[] = [
  { id: 'explorers',   label: 'Explorers',   icon: '🔭', color: '#3b9cef' },
  { id: 'merchants',   label: 'Merchants',   icon: '🛒', color: '#f5a623' },
  { id: 'mercenaries', label: 'Mercenaries', icon: '⚔️', color: '#e74c3c' },
  { id: 'unknown',     label: 'Unknown',     icon: '❓', color: '#7f8c8d' },
];
export const GUILD_MAP = Object.fromEntries(GUILDS.map(g => [g.id, g])) as Record<string, GuildDef>;
