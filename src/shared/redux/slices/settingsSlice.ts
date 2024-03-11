import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  bpm: number;
  tacts: number;
}

const initialState: SettingsState = {
  bpm: 120,
  tacts: 8
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setBpm: (state, action: PayloadAction<number>) => ({
      ...state,
      bpm: action.payload
    }),
    setTacts: (state, action: PayloadAction<number>) => ({
      ...state,
      tacts: action.payload
    })
  }
});
export const { setBpm, setTacts } = settingsSlice.actions;
