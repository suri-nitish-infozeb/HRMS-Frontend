import { createSlice } from '@reduxjs/toolkit';
import type { AppMode, Theme } from '../../types';

const THEME_STORAGE_KEY = 'hrms-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

export interface AppState {
  mode: AppMode;
  sidebarCollapsed: boolean;
  theme: Theme;
}

const initialState: AppState = {
  mode: 'ai',
  sidebarCollapsed: false,
  theme: getInitialTheme(),
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMode: (state, action: { payload: AppMode }) => {
      state.mode = action.payload;
    },
    toggleMode: (state) => {
      state.mode = state.mode === 'ai' ? 'static' : 'ai';
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action: { payload: Theme }) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, action.payload);
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, state.theme);
      }
    },
  },
});

export const { setMode, toggleMode, toggleSidebar, setTheme, toggleTheme } = appSlice.actions;
export default appSlice.reducer;
