import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  tagNames: [],
  isVisible: true,
  link: null,
  userId: null,
  autosave: false,
  isLoading: false
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectData: (state, action) => {
      const { name, tagNames, isVisible, link, userId, autosave } =
        action.payload;
      state.name = name;
      state.tagNames = tagNames;
      state.isVisible = isVisible;
      state.link = link;
      state.userId = userId;
      state.autosave = autosave;
    },
    clearProjectData: (state) => {
      state.name = '';
      state.tagNames = [];
      state.isVisible = true;
      state.link = null;
      state.userId = null;
      state.autosave = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setProjectData, clearProjectData, setLoading } =
  projectSlice.actions;
