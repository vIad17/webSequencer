import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DrawableFieldState {
  elementWidth: number;
  elementHeight: number;
  columnsCount: number;
  rowsCount: number;
}

const initialState: DrawableFieldState = {
  elementWidth: 20,
  elementHeight: 35,
  columnsCount: 100,
  rowsCount: 72
};

export const drawableFieldSlice = createSlice({
  name: 'drawableField',
  initialState,
  reducers: {
    setElementWidth: (state, action: PayloadAction<number>) => ({
      ...state,
      elementWidth: action.payload
    }),
    setElementHeigth: (state, action: PayloadAction<number>) => ({
      ...state,
      elementHeight: action.payload
    }),
    setColumnsCount: (state, action: PayloadAction<number>) => ({
      ...state,
      columnsCount: action.payload
    }),
    setRowsCount: (state, action: PayloadAction<number>) => ({
      ...state,
      rowsCount: action.payload
    })
  }
});
export const {
  setElementWidth,
  setElementHeigth,
  setColumnsCount,
  setRowsCount
} = drawableFieldSlice.actions;
