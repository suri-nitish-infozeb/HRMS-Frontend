import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjects } from '../../api';
import type { ResumeBoardFilterOption } from '../../types/resumeBoard';

export const fetchProjects = createAsyncThunk<ResumeBoardFilterOption[]>(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      return await getProjects();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load projects';
      return rejectWithValue(message);
    }
  }
);

export interface ProjectsState {
  list: ResumeBoardFilterOption[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  list: [],
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProjectsError } = projectsSlice.actions;
export default projectsSlice.reducer;
