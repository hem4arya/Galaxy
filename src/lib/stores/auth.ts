import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const HARDCODED_PASSWORD = 'Hem123arya@';
const SESSION_KEY = 'galaxy_admin_session';

function createAuthStore() {
  const { subscribe, set } = writable<boolean>(false);

  return {
    subscribe,
    login: async (password: string) => {
      if (password === HARDCODED_PASSWORD) {
        if (browser) {
          // Store session in localStorage
          localStorage.setItem(SESSION_KEY, 'authenticated');
          // Set expiration (24 hours from now)
          const expiration = Date.now() + (24 * 60 * 60 * 1000);
          localStorage.setItem(SESSION_KEY + '_expires', expiration.toString());
          
          // Also set cookies for server-side authentication
          document.cookie = `galaxy_admin_session=authenticated; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`;
          document.cookie = `galaxy_admin_session_expires=${expiration}; path=/; max-age=${24 * 60 * 60}; SameSite=Strict`;
        }
        set(true);
        return true;
      }
      return false;
    },
    logout: async () => {
      if (browser) {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY + '_expires');
        
        // Clear cookies
        document.cookie = 'galaxy_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'galaxy_admin_session_expires=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      set(false);
    },
    checkSession: async () => {
      if (!browser) return false;
      
      const session = localStorage.getItem(SESSION_KEY);
      const expiration = localStorage.getItem(SESSION_KEY + '_expires');
      
      if (session && expiration) {
        const expirationTime = parseInt(expiration);
        const now = Date.now();
        
        if (now < expirationTime) {
          set(true);
          return true;
        } else {
          // Session expired, clean up
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(SESSION_KEY + '_expires');
          document.cookie = 'galaxy_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'galaxy_admin_session_expires=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      }
      
      set(false);
      return false;
    },
    init: function() {
      // Check session on initialization
      if (browser) {
        this.checkSession();
      }
    }
  };
}

export const authStore = createAuthStore();
