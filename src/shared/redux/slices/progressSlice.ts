import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProgressState {
  currentStep: string | null;
  progress: number | null;
}

const initialState: ProgressState = {
  currentStep: null,
  progress: null
};

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setProgress(state, action: PayloadAction<number | null>) {
      state.progress = action.payload; // OK with immer (RTK auto-creates new state)
    },
    setCurrentStep(state, action: PayloadAction<string | null>) {
      state.currentStep = action.payload;
    }
  }
});
export const { setCurrentStep, setProgress } = progressSlice.actions;
