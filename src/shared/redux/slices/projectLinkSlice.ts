import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectLinkState {
  link: string | null;
  isLoading: boolean;
}

const initialState: ProjectLinkState = {
  link: null,
  isLoading: false
};

//TODO(v.titkov) - can we move all project slices to one big slice?

export const projectLinkSlice = createSlice({
  name: 'projectLink',
  initialState,
  reducers: {
    setProjectLink: (state, action: PayloadAction<string | null>) => {
      state.link = action.payload;
    },
    clearProjectLink: (state) => {
      state.link = null;
    },
    setProjectLinkLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setProjectLink, clearProjectLink, setProjectLinkLoading } =
  projectLinkSlice.actions;