/**
 * Helper function to determine if a key is considered blank
 * @param {string|string[]} key Key to check
 * @returns {boolean} True if the key is blank
 */
export function isBlankKey(key: string | string[] | null | undefined): boolean {
  if (key === null || key === undefined) return true;
  if (Array.isArray(key) && key.length === 0) return true;
  if (typeof key === 'string' && key.length === 0) return true;
  return false;
}
