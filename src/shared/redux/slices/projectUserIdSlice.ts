import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectUserIdState {
  userId: string | null;
  isLoading: boolean;
}

const initialState: ProjectUserIdState = {
  userId: null,
  isLoading: false
};

export const projectUserIdSlice = createSlice({
  name: 'projectUserId',
  initialState,
  reducers: {
    setProjectUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    clearProjectUserId: (state) => {
      state.userId = null;
    },
    setProjectUserIdLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setProjectUserId, clearProjectUserId, setProjectUserIdLoading } =
  projectUserIdSlice.actions;