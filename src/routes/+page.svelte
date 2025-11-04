<script lang="ts">
  import '../app.css';
  import GalaxyCanvas from '$lib/components/GalaxyCanvas.svelte';
  import Planet from '$lib/components/Planet.svelte';
  import ProjectModal from '$lib/components/ProjectModal.svelte';
  import MoonLogin from '$lib/components/MoonLogin.svelte';
  import { dataStore } from '$lib/stores/data';
  import { onMount } from 'svelte';
  import type { Project } from '$lib/types';



  let projects = $state<Project[]>([]);
  let aboutText = $state('');
  let hireText = $state('');
  let hireFormLink = $state('');
  let showAbout = $state(false);
  let showHire = $state(false);
  let loading = $state(true);

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      // Load projects from Supabase
      await dataStore.projects.load();
      const unsubscribeProjects = dataStore.projects.subscribe(value => {
        if (value.length > 0) {
          projects = value.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            long_description: p.description || '',
            tags: p.skills_used || [],
            importance: p.importance || 3, // Use generated importance
            x_position: Number(p.x_position) || 50,
            y_position: Number(p.y_position) || 50,
            color: p.color || '#8b5cf6', // Use generated color
            published: true,
            demo_url: p.live_link || '',
            github_url: p.github_link,
            image_url: '', // Not in Supabase schema
            created_at: p.created_at
          }));
        }
      });

      // Load profile from Supabase
      await dataStore.profile.load();
      const unsubscribeProfile = dataStore.profile.subscribe(value => {
        aboutText = value.about_text || '';
        hireText = value.hire_text || '';
        hireFormLink = value.hire_form_link || 'https://forms.gle/VTqY4WynfDUTDfz68';
      });

      // Clean up subscriptions when component is destroyed
      return () => {
        unsubscribeProjects();
        unsubscribeProfile();
      };
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      loading = false;
    }
  }

  // Fallback projects if database is empty
  const fallbackProjects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution',
      long_description: 'A comprehensive e-commerce platform built with modern web technologies. Features include user authentication, product management, shopping cart, payment integration with Stripe, real-time inventory tracking, and advanced analytics dashboard.',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
      importance: 5,
      x_position: 50,
      y_position: 30,
      color: '#8b5cf6',
      published: true,
      demo_url: 'https://example.com',
      github_url: 'https://github.com',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Task Manager Pro',
      description: 'Collaborative task management app',
      long_description: 'A real-time collaborative task management application with drag-and-drop functionality, team collaboration features, progress tracking, time estimates, and Kanban boards. Built for teams of all sizes.',
      tags: ['Vue.js', 'Firebase', 'Tailwind', 'WebSocket'],
      importance: 4,
      x_position: 75,
      y_position: 45,
      color: '#ec4899',
      published: true,
      demo_url: 'https://example.com',
      github_url: 'https://github.com',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Weather Dashboard',
      description: 'Real-time weather tracking',
      long_description: 'An interactive weather dashboard that provides real-time weather data, 7-day forecasts, beautiful visualizations, weather maps, and severe weather alerts using multiple weather APIs.',
      tags: ['Svelte', 'TypeScript', 'API', 'D3.js'],
      importance: 3,
      x_position: 70,
      y_position: 70,
      color: '#06b6d4',
      published: true,
      demo_url: 'https://example.com',
      github_url: 'https://github.com',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Portfolio Galaxy',
      description: 'Interactive portfolio website',
      long_description: 'A stunning portfolio website with smooth 3D animations, parallax effects, responsive design, dark/light mode, and an admin panel for content management. Built with SvelteKit and Supabase.',
      tags: ['SvelteKit', 'Supabase', 'Three.js'],
      importance: 5,
      x_position: 30,
      y_position: 70,
      color: '#10b981',
      published: true,
      demo_url: 'https://example.com',
      github_url: 'https://github.com',
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      title: 'AI Chat Bot',
      description: 'Intelligent conversational AI',
      long_description: 'An advanced AI-powered chatbot with natural language processing, context awareness, multi-language support, and integration with various messaging platforms.',
      tags: ['Python', 'TensorFlow', 'NLP', 'FastAPI'],
      importance: 4,
      x_position: 25,
      y_position: 45,
      color: '#f59e0b',
      published: true,
      demo_url: 'https://example.com',
      github_url: 'https://github.com',
      created_at: new Date().toISOString()
    }
  ];

  // Use fallback if no projects loaded
  $effect(() => {
    if (!loading && projects.length === 0) {
      projects = fallbackProjects;
    }
  });

  let selectedProject = $state<Project | null>(null);

  function openProject(project: Project) {
    selectedProject = project;
  }

  function closeModal() {
    selectedProject = null;
  }
