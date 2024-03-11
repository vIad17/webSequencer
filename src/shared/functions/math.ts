export const round = (a: number, b = 1) => Math.round(a / b) * b;
export const floor = (a: number, b = 1) => Math.floor(a / b) * b;
export const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));
