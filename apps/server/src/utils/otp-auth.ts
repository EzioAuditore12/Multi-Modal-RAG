export function generateOTP(size: number = 6): string {
  const min = 10 ** (size - 1);
  const max = 10 ** size - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}
