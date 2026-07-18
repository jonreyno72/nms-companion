import React from 'react';
import { X } from 'lucide-react';
import { GUILDS } from '@/constants/guilds';
import { RACES } from '@/constants/races';
import { REWARDS } from '@/constants/rewards';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function IconLegendModal({ open, onClose }: Props) {
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
          <h2 className="text-lg font-semibold">Icon Key</h2>
          <button
            onClick={onClose}
            className="touch-target text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-full transition-colors"
            aria-label="Close icon key"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Guild Redeem Reward Icons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {REWARDS.map(r => (
                <div key={r.id} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-center">{r.icon}</span> {r.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Guild Icons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {GUILDS.map(g => (
                <div key={g.id} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-center">{g.icon}</span> {g.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Race Icons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {RACES.map(r => (
                <div key={r.id} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-center">{r.icon}</span> {r.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Row Colours
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-6 h-6 rounded bg-destructive/20 border border-destructive/60 shrink-0" />
              Deep red row = Outlaw Station
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
