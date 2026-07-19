import type { WealthTierDef } from '@/types';

export const WEALTH_TIERS: WealthTierDef[] = [
  {
    stars: 1, label: 'Weak Economy', tier: 'T1 economies',
    terms: ['Declining', 'Destitute', 'Failing', 'Fledgling', 'Low Supply', 'Struggling', 'Unsuccessful', 'Unpromising'],
  },
  {
    stars: 2, label: 'Average Economy', tier: 'T2 economies',
    terms: ['Adequate', 'Balanced', 'Comfortable', 'Developing', 'Medium Supply', 'Promising', 'Satisfactory', 'Sustainable'],
  },
  {
    stars: 3, label: 'Strong Economy', tier: 'T3 economies',
    terms: ['Advanced', 'Affluent', 'Booming', 'Flourishing', 'High Supply', 'Opulent', 'Prosperous', 'Wealthy'],
  },
];
