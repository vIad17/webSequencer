import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  isLoading: false,
  error: null
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
    },
    setProjectUserIdError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setProjectUserId,
  clearProjectUserId,
  setProjectUserIdLoading,
  setProjectUserIdError
} = projectUserIdSlice.actions;
