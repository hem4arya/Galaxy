<script lang="ts">
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores/theme';

  let cursorX = $state(0);
  let cursorY = $state(0);
  let cursorTrailX = $state(0);
  let cursorTrailY = $state(0);
  let isPointer = $state(false);
  let currentTheme = $state<'dark' | 'light'>('dark');

  $effect(() => {
    const unsubscribe = theme.subscribe(value => {
      currentTheme = value;
    });
    return unsubscribe;
  });

  onMount(() => {
    let animationFrameId: number;

    function updateCursor(e: MouseEvent) {
      cursorX = e.clientX;
      cursorY = e.clientY;

      // Check if hovering over interactive element
      const target = e.target as HTMLElement;
      isPointer = target.tagName === 'BUTTON' || 
                  target.tagName === 'A' || 
                  target.closest('button') !== null ||
                  target.closest('a') !== null;
    }

    function animateTrail() {
      cursorTrailX += (cursorX - cursorTrailX) * 0.15;
      cursorTrailY += (cursorY - cursorTrailY) * 0.15;
      animationFrameId = requestAnimationFrame(animateTrail);
    }

    window.addEventListener('mousemove', updateCursor);
    animateTrail();

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      cancelAnimationFrame(animationFrameId);
    };
  });
</script>

<div class="cursor-container">
  <!-- Main cursor dot -->
  <div 
    class="cursor-dot"
    class:pointer={isPointer}
    class:light={currentTheme === 'light'}
    style="transform: translate({cursorX}px, {cursorY}px)"
  ></div>

  <!-- Cursor trail -->
  <div 
    class="cursor-trail"
    class:pointer={isPointer}
    class:light={currentTheme === 'light'}
    style="transform: translate({cursorTrailX}px, {cursorTrailY}px)"
  ></div>
</div>

<style>
  .cursor-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  }

  .cursor-dot {
    position: fixed;
    top: -6px;
    left: -6px;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    transition: all 0.15s ease;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
    mix-blend-mode: difference;
  }

  .cursor-dot.light {
    background: #1a1a2e;
    box-shadow: 0 0 15px rgba(26, 26, 46, 0.6);
  }

  .cursor-dot.pointer {
    transform: scale(1.5);
    background: rgba(102, 126, 234, 0.8);
    box-shadow: 0 0 30px rgba(102, 126, 234, 1);
    mix-blend-mode: normal;
  }

  .cursor-trail {
    position: fixed;
    top: -20px;
    left: -20px;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transition: all 0.2s ease;
    mix-blend-mode: difference;
  }

  .cursor-trail.light {
    border-color: rgba(26, 26, 46, 0.4);
  }

  .cursor-trail.pointer {
    transform: scale(1.3);
    border-color: rgba(102, 126, 234, 0.8);
    border-width: 3px;
    mix-blend-mode: normal;
  }

  @media (max-width: 768px) {
    .cursor-container {
      display: none;
    }
  }
</style>
