export function isBlankKey(key) {
  return key === null || (key instanceof Array && key.length === 0);
}
