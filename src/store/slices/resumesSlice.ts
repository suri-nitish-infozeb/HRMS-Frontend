import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getResumesByProject, getAllResumes } from '../../api/endpoints/resumes';
import type { ResumeCardItem } from '../../components/ResumeBoard/ResumeCard';

export const fetchResumesByProject = createAsyncThunk<
  ResumeCardItem[],
  string,
  { rejectValue: string }
>(
  'resumes/fetchResumesByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      return await getResumesByProject(projectId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load resumes';
      return rejectWithValue(message);
    }
  }
);

export const fetchAllResumes = createAsyncThunk<
  ResumeCardItem[],
  void,
  { rejectValue: string }
>(
  'resumes/fetchAllResumes',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllResumes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load resumes';
      return rejectWithValue(message);
    }
  }
);

export interface ResumesState {
  list: ResumeCardItem[];
  loading: boolean;
  error: string | null;
  projectId: string | null;
}

const initialState: ResumesState = {
  list: [],
  loading: false,
  error: null,
  projectId: null,
};

const resumesSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {
    clearResumesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumesByProject.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.projectId = action.meta.arg;
      })
      .addCase(fetchResumesByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload;
        state.projectId = action.meta.arg;
      })
      .addCase(fetchResumesByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load resumes';
        state.projectId = action.meta.arg;
      })
      .addCase(fetchAllResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.projectId = 'all';
      })
      .addCase(fetchAllResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload;
        state.projectId = 'all';
      })
      .addCase(fetchAllResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load resumes';
        state.projectId = 'all';
      });
  },
});

export const { clearResumesError } = resumesSlice.actions;
export default resumesSlice.reducer;
