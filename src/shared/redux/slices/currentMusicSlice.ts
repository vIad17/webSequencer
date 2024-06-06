import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentMusicState {
  currentBit: number;
  isPlaying: boolean;
}

const initialState: CurrentMusicState = {
  currentBit: 0,
  isPlaying: false
};

export const currentMusicSlice = createSlice({
  name: 'currentMusic',
  initialState,
  reducers: {
    setCurrentBit: (state, action: PayloadAction<number>) => ({
      ...state,
      currentBit: action.payload
    }),
    setIsPlaying: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isPlaying: action.payload
    })
  }
});
export const { setCurrentBit, setIsPlaying } = currentMusicSlice.actions;
