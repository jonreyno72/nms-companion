import React from 'react';
import { X } from 'lucide-react';
import { ECONOMY_TYPES } from '@/constants/economyTypes';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function EconomyTypeReferencePopover({ open, onClose }: Props) {
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
          <h2 className="text-lg font-semibold">Economy Type Reference</h2>
          <button
            onClick={onClose}
            className="touch-target text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-full transition-colors"
            aria-label="Close economy type reference"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-border">
          {ECONOMY_TYPES.filter(e => e.id !== 'unknown').map(e => (
            <div key={e.id} className="p-4">
              <div className="font-semibold text-sm flex items-center gap-2">
                {e.icon} {e.label}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {e.themes.map(theme => (
                  <span key={theme} className="text-xs px-2 py-0.5 rounded-md bg-input border border-border">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
