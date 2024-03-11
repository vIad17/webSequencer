import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Note } from 'src/shared/interfaces';

export interface UpdateNoteDurationType {
  index: number;
  duration: number;
}

export interface UpdateNotePositionType {
  index: number;
  attackTime: number;
  note: number;
}

export interface ChangeActiveType {
  index: number;
  isActive?: boolean;
}

interface NotesArrayState {
  notesArray: Note[];
  deltaSize: number;
}

const initialState: NotesArrayState = {
  notesArray: [],
  deltaSize: 0
};

export const notesArraySlice = createSlice({
  name: 'notesArray',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => ({
      ...state,
      notesArray: [...state.notesArray, action.payload]
    }),
    updateNotePosition: (
      state,
      action: PayloadAction<UpdateNotePositionType>
    ) => {
      return {
        ...state,
        notesArray: state.notesArray.map((element, i) =>
          i === action.payload.index
            ? {
                ...element,
                note: action.payload.note,
                attackTime: action.payload.attackTime
              }
            : element
        )
      };
    },
    updateNoteDuration: (
      state,
      action: PayloadAction<UpdateNoteDurationType>
    ) => {
      return {
        ...state,
        notesArray: state.notesArray.map((element, i) =>
          i === action.payload.index
            ? { ...element, duration: action.payload.duration }
            : element
        )
      };
    },
    deleteNote: (state, action: PayloadAction<number>) => ({
      ...state,
      notesArray: state.notesArray.filter((_, index) => {
        return index !== action.payload;
      })
    }),
    changeActive: (state, action: PayloadAction<ChangeActiveType>) => ({
      ...state,
      notesArray: state.notesArray.map((element, i) =>
        i === action.payload.index
          ? { ...element, isActive: action.payload.isActive ?? true }
          : { ...element, isActive: false }
      )
    }),
    addActive: (state, action: PayloadAction<number>) => ({
      ...state,
      notesArray: state.notesArray.map((element, i) =>
        i === action.payload
          ? { ...element, isActive: !element.isActive }
          : element
      )
    }),
    setDeltaSize: (state, action: PayloadAction<number>) => ({
      ...state,
      deltaSize: action.payload
    })
  }
});
export const {
  addNote,
  updateNotePosition,
  updateNoteDuration,
  deleteNote,
  changeActive,
  addActive,
  setDeltaSize
} = notesArraySlice.actions;
