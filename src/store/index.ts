import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';
import projectsReducer from './slices/projectsSlice';
import resumesReducer from './slices/resumesSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    projects: projectsReducer,
    resumes: resumesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
