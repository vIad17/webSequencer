import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from 'src/shared/interfaces';

interface CopiedObjectsState {
  objects: Note[];
}

const initialState: CopiedObjectsState = {
  objects: []
};

export const copiedObjectsSlise = createSlice({
  name: 'copiedObjects',
  initialState,
  reducers: {
    setCopiedObjects: (state, action: PayloadAction<Note[]>) => ({
      ...state,
      objects: action.payload
    }),
    deleteObjects: (state) => ({
      ...state,
      objects: []
    })
  }
});
export const { setCopiedObjects, deleteObjects } = copiedObjectsSlise.actions;
