import React from 'react';
import { X } from 'lucide-react';
import { WEALTH_TIERS } from '@/constants/wealthTiers';

interface Props {
  open: boolean;
  onClose: () => void;
}

const TIER_COLOR: Record<number, string> = {
  1: 'text-red-300',
  2: 'text-accent',
  3: 'text-green-300',
  4: 'text-muted-foreground',
};

export function WealthReferencePopover({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
          <h2 className="text-lg font-semibold">Wealth Reference</h2>
          <button
            onClick={onClose}
            className="touch-target text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-full transition-colors"
            aria-label="Close wealth reference"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-border">
          {WEALTH_TIERS.map(tier => (
            <div key={tier.stars} className="p-4">
              <div className={`font-semibold text-sm flex items-center gap-2 ${TIER_COLOR[tier.stars]}`}>
                {tier.icon ?? '★'.repeat(tier.stars)} {tier.label}
              </div>
              <div className="text-xs text-muted-foreground mb-2">{tier.tier}</div>
              {tier.terms.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tier.terms.map(term => (
                    <span key={term} className="text-xs px-2 py-0.5 rounded-md bg-input border border-border">
                      {term}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
