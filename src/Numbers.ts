export function tonumber (a: any): number {
  const value = (typeof a === 'number') ? a : NaN;
  return value;
}

export function isnan (a: any): boolean {
  const isnan = (typeof a === 'number') ? Number.isNaN(a) : true;
  return isnan;
}

export function notnan (a: any): boolean {
  const notnan = !isnan(a);
  return notnan;
}
