<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let showLogin = $state(false);
  let password = $state('');
  let error = $state('');
  let isAdmin = $state(false);

  onMount(() => {
    authStore.init();
    authStore.checkSession();
  });

  $effect(() => {
    const unsubscribe = authStore.subscribe(value => {
      isAdmin = value;
    });
    return unsubscribe;
  });

  function handleMoonClick() {
    if (isAdmin) {
      goto('/admin');
    } else {
      showLogin = true;
    }
  }

  async function handleLogin(e: Event) {
    e.preventDefault();
    try {
      const success = await authStore.login(password);
      if (success) {
        showLogin = false;
        password = '';
        error = '';
        goto('/admin');
      } else {
        error = 'Invalid password';
        password = '';
      }
    } catch (err) {
      error = 'Login failed';
      password = '';
    }
  }

  function handleClose() {
    showLogin = false;
    password = '';
    error = '';
  }
</script>

<button class="moon-button" onclick={handleMoonClick} aria-label="Admin login">
  <div class="moon">
    <div class="crater crater-1"></div>
    <div class="crater crater-2"></div>
    <div class="crater crater-3"></div>
  </div>
</button>

{#if showLogin}
  <div class="login-modal" onclick={handleClose}>
    <div class="login-box" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={handleClose}>✕</button>
      <h2>Admin Access</h2>
      <form onsubmit={handleLogin}>
        <input
          type="password"
          bind:value={password}
          placeholder="Enter password"
          class="password-input"
          autofocus
        />
        {#if error}
          <p class="error">{error}</p>
        {/if}
        <button type="submit" class="login-btn">Login</button>
      </form>
    </div>
  </div>
{/if}

<style>
  .moon-button {
    position: fixed;
    top: 30px;
    right: 30px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    z-index: 2000;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .moon-button:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    background: rgba(255, 255, 255, 0.1);
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

  .login-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    animation: fadeIn 0.3s ease;
  }

  .login-box {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 20px;
    padding: 40px;
    width: 90%;
    max-width: 400px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    position: relative;
    animation: slideUp 0.3s ease;
  }

  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 24px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }

  h2 {
    color: white;
    margin: 0 0 30px 0;
    font-size: 28px;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .password-input {
    padding: 15px;
    border-radius: 10px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .password-input:focus {
    outline: none;
    border-color: rgba(147, 112, 219, 0.5);
    background: rgba(255, 255, 255, 0.08);
  }

  .password-input::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  .error {
    color: #ff6b6b;
    margin: 0;
    font-size: 14px;
    text-align: center;
  }

  .login-btn {
    padding: 15px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
  }

  @keyframes moonGlow {
    0%, 100% {
      box-shadow: inset -5px -5px 10px rgba(0, 0, 0, 0.2), 0 0 20px rgba(240, 240, 240, 0.5);
    }
    50% {
      box-shadow: inset -5px -5px 10px rgba(0, 0, 0, 0.2), 0 0 30px rgba(240, 240, 240, 0.8);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Mobile Solar System - Moon at Center */
  @media (max-width: 768px) {
    .moon-button {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      z-index: 500;
      box-shadow: 0 0 40px rgba(240, 240, 240, 0.6), 0 0 80px rgba(240, 240, 240, 0.3);
    }

    .moon-button:hover {
      transform: translate(-50%, -50%) scale(1.05);
    }

    .moon {
      width: 50px;
      height: 50px;
    }

    .crater-1 {
      width: 12px;
      height: 12px;
      top: 14px;
      left: 18px;
    }

    .crater-2 {
      width: 9px;
      height: 9px;
      top: 28px;
      left: 10px;
    }

    .crater-3 {
      width: 7px;
      height: 7px;
      top: 20px;
      right: 12px;
    }

    .login-box {
      padding: 30px 20px;
    }
  }

  @media (max-width: 480px) {
    .moon-button {
      width: 70px;
      height: 70px;
    }

    .moon {
      width: 45px;
      height: 45px;
    }
  }
</style>
