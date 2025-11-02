<script lang="ts">
  import { theme } from '$lib/stores/theme';

  let currentTheme = $state<'dark' | 'light'>('dark');
  let isAnimating = $state(false);

  $effect(() => {
    const unsubscribe = theme.subscribe(value => {
      currentTheme = value;
    });
    return unsubscribe;
  });

  function toggleTheme() {
    isAnimating = true;
    theme.toggle();
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }
</script>

<button 
  class="theme-toggle" 
  onclick={toggleTheme}
  class:animating={isAnimating}
  aria-label="Toggle theme"
>
  <div class="celestial-body">
    {#if currentTheme === 'dark'}
      <div class="moon">
        <div class="crater crater-1"></div>
        <div class="crater crater-2"></div>
        <div class="crater crater-3"></div>
      </div>
    {:else}
      <div class="sun">
        <div class="ray ray-1"></div>
        <div class="ray ray-2"></div>
        <div class="ray ray-3"></div>
        <div class="ray ray-4"></div>
        <div class="ray ray-5"></div>
        <div class="ray ray-6"></div>
        <div class="ray ray-7"></div>
        <div class="ray ray-8"></div>
      </div>
    {/if}
  </div>
</button>

<style>
  .theme-toggle {
    position: fixed;
    top: 30px;
    right: 30px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    overflow: visible;
  }

  .theme-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  .theme-toggle.animating {
    animation: celestialSpin 0.8s ease-in-out;
  }

  .celestial-body {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .moon {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f0f0f0 0%, #d4d4d4 100%);
    box-shadow: 
      inset -5px -5px 10px rgba(0, 0, 0, 0.2),
      0 0 20px rgba(240, 240, 240, 0.5);
    position: relative;
    animation: moonGlow 3s ease-in-out infinite;
  }

  .crater {
    position: absolute;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.15);
    box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.3);
  }

  .crater-1 {
    width: 10px;
    height: 10px;
    top: 12px;
    left: 15px;
  }

  .crater-2 {
    width: 7px;
    height: 7px;
    top: 25px;
    left: 8px;
  }

  .crater-3 {
    width: 6px;
    height: 6px;
    top: 18px;
    right: 10px;
  }

  .sun {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    box-shadow: 
      0 0 20px rgba(255, 215, 0, 0.6),
      0 0 40px rgba(255, 215, 0, 0.4),
      inset 0 0 10px rgba(255, 255, 255, 0.5);
    position: relative;
    animation: sunPulse 2s ease-in-out infinite;
  }

  .ray {
    position: absolute;
    width: 3px;
    height: 12px;
    background: linear-gradient(to bottom, #ffd700, transparent);
    border-radius: 2px;
    top: 50%;
    left: 50%;
    transform-origin: center;
  }

  .ray-1 { transform: translate(-50%, -50%) rotate(0deg) translateY(-28px); }
  .ray-2 { transform: translate(-50%, -50%) rotate(45deg) translateY(-28px); }
  .ray-3 { transform: translate(-50%, -50%) rotate(90deg) translateY(-28px); }
  .ray-4 { transform: translate(-50%, -50%) rotate(135deg) translateY(-28px); }
  .ray-5 { transform: translate(-50%, -50%) rotate(180deg) translateY(-28px); }
  .ray-6 { transform: translate(-50%, -50%) rotate(225deg) translateY(-28px); }
  .ray-7 { transform: translate(-50%, -50%) rotate(270deg) translateY(-28px); }
  .ray-8 { transform: translate(-50%, -50%) rotate(315deg) translateY(-28px); }

  @keyframes celestialSpin {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(1); }
  }

  @keyframes moonGlow {
    0%, 100% { box-shadow: inset -5px -5px 10px rgba(0, 0, 0, 0.2), 0 0 20px rgba(240, 240, 240, 0.5); }
    50% { box-shadow: inset -5px -5px 10px rgba(0, 0, 0, 0.2), 0 0 30px rgba(240, 240, 240, 0.8); }
  }

  @keyframes sunPulse {
    0%, 100% { 
      box-shadow: 
        0 0 20px rgba(255, 215, 0, 0.6),
        0 0 40px rgba(255, 215, 0, 0.4),
        inset 0 0 10px rgba(255, 255, 255, 0.5);
    }
    50% { 
      box-shadow: 
        0 0 30px rgba(255, 215, 0, 0.8),
        0 0 60px rgba(255, 215, 0, 0.6),
        inset 0 0 15px rgba(255, 255, 255, 0.7);
    }
  }

  @media (max-width: 768px) {
    .theme-toggle {
      width: 60px;
      height: 60px;
      top: 20px;
      right: 20px;
    }

    .moon, .sun {
      width: 38px;
      height: 38px;
    }
  }
</style>
