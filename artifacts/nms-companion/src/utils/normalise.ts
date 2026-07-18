/**
 * Normalises a station name for duplicate detection.
 * Lowercases, trims, collapses whitespace, strips punctuation.
 */
export function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Given a list of existing stations, returns whether the given name
 * is a normalised duplicate of any other station (excluding the station
 * with excludeId, so editing a station doesn't flag itself).
 */
export function isDuplicateName(
  name: string,
  existingNames: Array<{ id: string; name: string }>,
  excludeId?: string
): boolean {
  const normalised = normaliseName(name);
  if (!normalised) return false;
  return existingNames.some(
    s => s.id !== excludeId && normaliseName(s.name) === normalised
  );
}
