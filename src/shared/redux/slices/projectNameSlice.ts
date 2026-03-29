import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectNameState {
  name: string;
  isLoading: boolean;
}

const initialState: ProjectNameState = {
  name: '',
  isLoading: false
};

export const projectNameSlice = createSlice({
  name: 'projectName',
  initialState,
  reducers: {
    setProjectName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    clearProjectName: (state) => {
      state.name = '';
    },
    setProjectNameLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setProjectName, clearProjectName, setProjectNameLoading } =
  projectNameSlice.actions;