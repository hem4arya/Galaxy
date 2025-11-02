import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase } from '$lib/supabaseClient';
import { generatePlanetColor, generatePlanetImportance } from '$lib/utils/planetGenerator';
import type { Project } from '$lib/types';

interface Profile {
  id: number;
  about_text: string;
  hire_text?: string;
  collab_text?: string;
  hire_form_link?: string;
  updated_at?: string;
}

interface SupabaseProject {
  id: string;
  title: string;
  description: string;
  live_link?: string;
  github_link: string;
  skills_used: string[];
  Position: number[]; // [x_position, y_position]
  created_at: string;
}

interface SupabaseProfile {
  id: number;
  about_text: string;
  hire_text?: string;
  collab_text?: string;
  hire_form_link?: string;
}

function createDataStore() {
  const projects = writable<any[]>([]);
  const profile = writable<Profile>({
    id: 1,
    about_text: 'Welcome to my cosmic portfolio!',
    hire_form_link: 'https://forms.gle/VTqY4WynfDUTDfz68'
  });

  return {
    projects: {
      subscribe: projects.subscribe,
      load: async () => {
        try {
          const { data: projectsData, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error loading projects:', error);
            return;
          }

          if (projectsData) {
            // Transform Supabase data to match our format with dynamic colors and sizes
            const transformedProjects = projectsData.map((p: SupabaseProject) => {
              const projectData = {
                id: p.id,
                title: p.title,
                description: p.description,
                github_link: p.github_link,
                live_link: p.live_link || '',
                image_url: '', // Not in Supabase schema, set as empty
                x_position: p.Position?.[0] || 50,
                y_position: p.Position?.[1] || 50,
                skills_used: p.skills_used || [],
                created_at: p.created_at
              };



              // Generate unique color and importance for each planet
              return {
                ...projectData,
                color: generatePlanetColor(p.id),
                importance: generatePlanetImportance(projectData)
              };
            });
            
            projects.set(transformedProjects);
          }
        } catch (error) {
          console.error('Error loading projects:', error);
        }
      },
      add: async (project: any) => {
        try {
          const positionArray = [
            Number(project.x_position) || 50, 
            Number(project.y_position) || 50
          ];
          

          
          const { data, error } = await supabase
            .from('projects')
            .insert({
              title: project.title,
              description: project.description,
              live_link: project.live_link || '',
              github_link: project.github_link || '',
              skills_used: project.skills_used || [],
              Position: positionArray
            })
            .select()
            .single();

          if (error) {
            console.error('Error adding project:', error);
            throw error;
          }

          // Reload projects to get updated list
          await dataStore.projects.load();
          return data;
        } catch (error) {
          console.error('Error adding project:', error);
          throw error;
        }
      },
      update: async (id: string, updates: any) => {
        try {
          const updateData: any = {
            title: updates.title,
            description: updates.description,
            live_link: updates.live_link || '',
            github_link: updates.github_link || '',
            skills_used: updates.skills_used || []
          };

          // Update position if provided
          if (updates.x_position !== undefined || updates.y_position !== undefined) {
            updateData.Position = [
              Number(updates.x_position) || 50,
              Number(updates.y_position) || 50
            ];
          }

          const { error } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', id);

          if (error) {
            console.error('Error updating project:', error);
            throw error;
          }

          // Reload projects to get updated list
          await dataStore.projects.load();
        } catch (error) {
          console.error('Error updating project:', error);
          throw error;
        }
      },
      delete: async (id: string) => {
        try {
          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Error deleting project:', error);
            throw error;
          }

          // Reload projects to get updated list
          await dataStore.projects.load();
        } catch (error) {
          console.error('Error deleting project:', error);
          throw error;
        }
      }
    },
    profile: {
      subscribe: profile.subscribe,
      load: async () => {
        try {
          const { data: profileData, error } = await supabase
            .from('profile')
            .select('*')
            .limit(1)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading profile:', error);
            return;
          }

          if (profileData) {
            const transformedProfile: Profile = {
              id: profileData.id,
              about_text: profileData.about_text || 'Welcome to my cosmic portfolio!',
              hire_text: profileData.hire_text || '',
              collab_text: profileData.collab_text || '',
              hire_form_link: profileData.hire_form_link || 'https://forms.gle/VTqY4WynfDUTDfz68'
            };
            profile.set(transformedProfile);
          } else {
            // Create default profile if none exists
            await dataStore.profile.save({
              id: 1,
              about_text: 'Welcome to my cosmic portfolio!',
              hire_text: 'I\'m available for hire and exciting opportunities!',
              collab_text: 'Let\'s collaborate on amazing projects together!',
              hire_form_link: 'https://forms.gle/VTqY4WynfDUTDfz68'
            });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      },
      save: async (profileData: Profile) => {
        try {
          const { data, error } = await supabase
            .from('profile')
            .upsert({
              id: profileData.id,
              about_text: profileData.about_text,
              hire_text: profileData.hire_text || '',
              collab_text: profileData.collab_text || '',
              hire_form_link: profileData.hire_form_link || 'https://forms.gle/VTqY4WynfDUTDfz68'
            })
            .select()
            .single();

          if (error) {
            console.error('Error saving profile:', error);
            throw error;
          }

          if (data) {
            profile.set({
              id: data.id,
              about_text: data.about_text,
              hire_text: data.hire_text,
              collab_text: data.collab_text,
              hire_form_link: data.hire_form_link
            });
          }
        } catch (error) {
          console.error('Error saving profile:', error);
          throw error;
        }
      }
    }
  };
}

export const dataStore = createDataStore();