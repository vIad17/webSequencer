import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  isLoading: false
};

export const projectUserIdSlice = createSlice({
  name: 'project_user_id',
  initialState,
  reducers: {
    setProjectUserId: (state, action) => {
      const userId = action.payload;
      state.userId = userId;
    },
    clearProjectUserId: (state) => {
      state.userId = null;
    },
    setProjectUserIdLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setProjectUserId, setProjectUserIdLoading } =
  projectUserIdSlice.actions;
