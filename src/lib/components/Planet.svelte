<script lang="ts">
  import type { Project } from '$lib/types';
  import { theme } from '$lib/stores/theme';

  interface Props {
    project: Project;
    onclick?: () => void;
  }

  let { project, onclick }: Props = $props();
  let isHovered = $state(false);

  const size = 80 + (project.importance || 3) * 35; // 115-255px based on importance
  const orbitDuration = 50 + Math.random() * 30; // 50-80s
  const hasRing = project.importance >= 4;
  
  // Determine if planet is in bottom half (needs popup above)
  const isBottomHalf = project.y_position > 55;

  function handleClick() {
    isHovered = false; // Hide tooltip when modal opens
    if (onclick) onclick();
  }

  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<div class="planet-wrapper" style="left: {project.x_position}%; top: {project.y_position}%;">
<button
  class="planet-container"
  style="
    animation-duration: {orbitDuration}s;
    --importance: {project.importance};
  "
  onclick={handleClick}
  onmouseenter={() => isHovered = true}
  onmouseleave={handleMouseLeave}
  aria-label="View {project.title} project"
  class:hovered={isHovered}
  class:bottom-half={isBottomHalf}
>
  <!-- Planet Shadow (for 3D depth) -->
  <div class="planet-shadow" style="width: {size}px; height: {size}px;"></div>
  
  <!-- Main Planet - OPAQUE -->
  <div
    class="planet"
    style="
      width: {size}px;
      height: {size}px;
      background: radial-gradient(circle at 35% 35%, {project.color}, {project.color}dd 50%, {project.color}99);
    "
  >
    <!-- Surface texture -->
    <div class="planet-texture"></div>
    
    <!-- Atmosphere glow -->
    <div class="atmosphere" style="background: {project.color};"></div>
    
    <!-- Highlight -->
    <div class="highlight"></div>
    
    <!-- Ring (for important planets) -->
    {#if hasRing}
      <div class="ring" style="
        border-color: {project.color}aa;
        box-shadow: 0 0 30px {project.color}88, inset 0 0 20px {project.color}44;
      "></div>
    {/if}
  </div>

  <!-- Orbital ring indicator -->
  <div class="orbit-ring" style="width: {size + 30}px; height: {size + 30}px;"></div>

  <!-- Hover tooltip -->
  {#if isHovered}
    <div class="hover-tooltip" class:bottom-half={isBottomHalf}>
      <h4>{project.title}</h4>
      <p>{project.description.slice(0, 100)}{project.description.length > 100 ? '...' : ''}</p>
      <small>Click to view details</small>
    </div>
  {/if}
</button>
</div>

<style>
  .planet-wrapper {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .planet-container {
    position: relative;
    transform: translate(-50%, -50%);
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0;
    animation: gentleOrbit infinite linear;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-style: preserve-3d;
    z-index: calc(10 + var(--importance, 0));
    will-change: transform;
    pointer-events: auto;
  }

  .planet-container:hover {
    z-index: 1000 !important;
    animation-play-state: paused;
  }

  .planet-shadow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateZ(-20px);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, transparent 70%);
    filter: blur(15px);
    opacity: 0.7;
    transition: all 0.4s ease;
  }

  .planet-container:hover .planet-shadow {
    transform: translate(-50%, -40%) translateZ(-30px) scale(1.3);
    opacity: 0.9;
  }

  .planet {
    position: relative;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 
      0 0 40px rgba(255, 255, 255, 0.2),
      0 10px 40px rgba(0, 0, 0, 0.4),
      inset -15px -15px 40px rgba(0, 0, 0, 0.6),
      inset 15px 15px 30px rgba(255, 255, 255, 0.2);
    transform: translateZ(0);
    overflow: hidden;
  }



  .planet-container:hover .planet {
    transform: translateZ(60px) scale(1.25);
    box-shadow: 
      0 0 80px currentColor,
      0 30px 60px rgba(0, 0, 0, 0.5),
      inset -15px -15px 40px rgba(0, 0, 0, 0.6),
      inset 15px 15px 30px rgba(255, 255, 255, 0.3);
  }

  .planet-texture {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 20%),
      radial-gradient(circle at 60% 70%, rgba(0, 0, 0, 0.25) 0%, transparent 15%),
      radial-gradient(circle at 80% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 25%);
    animation: rotateSurface 60s linear infinite;
  }

  .atmosphere {
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    border-radius: 50%;
    opacity: 0;
    filter: blur(20px);
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .planet-container:hover .atmosphere {
    opacity: 0.6;
  }

  .highlight {
    position: absolute;
    top: 15%;
    left: 20%;
    width: 40%;
    height: 40%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 60%);
    filter: blur(8px);
  }

  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 30%;
    border: 3px solid;
    border-radius: 50%;
    transform: translate(-50%, -50%) rotateX(75deg);
    opacity: 0.7;
  }

  .orbit-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .planet-container:hover .orbit-ring {
    opacity: 1;
    animation: pulseRing 2s ease-in-out infinite;
  }

  /* Hover tooltip */
  .hover-tooltip {
    position: absolute;
    top: 120%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: rgba(15, 15, 30, 0.95);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 12px 16px;
    min-width: 200px;
    max-width: 280px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
    z-index: 1500;
    animation: tooltipSlideIn 0.3s ease forwards;
  }

  .hover-tooltip.bottom-half {
    top: auto;
    bottom: 120%;
    transform: translateX(-50%) translateY(-10px);
  }

  .hover-tooltip h4 {
    margin: 0 0 6px 0;
    color: white;
    font-size: 14px;
    font-weight: 600;
  }

  .hover-tooltip p {
    margin: 0 0 6px 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    line-height: 1.4;
  }

  .hover-tooltip small {
    color: rgba(255, 255, 255, 0.6);
    font-size: 10px;
    font-style: italic;
  }



  @keyframes gentleOrbit {
    0% {
      transform: translate(-50%, -50%) rotate(0deg) translateX(8px) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg) translateX(8px) rotate(-360deg);
    }
  }

  @keyframes rotateSurface {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulseRing {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.3;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0.6;
    }
  }

  /* Mobile Optimizations */
  @media (max-width: 768px) {
    .planet-container {
      will-change: auto;
    }

    .planet {
      box-shadow: 
        0 0 20px rgba(255, 255, 255, 0.15),
        0 5px 20px rgba(0, 0, 0, 0.3),
        inset -10px -10px 30px rgba(0, 0, 0, 0.5),
        inset 10px 10px 20px rgba(255, 255, 255, 0.15);
    }

    .planet-container:hover .planet,
    .planet-container:active .planet {
      transform: translateZ(0) scale(1.15);
      box-shadow: 
        0 0 40px currentColor,
        0 15px 30px rgba(0, 0, 0, 0.4),
        inset -10px -10px 30px rgba(0, 0, 0, 0.5),
        inset 10px 10px 20px rgba(255, 255, 255, 0.2);
    }

    .planet-texture {
      animation-duration: 90s;
    }

    .hover-tooltip {
      font-size: 14px;
      padding: 14px 18px;
      min-width: 220px;
      max-width: 300px;
    }

    .hover-tooltip h4 {
      font-size: 15px;
    }

    .hover-tooltip p {
      font-size: 13px;
    }
  }

  @media (max-width: 480px) {
    .hover-tooltip {
      min-width: 180px;
      max-width: 260px;
      padding: 12px 16px;
    }

    .hover-tooltip h4 {
      font-size: 14px;
    }

    .hover-tooltip p {
      font-size: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .planet-container {
      animation: none;
    }
    .planet-texture {
      animation: none;
    }
    .planet-container:hover .planet {
      transform: translateZ(0) scale(1.1);
    }
  }



  @keyframes tooltipSlideIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .hover-tooltip.bottom-half {
    animation: tooltipSlideInUp 0.3s ease forwards;
  }

  @keyframes tooltipSlideInUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
