import { createSlice } from '@reduxjs/toolkit';
import type { AppMode } from '../../types';

export interface AppState {
  mode: AppMode;
  sidebarCollapsed: boolean;
}

const initialState: AppState = {
  mode: 'ai',
  sidebarCollapsed: false,
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
  },
});

export const { setMode, toggleMode, toggleSidebar } = appSlice.actions;
export default appSlice.reducer;
