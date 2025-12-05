import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  isLoading: false,
  error: null
};

export const projectNameSlice = createSlice({
  name: 'project_name',
  initialState,
  reducers: {
    setProjectName: (state, action) => {
      const name = action.payload;
      state.name = name;
    },
    clearProjectName: (state) => {
      state.name = '';
    },
    setProjectNameLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setProjectNameError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setProjectName,
  clearProjectName,
  setProjectNameLoading,
  setProjectNameError
} = projectNameSlice.actions;
