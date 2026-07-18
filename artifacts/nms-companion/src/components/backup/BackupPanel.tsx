import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Download, Upload, FileSpreadsheet, Clock } from 'lucide-react';
import { useBackup } from '@/hooks/useBackup';
import { settingsRepository } from '@/db/repositories/settingsRepository';
import { ImportPreviewPanel } from './ImportPreview';
import type { ImportPreview } from '@/types';

export function BackupPanel() {
  const { exportJson, exportCsv, parseImportFile, applyImport } = useBackup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastBackupAt, setLastBackupAt] = useState<number | null>(null);

  const refreshLastBackupAt = useCallback(async () => {
    setLastBackupAt(await settingsRepository.getLastBackupAt());
  }, []);

  useEffect(() => { refreshLastBackupAt(); }, [refreshLastBackupAt]);

  const handleExportJson = async () => {
    await exportJson();
    await refreshLastBackupAt();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setError(null);
      const res = await parseImportFile(file);
      setPreview(res);
    } catch (err: any) {
      setError(err.message || 'Failed to parse file. Ensure it is a valid backup JSON.');
    } finally {
      // reset input so same file can be picked again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImport = async (mode: 'merge' | 'replace') => {
    if (!preview) return;
    try {
      await applyImport(preview, mode);
      setPreview(null);
      window.location.reload(); // Hard reload to refresh all state
    } catch (err: any) {
      setError('Import failed: ' + err.message);
    }
  };

  if (preview) {
    return (
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 p-4 overflow-y-auto flex items-start justify-center">
        <ImportPreviewPanel
          preview={preview}
          onMerge={() => handleImport('merge')}
          onReplace={() => handleImport('replace')}
          onCancel={() => setPreview(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Data Management</h2>
        <p className="text-muted-foreground">Export your stations for safekeeping, or import from another device. Data is only stored locally in your browser.</p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 px-4 py-3 bg-input border border-border rounded-xl text-sm">
        <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground">Last Backup (JSON export):</span>
        <span className="font-medium text-foreground">
          {lastBackupAt
            ? new Date(lastBackupAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
            : 'Never'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Export JSON */}
        <button
          onClick={handleExportJson}
          className="flex flex-col items-start text-left p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:bg-muted/30 transition-all group"
        >
          <div className="p-3 bg-primary/10 text-primary rounded-xl mb-4 group-hover:scale-110 transition-transform">
            <Download className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Export JSON</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Download a complete backup of all your stations. Best for restoring later.
          </p>
        </button>

        {/* Import JSON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-start text-left p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:bg-muted/30 transition-all group"
        >
          <div className="p-3 bg-primary/10 text-primary rounded-xl mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Import JSON</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Restore stations from a previous backup file. You can merge or replace.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json,application/json"
            onChange={handleFileChange}
          />
        </button>

        {/* Export CSV */}
        <button
          onClick={exportCsv}
          className="flex flex-col items-start text-left p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:bg-muted/30 transition-all group"
        >
          <div className="p-3 bg-muted text-foreground rounded-xl mb-4 group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Export CSV</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Download your data as a spreadsheet to view in Excel or Google Sheets.
          </p>
        </button>

      </div>
    </div>
  );
}
