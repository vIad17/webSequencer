import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  link: null,
  isLoading: false,
  error: null
};

export const projectLinkSlice = createSlice({
  name: 'project_link',
  initialState,
  reducers: {
    setProjectLink: (state, action) => {
      const link = action.payload;
      state.link = link;
    },
    clearProjectLink: (state) => {
      state.link = null;
    },
    setProjectLinkLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setProjectLinkError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setProjectLink,
  clearProjectLink,
  setProjectLinkLoading,
  setProjectLinkError
} = projectLinkSlice.actions;
