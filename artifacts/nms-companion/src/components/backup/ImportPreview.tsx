import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, FileJson, Check } from 'lucide-react';
import type { ImportPreview } from '@/types';

interface Props {
  preview: ImportPreview;
  onMerge: () => void;
  onReplace: () => void;
  onCancel: () => void;
}

export function ImportPreviewPanel({ preview, onMerge, onReplace, onCancel }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl shadow-xl overflow-hidden max-w-2xl w-full mx-auto my-8 flex flex-col max-h-[80vh]"
    >
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 text-primary rounded-lg">
            <FileJson className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold">Import Ready</h2>
        </div>
        <p className="text-muted-foreground">
          Found <strong className="text-foreground">{preview.count}</strong> stations in the backup file.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {preview.warnings.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500 font-medium">
              <AlertTriangle className="w-5 h-5" />
              <h3>Warnings ({preview.warnings.length})</h3>
            </div>
            <ul className="space-y-2">
              {preview.warnings.map((w, idx) => (
                <li key={idx} className="bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-sm p-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    {w.stationName && <span className="font-semibold block text-amber-100">{w.stationName}</span>}
                    {w.message}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border bg-muted/20">
            <h4 className="font-semibold mb-1">Merge Option</h4>
            <p className="text-sm text-muted-foreground">
              Adds imported stations to your existing data. Existing stations with the same ID will be updated.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive-foreground/90">
            <h4 className="font-semibold mb-1 text-destructive">Replace Option</h4>
            <p className="text-sm opacity-80">
              Deletes ALL your current stations and replaces them completely with the imported data.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-muted/30 flex flex-wrap sm:flex-nowrap gap-3 justify-end items-center">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg text-muted-foreground hover:bg-muted font-medium w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (window.confirm('Warning: This will delete ALL your current stations. Are you absolutely sure?')) {
              onReplace();
            }
          }}
          className="px-5 py-2.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive text-white hover:text-white border border-destructive/20 font-medium w-full sm:w-auto transition-colors"
        >
          Replace All
        </button>
        <button
          onClick={onMerge}
          className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium w-full sm:w-auto flex items-center justify-center gap-2 transition-colors"
        >
          <Check className="w-4 h-4" /> Merge Data
        </button>
      </div>
    </motion.div>
  );
}
