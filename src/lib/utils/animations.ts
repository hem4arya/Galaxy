/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Smooth interpolation (ease out)
 */
export function smoothLerp(start: number, end: number, factor: number): number {
  const smoothFactor = factor * factor * (3 - 2 * factor);
  return lerp(start, end, smoothFactor);
}

/**
 * Easing function - ease in out cubic
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Easing function - ease out quad
 */
export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

/**
 * Request animation frame with fallback
 */
export function requestFrame(callback: FrameRequestCallback): number {
  return requestAnimationFrame(callback);
}

/**
 * Cancel animation frame
 */
export function cancelFrame(id: number): void {
  cancelAnimationFrame(id);
}
