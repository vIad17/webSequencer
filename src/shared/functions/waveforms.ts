// Waveform functions
export function graphSIN(x: number): number {
  return Math.sin(x * Math.PI);
}
export function graphTRI(x: number): number {
  return Math.abs(((x + 1) % 2) - 1) * 2 - 1;
}
export function graphSAW(x: number): number {
  return (x % 1) * 2 - 1;
}
export function graphSQR(x: number): number {
  return Math.sign(Math.sin(x * Math.PI));
}