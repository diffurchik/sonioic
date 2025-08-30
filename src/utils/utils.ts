export const getRandomElement = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) return undefined; // guard for empty arrays
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
