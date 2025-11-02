import { writable } from 'svelte/store';

export type Theme = 'dark' | 'light';

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>('dark');

  return {
    subscribe,
    toggle: () => update(current => current === 'dark' ? 'light' : 'dark'),
    set
  };
}

export const theme = createThemeStore();
