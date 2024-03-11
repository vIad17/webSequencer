import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BitState {
  bit: number;
}

const initialState: BitState = {
  bit: 0
};

export const bitSlice = createSlice({
  name: 'bit',
  initialState,
  reducers: {
    setBit: (state, action: PayloadAction<number>) => ({
      ...state,
      bit: action.payload
    })
  }
});
export const { setBit } = bitSlice.actions;
