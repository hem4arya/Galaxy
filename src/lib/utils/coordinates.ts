/**
 * Calculate distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Normalize value to range -1 to 1
 */
export function normalize(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 2 - 1;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculate angle between two points in radians
 */
export function angle(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * Convert polar coordinates to cartesian
 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInRadians: number
): { x: number; y: number } {
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}
