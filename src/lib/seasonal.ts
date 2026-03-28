/**
 * Returns true when the current date falls within Valentine's season
 * (January 25 – February 28).
 */
export function isValentineSeason(): boolean {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();

  // Jan 25 – Jan 31
  if (month === 0 && day >= 25) return true;
  // All of February
  if (month === 1) return true;

  return false;
}
