<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { parallaxEngine } from '$lib/stores/parallax';
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  let parallaxState = $state({ mouseX: 0, mouseY: 0, normalizedX: 0, normalizedY: 0 });

  onMount(() => {
    parallaxEngine.init();
    const unsubscribeParallax = parallaxEngine.subscribe((state) => {
      parallaxState = state;
    });

    return () => {
      unsubscribeParallax();
    };
  });

  onDestroy(() => {
    parallaxEngine.destroy();
  });

  // Detect mobile for performance optimization
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  // Optimized stars - fewer on mobile
  const starCount = isMobile ? 100 : 200;
  const stars = Array.from({ length: starCount }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.8 + 0.2,
    animationDelay: Math.random() * 3,
    layer: i % 3
  }));

  // Fewer particles for performance - even less on mobile
  const particleCount = isMobile ? 10 : 30;
  const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 3,
    duration: Math.random() * 25 + 20,
    delay: Math.random() * 10
  }));

  // Nebulae - fewer on mobile
  const nebulaeCount = isMobile ? 2 : 5;
  const nebulae = Array.from({ length: nebulaeCount }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 500 + 300,
    rotation: Math.random() * 360,
    duration: Math.random() * 50 + 40
  }));


</script>

<div class="galaxy-canvas">
  <!-- Atmospheric glow -->
  <div class="atmosphere-glow"></div>
  
  <!-- Nebula layer -->
  <div 
    class="layer nebula-layer"
    style="transform: translate({parallaxState.normalizedX * 2}px, {parallaxState.normalizedY * 2}px)"
  >
    {#each nebulae as nebula}
      <div
        class="nebula"
        style="
          left: {nebula.x}%;
          top: {nebula.y}%;
          width: {nebula.size}px;
          height: {nebula.size}px;
          transform: rotate({nebula.rotation}deg);
          animation-duration: {nebula.duration}s;
        "
      ></div>
    {/each}
  </div>

  <!-- Stars layers -->
  <div
    class="layer stars-far"
    style="transform: translate({parallaxState.normalizedX * 5}px, {parallaxState.normalizedY * 5}px)"
  >
    {#each stars.filter(s => s.layer === 0) as star}
      <div
        class="star"
        style="
          left: {star.x}%;
          top: {star.y}%;
          width: {star.size}px;
          height: {star.size}px;
          opacity: {star.opacity * 0.5};
          animation-delay: {star.animationDelay}s;
        "
      ></div>
    {/each}
  </div>

  <div
    class="layer stars-mid"
    style="transform: translate({parallaxState.normalizedX * 10}px, {parallaxState.normalizedY * 10}px)"
  >
    {#each stars.filter(s => s.layer === 1) as star}
      <div
        class="star"
        style="
          left: {star.x}%;
          top: {star.y}%;
          width: {star.size * 1.3}px;
          height: {star.size * 1.3}px;
          opacity: {star.opacity * 0.7};
          animation-delay: {star.animationDelay}s;
        "
      ></div>
    {/each}
  </div>

  <div
    class="layer stars-near"
    style="transform: translate({parallaxState.normalizedX * 15}px, {parallaxState.normalizedY * 15}px)"
  >
    {#each stars.filter(s => s.layer === 2) as star}
      <div
        class="star"
        style="
          left: {star.x}%;
          top: {star.y}%;
          width: {star.size * 1.6}px;
          height: {star.size * 1.6}px;
          opacity: {star.opacity};
          animation-delay: {star.animationDelay}s;
        "
      ></div>
    {/each}
  </div>



  <!-- Content -->
  <div class="layer content-layer">
    {#if children}
      {@render children()}
    {/if}
  </div>

  <!-- Particles -->
  <div
    class="layer particles-layer"
    style="transform: translate({parallaxState.normalizedX * -20}px, {parallaxState.normalizedY * -20}px)"
  >
    {#each particles as particle}
      <div
        class="particle"
        style="
          left: {particle.x}%;
          top: {particle.y}%;
          width: {particle.size}px;
          height: {particle.size}px;
          animation-duration: {particle.duration}s;
          animation-delay: {particle.delay}s;
        "
      ></div>
    {/each}
  </div>
</div>

<style>
  .galaxy-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: 
      radial-gradient(ellipse at 30% 20%, rgba(88, 28, 135, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(219, 39, 119, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
      linear-gradient(180deg, #050510 0%, #0a0a1e 30%, #0f0f2e 60%, #1a1a3e 100%);
  }

  .atmosphere-glow {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 120%;
    height: 60%;
    background: radial-gradient(ellipse at center, rgba(147, 112, 219, 0.15) 0%, transparent 70%);
    filter: blur(100px);
    opacity: 0.6;
    pointer-events: none;
  }

  .layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    will-change: transform;
  }

  .nebula-layer {
    z-index: 1;
  }

  .stars-far {
    z-index: 2;
  }

  .stars-mid {
    z-index: 3;
  }

  .stars-near {
    z-index: 4;
  }

  .content-layer {
    z-index: 5;
  }

  .particles-layer {
    z-index: 6;
    pointer-events: none;
  }

  .nebula {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(139, 92, 246, 0.15) 0%,
      rgba(236, 72, 153, 0.12) 30%,
      rgba(59, 130, 246, 0.08) 60%,
      transparent 80%
    );
    filter: blur(80px);
    animation: nebulaDrift infinite ease-in-out;
    opacity: 0.8;
  }

  .star {
    position: absolute;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
    animation: starTwinkle 4s infinite ease-in-out;
  }

  .particle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(147, 112, 219, 0.4) 0%, transparent 70%);
    filter: blur(6px);
    animation: particleFloat 25s infinite ease-in-out;
    opacity: 0.6;
  }



  /* Animations */
  @keyframes nebulaDrift {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(30px, -30px) scale(1.1);
    }
  }

  @keyframes starTwinkle {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @keyframes particleFloat {
    0%, 100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(30px, -40px);
    }
    50% {
      transform: translate(-30px, 30px);
    }
    75% {
      transform: translate(40px, 20px);
    }
  }



  /* Mobile Performance Optimizations */
  @media (max-width: 768px) {
    .layer {
      will-change: auto;
    }

    .nebula {
      filter: blur(40px);
    }

    .particle {
      filter: blur(3px);
    }

    .atmosphere-glow {
      filter: blur(50px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
    }
    
    .layer {
      transform: none !important;
    }
  }
</style>
