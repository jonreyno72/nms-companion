import type { BackupFile } from '@/types';

/** Serialises stations to a pretty-printed JSON backup envelope. */
export function toBackupJson(stations: import('@/types').Station[]): string {
  const backup: BackupFile = {
    format:     'nms-companion',
    version:    1,
    exportedAt: new Date().toISOString(),
    stations,
  };
  return JSON.stringify(backup, null, 2);
}
