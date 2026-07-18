import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Station, StationDraft, SaveState } from '@/types';
import { GUILDS } from '@/constants/guilds';
import { RACES } from '@/constants/races';
import { REWARDS } from '@/constants/rewards';
import { STATION_TYPES } from '@/constants/stationTypes';
import { isDuplicateName } from '@/utils/normalise';
import { DuplicateWarning } from './DuplicateWarning';
import { SaveIndicator } from '../ui/SaveIndicator';

interface Props {
  draft: StationDraft | null;
  original: Station | null;
  saveState: SaveState;
  existingNames: Array<{ id: string; name: string }>;
  onFieldChange: <K extends keyof StationDraft>(key: K, value: StationDraft[K]) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function StationForm({
  draft, original, saveState, existingNames, onFieldChange, onSave, onCancel
}: Props) {
  if (!draft) return null;

  const isDuplicate = useMemo(() => 
    isDuplicateName(draft.name, existingNames, original?.id),
  [draft.name, existingNames, original?.id]);

  const canSave = draft.name.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full bg-card border-l border-border"
    >
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <h2 className="text-xl font-semibold">
          {original ? 'Edit Station' : 'Add Station'}
        </h2>
        <button
          onClick={onCancel}
          className="touch-target text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-full transition-colors"
          aria-label="Cancel editing"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Name & Station Type */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2 sm:w-1/2">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Station Name</label>
            <input
              type="text"
              value={draft.name}
              onChange={e => onFieldChange('name', e.target.value)}
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g. Odyalutai Terminus"
              autoFocus
            />
            <DuplicateWarning visible={isDuplicate} />
          </div>
          <div className="space-y-2 sm:flex-1">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Station Type</label>
            <div className="grid grid-cols-2 gap-2">
              {STATION_TYPES.map(t => {
                const isSelected = draft.stationType === t.id;
                const isOutlaw = t.id === 'outlaw';
                return (
                  <button
                    key={t.id}
                    onClick={() => onFieldChange('stationType', t.id)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      isSelected
                        ? isOutlaw
                          ? 'bg-destructive/20 border-destructive text-destructive'
                          : 'bg-primary/20 border-primary text-primary'
                        : 'bg-input border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Guild & Race */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dominant Guild</label>
            <div className="grid grid-cols-2 gap-2">
              {GUILDS.map(g => (
                <button
                  key={g.id}
                  onClick={() => onFieldChange('guildId', g.id)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    draft.guildId === g.id 
                      ? 'bg-primary/20 border-primary text-primary' 
                      : 'bg-input border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {g.icon} {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">System Race</label>
            <div className="grid grid-cols-2 gap-2">
              {RACES.map(r => (
                <button
                  key={r.id}
                  onClick={() => onFieldChange('raceId', r.id)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    draft.raceId === r.id 
                      ? 'bg-primary/20 border-primary text-primary' 
                      : 'bg-input border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Favourite */}
        <label className="flex items-center justify-between p-4 bg-input border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
          <span className="font-medium">Mark as Favourite</span>
          <div className={`relative w-12 h-6 rounded-full transition-colors ${draft.favourite ? 'bg-accent' : 'bg-muted'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${draft.favourite ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
          <input
            type="checkbox"
            className="sr-only"
            checked={draft.favourite}
            onChange={e => onFieldChange('favourite', e.target.checked)}
          />
        </label>

        {/* Exosuit Upgrade Purchased */}
        <label className="flex items-center justify-between p-4 bg-input border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
          <span className="font-medium">Exosuit Upgrade Purchased</span>
          <div className={`relative w-12 h-6 rounded-full transition-colors ${draft.exosuitUpgradePurchased ? 'bg-accent' : 'bg-muted'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${draft.exosuitUpgradePurchased ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
          <input
            type="checkbox"
            className="sr-only"
            checked={draft.exosuitUpgradePurchased}
            onChange={e => onFieldChange('exosuitUpgradePurchased', e.target.checked)}
          />
        </label>

        {/* Rewards */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Guild Redeem Rewards</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REWARDS.map(r => {
              const isSelected = draft.rewards.includes(r.id);
              return (
                <label key={r.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected ? 'bg-primary/10 border-primary text-foreground' : 'bg-input border-border text-muted-foreground hover:border-primary/50'
                }`}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-input bg-background"
                    checked={isSelected}
                    onChange={e => {
                      if (e.target.checked) {
                        onFieldChange('rewards', [...draft.rewards, r.id]);
                      } else {
                        onFieldChange('rewards', draft.rewards.filter(id => id !== r.id));
                      }
                    }}
                  />
                  <span className="flex-1 text-sm">{r.icon} {r.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Donation Items */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Guild Donations</label>
          <div className="space-y-2">
            {draft.donationItems.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={e => {
                    const newItems = [...draft.donationItems];
                    newItems[idx] = e.target.value;
                    onFieldChange('donationItems', newItems);
                  }}
                  className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Pugneum, Hexite..."
                />
                <button
                  onClick={() => onFieldChange('donationItems', draft.donationItems.filter((_, i) => i !== idx))}
                  className="touch-target bg-input border border-border rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive transition-colors shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => onFieldChange('donationItems', [...draft.donationItems, ''])}
              className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2 pb-6">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Notes</label>
          <textarea
            value={draft.notes}
            onChange={e => onFieldChange('notes', e.target.value)}
            className="w-full h-32 bg-input border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="System economy, specific multi-tools, interesting ships..."
          />
        </div>

      </div>

      <div className="p-4 border-t border-border bg-card flex items-center justify-between shrink-0 safe-area-bottom">
        <SaveIndicator state={saveState} />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!canSave}
            className="px-6 py-2.5 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {original ? 'Save Changes' : 'Add Station'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
