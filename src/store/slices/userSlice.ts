import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types';

const initialState: User = {
  name: 'Nitish',
  role: 'Senior Designer',
  avatarUrl: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (_, action: { payload: User }) => action.payload,
    updateUser: (state, action: { payload: Partial<User> }) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
