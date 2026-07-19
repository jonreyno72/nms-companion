import type { EconomyTypeDef } from '@/types';

export const ECONOMY_TYPES: EconomyTypeDef[] = [
  { id: 'unknown',            label: 'Unknown',            icon: '❓', description: 'Not yet checked' },
  { id: 'advanced_materials', label: 'Advanced Materials', icon: '🔩', description: 'Refined materials, high-tech components, construction products' },
  { id: 'scientific',         label: 'Scientific',         icon: '🔬', description: 'Technology, research, nanite-related goods' },
  { id: 'technology',         label: 'Technology',         icon: '💻', description: 'Electronics and advanced technology' },
  { id: 'manufacturing',      label: 'Manufacturing',      icon: '🏭', description: 'Industrial products and manufactured goods' },
  { id: 'mining',             label: 'Mining',             icon: '⛏️', description: 'Metals, minerals, ores' },
  { id: 'power_generation',   label: 'Power Generation',   icon: '⚡', description: 'Fuel, energy production, industrial resources' },
  { id: 'trading',            label: 'Trading',            icon: '🛒', description: 'Consumer goods and commerce' },
  { id: 'commercial',         label: 'Commercial',         icon: '🏬', description: 'Retail and general trade' },
  { id: 'industrial',         label: 'Industrial',         icon: '🏗️', description: 'Heavy industry and production' },
  { id: 'construction',       label: 'Construction',       icon: '🧱', description: 'Building materials and components' },
  { id: 'high_tech',          label: 'High Tech',          icon: '📡', description: 'Advanced electronics and technology products' },
  { id: 'agricultural',       label: 'Agricultural',       icon: '🌾', description: 'Crops, food and farming products' },
];
export const ECONOMY_TYPE_MAP = Object.fromEntries(ECONOMY_TYPES.map(e => [e.id, e])) as Record<string, EconomyTypeDef>;
