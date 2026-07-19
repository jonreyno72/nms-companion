import type { RewardDef } from '@/types';
// storage_augmentation = STARSHIP inventory expansion
// exosuit_expansion_unit = EXOSUIT inventory expansion
export const REWARDS: RewardDef[] = [
  { id: 'salvaged_frigate_module', label: 'Salvaged Frigate Module', shortLabel: 'Frigate Mod',      icon: '⚓' },
  { id: 'cargo_bulkhead',          label: 'Cargo Bulkhead',          shortLabel: 'Cargo Bulkhead',   icon: '📦' },
  { id: 'storage_augmentation',    label: 'Storage Augmentation',    shortLabel: 'Ship Storage',     icon: '🚀' },
  { id: 'exosuit_expansion_unit',  label: 'Exosuit Expansion Unit',  shortLabel: 'Exosuit Slot',     icon: '🧥' },
  { id: 'multitool_expansion_slot', label: 'Multi-tool Expansion Slot', shortLabel: 'Multitool Slot', icon: '🔧' },
  { id: 'exosuit_upgrade_chart',   label: 'Exosuit Upgrade Chart',   shortLabel: 'Exosuit Chart',    icon: '📋' },
  { id: 'sclass_upgrade_modules',  label: 'S-Class Upgrade Modules', shortLabel: 'S-Class Mods',     icon: '💎' },
  { id: 'other',                   label: 'Other',                   shortLabel: 'Other',             icon: '➕' },
];
export const REWARD_MAP = Object.fromEntries(REWARDS.map(r => [r.id, r])) as Record<string, RewardDef>;
