<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { dataStore } from '$lib/stores/data';
  import type { Project } from '$lib/types';

  let isAdmin = $state(false);
  let loading = $state(true);
  let activeTab = $state<'projects' | 'profile'>('projects');
  
  // Projects
  let projects = $state<Project[]>([]);
  let editingProject = $state<any | null>(null);
  
  // Profile
  let aboutText = $state('');
  let hireText = $state('');
  let collabText = $state('');
  let hireFormLink = $state('');
  let profileId = $state<number | null>(null);

  onMount(async () => {
    // Initialize auth and check session
    authStore.init();
    const isAuthenticated = await authStore.checkSession();
    
    const unsubscribe = authStore.subscribe(value => {
      isAdmin = value;
      if (!value) {
        goto('/');
      }
    });

    if (isAuthenticated) {
      await loadData();
    }

    return unsubscribe;
  });

  async function loadData() {
    loading = true;
    try {
      // Load projects from Supabase
      await dataStore.projects.load();
      const unsubscribeProjects = dataStore.projects.subscribe(value => {
        projects = value;
      });

      // Load profile from Supabase
      await dataStore.profile.load();
      const unsubscribeProfile = dataStore.profile.subscribe(value => {
        aboutText = value.about_text;
        hireText = value.hire_text || '';
        collabText = value.collab_text || '';
        hireFormLink = value.hire_form_link || 'https://forms.gle/VTqY4WynfDUTDfz68';
        profileId = value.id;
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

  async function saveProfile() {
    if (!profileId) return;
    
    try {
      await dataStore.profile.save({
        id: profileId,
        about_text: aboutText,
        hire_text: hireText,
        collab_text: collabText,
        hire_form_link: hireFormLink
      });
      
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile: ' + (error?.message || error));
    }
  }

  async function saveProject(project: any) {
    try {
      // Convert skills input string to array
      const skillsArray = project.skills_input 
        ? project.skills_input.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill.length > 0)
        : [];
      
      if (project.id) {
        // Update existing project
        await dataStore.projects.update(project.id, {
          title: project.title,
          description: project.description,
          live_link: project.live_link,
          github_link: project.github_link,
          x_position: project.x_position,
          y_position: project.y_position,
          skills_used: skillsArray
        });
      } else {
        // Insert new project
        await dataStore.projects.add({
          title: project.title,
          description: project.description,
          live_link: project.live_link,
          github_link: project.github_link,
          x_position: project.x_position || 50,
          y_position: project.y_position || 50,
          skills_used: skillsArray
        });
      }
      
      editingProject = null;
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project: ' + (error?.message || error));
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await dataStore.projects.delete(id);
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project: ' + (error?.message || error));
    }
  }

  async function logout() {
    await authStore.logout();
    goto('/');
  }

  function startEdit(project: any) {
    editingProject = { 
      ...project,
      skills_input: project.skills_used ? project.skills_used.join(', ') : ''
    };
  }

  function startNew() {
    // Generate random positions for new projects to avoid overlap
    const randomX = Math.floor(Math.random() * 80) + 10; // 10-90
    const randomY = Math.floor(Math.random() * 80) + 10; // 10-90
    
    editingProject = {
      title: '',
      description: '',
      github_link: '',
      x_position: randomX,
      y_position: randomY,
      skills_used: [],
      skills_input: ''
    };
  }
</script>

{#if !isAdmin}
  <div class="loading">Checking authentication...</div>
{:else}
  <div class="admin-container">
    <header class="admin-header">
      <h1>🌌 Admin Dashboard</h1>
      <button class="logout-btn" onclick={logout}>Logout</button>
    </header>

    <div class="tabs">
      <button 
        class="tab" 
        class:active={activeTab === 'projects'}
        onclick={() => activeTab = 'projects'}
      >
        Projects
      </button>
      <button 
        class="tab" 
        class:active={activeTab === 'profile'}
        onclick={() => activeTab = 'profile'}
      >
        Profile
      </button>
    </div>

    {#if loading}
      <div class="loading">Loading...</div>
    {:else if activeTab === 'projects'}
      <div class="content-section">
        <div class="section-header">
          <h2>Projects</h2>
          <button class="add-btn" onclick={startNew}>+ Add Project</button>
        </div>

        <div class="projects-grid">
          {#each projects as project}
            <div class="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {#if project.skills_used && project.skills_used.length > 0}
                <div class="skills-display">
                  {#each project.skills_used.slice(0, 3) as skill}
                    <span class="skill-tag">{skill}</span>
                  {/each}
                  {#if project.skills_used.length > 3}
                    <span class="skill-more">+{project.skills_used.length - 3} more</span>
                  {/if}
                </div>
              {/if}
              <div class="project-meta">
                <span>Position: ({project.x_position}, {project.y_position})</span>
              </div>
              <div class="card-actions">
                <button onclick={() => startEdit(project)}>Edit</button>
                <button class="delete" onclick={() => deleteProject(project.id)}>Delete</button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if activeTab === 'profile'}
      <div class="content-section">
        <h2>Profile Management</h2>
        
        <div class="profile-section">
          <h3>About Me</h3>
          <textarea
            bind:value={aboutText}
            placeholder="Write about yourself..."
            rows="6"
          ></textarea>
        </div>

        <div class="profile-section">
          <h3>Hire Me Text</h3>
          <textarea
            bind:value={hireText}
            placeholder="Text about being available for hire..."
            rows="4"
          ></textarea>
        </div>

        <div class="profile-section">
          <h3>Hire Form Link</h3>
          <input
            type="url"
            bind:value={hireFormLink}
            placeholder="https://forms.gle/VTqY4WynfDUTDfz68"
            class="form-link-input"
          />
          <small>Link to your Google Form or contact form</small>
        </div>

        <div class="profile-section">
          <h3>Collaboration Text</h3>
          <textarea
            bind:value={collabText}
            placeholder="Text about collaboration opportunities..."
            rows="4"
          ></textarea>
        </div>

        <button class="save-btn" onclick={saveProfile}>Save Profile</button>
      </div>
    {/if}
  </div>

  {#if editingProject}
    <div class="modal" onclick={() => editingProject = null}>
      <div class="modal-content" onclick={(e) => e.stopPropagation()}>
        <h2>{editingProject.id ? 'Edit' : 'New'} Project</h2>
        
        <label>
          Title
          <input type="text" bind:value={editingProject.title} />
        </label>

        <label>
          Description
          <textarea bind:value={editingProject.description} rows="4"></textarea>
        </label>

        <label>
          Live Site Link
          <input type="url" bind:value={editingProject.live_link} placeholder="https://example.com" />
        </label>

        <label>
          GitHub Link
          <input type="url" bind:value={editingProject.github_link} />
        </label>

        <label>
          Skills Used (comma-separated)
          <input 
            type="text" 
            bind:value={editingProject.skills_input}
            placeholder="JavaScript, React, Node.js, MongoDB"
          />
          <small>Enter skills separated by commas</small>
        </label>

        <label>
          X Position (0-100)
          <input type="number" bind:value={editingProject.x_position} min="0" max="100" />
        </label>

        <label>
          Y Position (0-100)
          <input type="number" bind:value={editingProject.y_position} min="0" max="100" />
        </label>



        <div class="modal-actions">
          <button onclick={() => saveProject(editingProject)}>Save</button>
          <button onclick={() => editingProject = null}>Cancel</button>
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  .admin-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #0a0a1e 0%, #1a1a3e 100%);
    color: white;
    padding: 20px;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
  }

  .admin-header h1 {
    margin: 0;
    font-size: 32px;
  }

  .logout-btn {
    padding: 10px 20px;
    background: rgba(255, 100, 100, 0.2);
    border: 2px solid rgba(255, 100, 100, 0.5);
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .logout-btn:hover {
    background: rgba(255, 100, 100, 0.4);
  }

  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
  }

  .tab {
    padding: 15px 30px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .tab.active {
    background: rgba(147, 112, 219, 0.3);
    border-color: rgba(147, 112, 219, 0.5);
  }

  .content-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 30px;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .add-btn {
    padding: 10px 20px;
    background: rgba(100, 200, 100, 0.2);
    border: 2px solid rgba(100, 200, 100, 0.5);
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .add-btn:hover {
    background: rgba(100, 200, 100, 0.4);
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .project-card {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 20px;
    height: 280px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .project-card h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .project-card p {
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 15px 0;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    line-height: 1.4;
  }

  .project-meta {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }



  .card-actions {
    display: flex;
    gap: 10px;
  }

  .card-actions button {
    flex: 1;
    padding: 8px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .card-actions button:first-child {
    background: rgba(100, 150, 255, 0.3);
    color: white;
  }

  .card-actions button.delete {
    background: rgba(255, 100, 100, 0.3);
    color: white;
  }

  textarea {
    width: 100%;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    font-size: 16px;
    font-family: inherit;
    margin-bottom: 20px;
    resize: vertical;
  }

  .save-btn {
    padding: 15px 30px;
    background: rgba(100, 200, 100, 0.3);
    border: 2px solid rgba(100, 200, 100, 0.5);
    border-radius: 10px;
    color: white;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .save-btn:hover {
    background: rgba(100, 200, 100, 0.5);
  }

  .profile-section {
    margin-bottom: 25px;
  }

  .profile-section h3 {
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 10px 0;
    font-size: 18px;
  }

  label small {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    margin-top: 5px;
  }

  .form-link-input {
    width: 100%;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    font-size: 16px;
    font-family: inherit;
    margin-bottom: 5px;
  }

  .profile-section small {
    display: block;
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    margin-top: 5px;
  }

  .skills-display {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 15px;
  }

  .skill-tag {
    background: rgba(147, 112, 219, 0.3);
    color: #b19cd9;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 11px;
    border: 1px solid rgba(147, 112, 219, 0.5);
  }

  .skill-more {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 11px;
    font-style: italic;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 20px;
    padding: 30px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-content h2 {
    margin: 0 0 20px 0;
  }

  label {
    display: block;
    margin-bottom: 15px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }

  label input,
  label textarea {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 14px;
  }



  .modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .modal-actions button {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .modal-actions button:first-child {
    background: rgba(100, 200, 100, 0.3);
    color: white;
  }

  .modal-actions button:last-child {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .loading {
    text-align: center;
    padding: 50px;
    font-size: 24px;
  }
</style>
