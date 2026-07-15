export function normalizeText(value: string): string {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase('und')
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

export function tokenize(value: string): string[] {
  const normalized = normalizeText(value);
  if (!normalized) return [];

  return normalized
    .split(' ')
    .filter((token) => token.length >= 2 || /^\d+$/u.test(token));
}
