<script lang="ts">
  import { fly, fade, scale } from 'svelte/transition';
  import { theme } from '$lib/stores/theme';
  import type { Project } from '$lib/types';

  interface Props {
    project: Project | null;
    onclose: () => void;
  }

  let { project, onclose }: Props = $props();
  let currentTheme = $state<'dark' | 'light'>('dark');

  $effect(() => {
    const unsubscribe = theme.subscribe(value => {
      currentTheme = value;
    });
    return unsubscribe;
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onclose();
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onclose();
    }
  }
</script>

{#if project}
  <div
    class="modal-backdrop"
    class:light={currentTheme === 'light'}
    transition:fade={{ duration: 300 }}
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="button"
    tabindex="-1"
  >
    <div 
      class="modal" 
      class:light={currentTheme === 'light'}
      transition:scale={{ duration: 400, start: 0.8 }}
    >
      <!-- Decorative elements -->
      <div class="modal-glow" style="background: {project.color};"></div>
      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>

      <button class="close-button" onclick={onclose} aria-label="Close modal">
        <span class="close-icon"></span>
      </button>

      <div class="modal-content">
        {#if project.image_url}
          <div class="image-container">
            <img src={project.image_url} alt={project.title} class="project-image" />
            <div class="image-overlay" style="background: linear-gradient(to bottom, transparent, {project.color}33);"></div>
          </div>
        {/if}

        <div class="content-body">
          <div class="header-section">
            <div class="planet-icon" style="background: {project.color};"></div>
            <h2>{project.title}</h2>
          </div>

          <div class="tags">
            {#each project.tags as tag}
              <span class="tag" style="border-color: {project.color}88; color: {project.color};">
                {tag}
              </span>
            {/each}
          </div>

          <p class="description">{project.long_description || project.description}</p>

          <div class="links">
            {#if project.demo_url}
              <a 
                href={project.demo_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="link-button demo"
                style="background: linear-gradient(135deg, {project.color}ee, {project.color}aa);"
              >
                <span class="icon">🌐</span>
                <span>Live Demo</span>
              </a>
            {/if}
            {#if project.github_url}
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="link-button github"
              >
                <span class="icon">💻</span>
                <span>View Code</span>
              </a>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(15px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
  }

  .modal-backdrop.light {
    background: rgba(255, 255, 255, 0.85);
  }

  .modal {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 25px;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    border: 2px solid rgba(255, 255, 255, 0.15);
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    transform-style: preserve-3d;
  }

  .modal.light {
    background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(0, 0, 0, 0.05) inset;
  }

  .modal-glow {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 100%;
    border-radius: 50%;
    opacity: 0.15;
    filter: blur(60px);
    pointer-events: none;
    z-index: -1;
  }

  .corner-decoration {
    position: absolute;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(147, 112, 219, 0.4);
  }

  .corner-decoration.top-left {
    top: 15px;
    left: 15px;
    border-right: none;
    border-bottom: none;
    border-radius: 8px 0 0 0;
  }

  .corner-decoration.top-right {
    top: 15px;
    right: 15px;
    border-left: none;
    border-bottom: none;
    border-radius: 0 8px 0 0;
  }

  .corner-decoration.bottom-left {
    bottom: 15px;
    left: 15px;
    border-right: none;
    border-top: none;
    border-radius: 0 0 0 8px;
  }

  .corner-decoration.bottom-right {
    bottom: 15px;
    right: 15px;
    border-left: none;
    border-top: none;
    border-radius: 0 0 8px 0;
  }

  .close-button {
    position: absolute;
    top: 25px;
    right: 25px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: white;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .light .close-button {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
    color: #1a1a2e;
  }

  .close-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .close-icon {
    width: 20px;
    height: 20px;
    position: relative;
  }

  .close-icon::before,
  .close-icon::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 2px;
    background: currentColor;
    border-radius: 2px;
  }

  .close-icon::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .close-icon::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  .modal-content {
    position: relative;
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: 25px 25px 0 0;
  }

  .project-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .modal:hover .project-image {
    transform: scale(1.05);
  }

  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    pointer-events: none;
  }

  .content-body {
    padding: 40px;
  }

  .header-section {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
  }

  .planet-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 
      0 0 20px currentColor,
      inset -5px -5px 15px rgba(0, 0, 0, 0.3),
      inset 5px 5px 10px rgba(255, 255, 255, 0.2);
    animation: planetRotate 10s linear infinite;
  }

  h2 {
    color: white;
    font-size: 32px;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .light h2 {
    color: #1a1a2e;
    text-shadow: none;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 25px;
  }

  .tag {
    background: rgba(147, 112, 219, 0.15);
    padding: 8px 18px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    border: 2px solid;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(147, 112, 219, 0.3);
  }

  .description {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.8;
    margin-bottom: 30px;
    font-size: 16px;
  }

  .light .description {
    color: rgba(0, 0, 0, 0.75);
  }

  .links {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .link-button {
    flex: 1;
    min-width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 15px 25px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 700;
    font-size: 15px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
  }

  .link-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .link-button:hover::before {
    width: 300px;
    height: 300px;
  }

  .link-button .icon,
  .link-button span {
    position: relative;
    z-index: 1;
  }

  .link-button.demo {
    color: white;
  }

  .link-button.github {
    background: linear-gradient(135deg, #24292e 0%, #1a1d21 100%);
    color: white;
  }

  .light .link-button.github {
    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
    color: #1a1a2e;
  }

  .link-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }

  .icon {
    font-size: 20px;
  }

  @keyframes planetRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .content-body {
      padding: 30px 20px;
    }

    h2 {
      font-size: 24px;
    }

    .image-container {
      height: 200px;
    }

    .link-button {
      min-width: 120px;
      padding: 12px 20px;
      font-size: 14px;
    }

    .corner-decoration {
      width: 30px;
      height: 30px;
    }
  }
</style>
