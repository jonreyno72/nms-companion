import type { EconomyTypeDef } from '@/types';

// Corrected against the community "No Man's Sky Economy Guide" reference:
// there are 7 real economy categories (not 12) — the wider list previously
// used mistook some of these "themes" (alternate in-game label text) for
// separate top-level categories. Kept here as `themes` so the edit-screen
// reference popover can show them without re-deriving the mapping.
export const ECONOMY_TYPES: EconomyTypeDef[] = [
  { id: 'unknown',            label: 'Unknown',            icon: '❓', themes: [] },
  { id: 'mining',             label: 'Mining',             icon: '⛏️', themes: ['Mining', 'Minerals', 'Ore Extraction', 'Prospecting'] },
  { id: 'manufacturing',      label: 'Manufacturing',      icon: '🏭', themes: ['Manufacturing', 'Industrial', 'Construction', 'Mass Production'] },
  { id: 'technology',         label: 'Technology',         icon: '💻', themes: ['High Tech', 'Technology', 'Nano-construction', 'Engineering'] },
  { id: 'power_generation',   label: 'Power Generation',   icon: '⚡', themes: ['Power Generation', 'Energy Supply', 'Fuel Generation', 'High Voltage'] },
  { id: 'trading',            label: 'Trading',            icon: '🛒', themes: ['Mercantile', 'Trading', 'Shipping', 'Commercial'] },
  { id: 'advanced_materials', label: 'Advanced Materials', icon: '🔩', themes: ['Material Fusion', 'Alchemical', 'Metal Processing', 'Ore Processing'] },
  { id: 'scientific',         label: 'Scientific',         icon: '🔬', themes: ['Research', 'Scientific', 'Experimental', 'Mathematical'] },
];
export const ECONOMY_TYPE_MAP = Object.fromEntries(ECONOMY_TYPES.map(e => [e.id, e])) as Record<string, EconomyTypeDef>;