</script>

<svelte:head>
  <title>Galaxy Resume - Interactive Portfolio</title>
  <meta name="description" content="A cinematic cosmic portfolio experience" />
</svelte:head>

<MoonLogin />

<GalaxyCanvas>
  <div class="content">
    <!-- Hero Section -->
    <header class="hero">
      <h1 class="title">
        Welcome to My Galaxy
      </h1>
      <p class="subtitle">
        Explore the cosmos — Click any planet to discover projects
      </p>
    </header>

    <!-- Planets Container -->
    <div class="planets-container">
      {#if loading}
        <div class="loading">Loading...</div>
      {:else}
        {#each projects as project (project.id)}
          <Planet {project} onclick={() => openProject(project)} />
        {/each}
      {/if}
    </div>

    <!-- About Me Button -->
    <button class="about-btn" onclick={() => showAbout = true}>
      About Me
    </button>

    <!-- Hire Me Button -->
    <button class="hire-btn" onclick={() => showHire = true}>
      Hire Me
    </button>
  </div>
</GalaxyCanvas>

<!-- About Modal -->
{#if showAbout}
  <div class="about-modal" onclick={() => showAbout = false}>
    <div class="about-box" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={() => showAbout = false}>✕</button>
      <h2>About Me</h2>
      <div class="about-content">
        {#if aboutText}
          <p>{aboutText}</p>
        {:else}
          <p>Welcome to my cosmic portfolio! I'm a passionate developer creating amazing experiences.</p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<!-- Hire Me Modal -->
{#if showHire}
  <div class="about-modal" onclick={() => showHire = false}>
    <div class="about-box" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={() => showHire = false}>✕</button>
      <h2>Hire Me</h2>
      <div class="about-content">
        {#if hireText}
          <p>{hireText}</p>
        {:else}
          <p>I'm available for hire and exciting opportunities! Let's work together on your next project.</p>
        {/if}
        <a href={hireFormLink} target="_blank" rel="noopener noreferrer" class="hire-form-btn">
          Get in Touch →
        </a>
      </div>
    </div>
  </div>
{/if}

<ProjectModal project={selectedProject} onclose={closeModal} />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .content {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  /* Hero Section - Cinematic */
  .hero {
    position: relative;
    text-align: center;
    padding: clamp(40px, 8vh, 80px) 20px clamp(30px, 5vh, 50px);
    z-index: 1000;
    animation: fadeInDown 1.5s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 1200px;
    width: 100%;
    pointer-events: none;
  }

  .hero * {
    pointer-events: auto;
  }

  .title {
    font-size: clamp(2.5rem, 7vw, 6rem);
    font-weight: 900;
    margin: 0 0 clamp(15px, 2vh, 25px) 0;
    letter-spacing: -0.03em;
    line-height: 1.1;
    background: linear-gradient(
      135deg,
      #ffffff 0%,
      #e0f2ff 20%,
      #ffd4e5 40%,
      #fff4a3 60%,
      #e0f2ff 80%,
      #ffffff 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% 200%;
    animation: gradientFlow 12s ease infinite;
    filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.5))
            drop-shadow(0 0 80px rgba(168, 230, 255, 0.3));
  }



  .subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: clamp(1rem, 2vw, 1.4rem);
    font-weight: 400;
    margin: 0;
    letter-spacing: 0.02em;
    line-height: 1.6;
    animation: fadeIn 2s ease-out 0.5s both;
    text-shadow: 0 2px 30px rgba(0, 0, 0, 0.8);
    max-width: 600px;
    margin: 0 auto;
  }



  /* Planets Container - Responsive */
  .planets-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .planets-container :global(*) {
    pointer-events: auto;
  }

  /* Animations - Cinematic */
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-60px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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

  @keyframes gradientFlow {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  /* Responsive Design - All Screen Sizes */
  @media (min-width: 1920px) {
    .hero {
      padding: 100px 40px 60px;
    }
  }

  @media (max-width: 1440px) {
    .hero {
      padding: 70px 30px 45px;
    }
  }

  @media (max-width: 1024px) {
    .hero {
      padding: 60px 25px 40px;
    }
  }

  @media (max-width: 768px) {
    .hero {
      padding: 50px 20px 35px;
    }
    
    .subtitle {
      padding: 0 15px;
    }
  }

  @media (max-width: 480px) {
    .hero {
      padding: 40px 15px 30px;
    }
    
    .subtitle {
      padding: 0 10px;
    }
  }

  /* Prevent layout collapse on resize */
  @media (min-height: 900px) {
    .hero {
      padding-top: clamp(80px, 10vh, 120px);
    }
  }

  @media (max-height: 600px) {
    .hero {
      padding: 30px 20px 20px;
    }
    
    .title {
      margin-bottom: 10px;
    }
  }

  /* About Button */
  .about-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 15px 30px;
    background: rgba(147, 112, 219, 0.2);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(147, 112, 219, 0.5);
    border-radius: 25px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 1500;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .about-btn:hover {
    background: rgba(147, 112, 219, 0.4);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(147, 112, 219, 0.4);
  }

  .about-btn:active {
    transform: translateY(-1px);
  }

  /* Hire Me Button */
  .hire-btn {
    position: fixed;
    bottom: 30px;
    right: 180px;
    padding: 15px 30px;
    background: rgba(16, 185, 129, 0.2);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(16, 185, 129, 0.5);
    border-radius: 25px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 1500;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .hire-btn:hover {
    background: rgba(16, 185, 129, 0.4);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
  }

  .hire-btn:active {
    transform: translateY(-1px);
  }

  /* About Modal */
  .about-modal {
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

  .about-box {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 20px;
    padding: 40px;
    width: 90%;
    max-width: 600px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    position: relative;
    animation: slideUp 0.3s ease;
    max-height: 80vh;
    overflow-y: auto;
  }

  .about-box h2 {
    color: white;
    margin: 0 0 20px 0;
    font-size: 32px;
  }

  .about-content {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.8;
    font-size: 16px;
  }

  .about-content p {
    margin: 0 0 20px 0;
  }

  .hire-form-btn {
    display: inline-block;
    padding: 12px 30px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.5));
    border: 2px solid rgba(16, 185, 129, 0.6);
    border-radius: 12px;
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease;
    margin-top: 10px;
  }

  .hire-form-btn:hover {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(16, 185, 129, 0.7));
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
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

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 24px;
    text-align: center;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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

  /* Mobile Optimizations */
  @media (max-width: 768px) {
    .content {
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }

    .about-btn {
      bottom: 80px;
      right: 20px;
      padding: 14px 28px;
      font-size: 15px;
      min-height: 48px;
      min-width: 120px;
    }

    .hire-btn {
      bottom: 20px;
      right: 20px;
      padding: 14px 28px;
      font-size: 15px;
      min-height: 48px;
      min-width: 120px;
    }

    .about-box {
      padding: 30px 20px;
      width: 95%;
      max-height: 85vh;
    }

    .about-box h2 {
      font-size: 24px;
    }

    .hire-form-btn {
      padding: 12px 28px;
      font-size: 15px;
      min-height: 48px;
      width: 100%;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .about-btn,
    .hire-btn {
      padding: 12px 20px;
      font-size: 14px;
      min-height: 44px;
      min-width: 100px;
      bottom: 15px;
      right: 15px;
    }

    .about-btn {
      bottom: 70px;
    }

    .about-box {
      padding: 25px 15px;
      border-radius: 15px;
    }
  }

</style>
