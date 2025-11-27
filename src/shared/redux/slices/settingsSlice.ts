import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  bpm: number | null;
  tacts: number | null;
}

const initialState: SettingsState = {
  bpm: null,
  tacts: null
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsState>) => ({
      ...state,
      ...action.payload
    }),
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
export const { setSettings, setBpm, setTacts } = settingsSlice.actions;
