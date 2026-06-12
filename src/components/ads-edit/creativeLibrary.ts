const ACA_LIBRARY_WINDOW_SIZE = 5;
const DEFAULT_ACA_LIBRARY = [0, 1, 2, 3, 4];
const EXCLUDED_ACA_LIBRARY = [5, 6, 7, 8, 9];

export function getAffiliateCreativeIdsForUrl(
  url: string,
  totalCreatives: number,
): number[] {
  const normalizedUrl = url.trim().toUpperCase();

  if (
    totalCreatives <= 0
    || (!normalizedUrl.includes('PDP') && !normalizedUrl.includes('PHP'))
  ) {
    return [];
  }

  if (
    normalizedUrl === 'PDP/PHP URL'
    || normalizedUrl === 'PDP/PHP URL-YES'
  ) {
    return DEFAULT_ACA_LIBRARY.filter((id) => id < totalCreatives);
  }

  if (normalizedUrl === 'PDP/PHP URL-NO') {
    return EXCLUDED_ACA_LIBRARY.filter((id) => id < totalCreatives);
  }

  let seed = 0;
  for (const character of normalizedUrl) {
    seed = (seed * 31 + character.charCodeAt(0)) % totalCreatives;
  }

  const ids: number[] = [];
  for (let index = 0; index < Math.min(ACA_LIBRARY_WINDOW_SIZE, totalCreatives); index += 1) {
    ids.push((seed + index) % totalCreatives);
  }

  return ids;
}
