import type { Station } from '@/types';
import { GUILD_MAP } from '@/constants/guilds';
import { RACE_MAP } from '@/constants/races';
import { REWARD_MAP } from '@/constants/rewards';

/** Escapes a single CSV field value per RFC 4180. */
export function escapeCsvField(value: string): string {
  // If the value contains commas, double-quotes, or newlines — wrap in quotes
  // and escape any internal double-quotes by doubling them.
  if (/[",\n\r]/.test(value)) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

const CSV_HEADERS = [
  'ID', 'Name', 'Guild', 'Race', 'Station Type', 'Favourite', 'Exosuit Upgrade Purchased',
  'Rewards', 'Donation Items', 'Notes', 'Created At', 'Updated At',
];

/** Serialises an array of Station records to a CSV string. */
export function stationsToCsv(stations: Station[]): string {
  const rows: string[] = [CSV_HEADERS.map(escapeCsvField).join(',')];

  for (const s of stations) {
    const row = [
      s.id,
      s.name,
      GUILD_MAP[s.guildId]?.label ?? s.guildId,
      RACE_MAP[s.raceId]?.label ?? s.raceId,
      s.stationType === 'outlaw' ? 'Outlaw Station' : 'Space Station',
      s.favourite ? 'Yes' : 'No',
      s.exosuitUpgradePurchased ? 'Yes' : 'No',
      s.rewards.map(r => REWARD_MAP[r]?.label ?? r).join('; '),
      s.donationItems.join('; '),
      s.notes,
      new Date(s.createdAt).toISOString(),
      new Date(s.updatedAt).toISOString(),
    ].map(escapeCsvField);
    rows.push(row.join(','));
  }

  return rows.join('\n');
}

/** Triggers a file download in the browser. */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
