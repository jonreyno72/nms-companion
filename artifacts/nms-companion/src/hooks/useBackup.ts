import { useCallback } from 'react';
import { stationRepository } from '@/db/repositories/stationRepository';
import { BackupFileSchema, validateAndCoerceStations } from '@/schemas/backup.schema';
import { toBackupJson } from '@/utils/jsonBackup';
import { stationsToCsv, downloadFile } from '@/utils/csvExport';
import type { ImportPreview } from '@/types';

export function useBackup() {
  const exportJson = useCallback(async () => {
    const stations = await stationRepository.exportAll();
    const json = toBackupJson(stations);
    downloadFile(json, `nms-companion-backup-${Date.now()}.json`, 'application/json');
  }, []);

  const exportCsv = useCallback(async () => {
    const stations = await stationRepository.exportAll();
    const csv = stationsToCsv(stations);
    downloadFile(csv, `nms-companion-backup-${Date.now()}.csv`, 'text/csv');
  }, []);

  /**
   * Parses and validates a JSON file selected by the user.
   * Returns an ImportPreview for the caller to show a confirmation UI.
   * Throws if the file is not valid JSON or has the wrong format/version.
   */
  const parseImportFile = useCallback(async (file: File): Promise<ImportPreview> => {
    const text = await file.text();
    const raw  = JSON.parse(text);           // throws SyntaxError if not JSON
    const parsed = BackupFileSchema.parse(raw); // throws ZodError if shape wrong
    const { stations, warnings } = validateAndCoerceStations(parsed.stations);
    return { stations, count: stations.length, warnings };
  }, []);

  const applyImport = useCallback(async (
    preview: ImportPreview,
    mode: 'merge' | 'replace'
  ) => {
    if (mode === 'replace') {
      await stationRepository.replaceAll(preview.stations);
    } else {
      await stationRepository.mergeAll(preview.stations);
    }
  }, []);

  return { exportJson, exportCsv, parseImportFile, applyImport };
}
