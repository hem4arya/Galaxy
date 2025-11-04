import { writable } from 'svelte/store';
import { lerp, cancelFrame, requestFrame } from '$lib/utils/animations';
import { normalize, clamp } from '$lib/utils/coordinates';
import type { ParallaxState } from '$lib/types';

function createParallaxEngine() {
  const { subscribe, set, update } = writable<ParallaxState>({
    mouseX: 0,
    mouseY: 0,
    normalizedX: 0,
    normalizedY: 0
  });

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrameId: number | null = null;
  let isActive = false;

  const smoothingFactor = 0.1;

  function animate() {
    currentX = lerp(currentX, targetX, smoothingFactor);
    currentY = lerp(currentY, targetY, smoothingFactor);

    update((state) => ({
      ...state,
      mouseX: currentX,
      mouseY: currentY
    }));

    if (isActive) {
      animationFrameId = requestFrame(animate);
    }
  }

  function start() {
    if (!isActive) {
      isActive = true;
      animate();
    }
  }

  function stop() {
    isActive = false;
    if (animationFrameId !== null) {
      cancelFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function handleMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    targetX = clientX;
    targetY = clientY;

    const normalizedX = normalize(clientX, 0, innerWidth);
    const normalizedY = normalize(clientY, 0, innerHeight);

    update((state) => ({
      ...state,
      normalizedX: clamp(normalizedX, -1, 1),
      normalizedY: clamp(normalizedY, -1, 1)
    }));
  }

  function handleTouchMove(event: TouchEvent) {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const { clientX, clientY } = touch;
      const { innerWidth, innerHeight } = window;

      targetX = clientX;
      targetY = clientY;

      const normalizedX = normalize(clientX, 0, innerWidth);
      const normalizedY = normalize(clientY, 0, innerHeight);

      update((state) => ({
        ...state,
        normalizedX: clamp(normalizedX, -1, 1),
        normalizedY: clamp(normalizedY, -1, 1)
      }));
    }
  }

  function init() {
    if (typeof window !== 'undefined') {
      // Disable parallax on mobile for better performance
      const isMobile = window.innerWidth <= 768;
      
      if (!isMobile) {
        window.addEventListener('mousemove', handleMouseMove);
        start();
      }
      
      // Keep touch for tablets but with passive listener
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
    }
  }

  function destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove as any);
      stop();
    }
  }

  return {
    subscribe,
    init,
    destroy
  };
}

export const parallaxEngine = createParallaxEngine();
