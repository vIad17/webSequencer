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
  playingNotes: string[];
  currentNote: string;
  deltaSize: number;
}

const initialState: NotesArrayState = {
  notesArray: [],
  playingNotes: [],
  currentNote: '',
  deltaSize: 0
};

export const notesArraySlice = createSlice({
  name: 'notesArray',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => ({
      ...state,
      notesArray: action.payload
    }),
    addNote: (state, action: PayloadAction<Note>) => ({
      ...state,
      notesArray: [...state.notesArray, action.payload]
    }),
    addNotes: (state, action: PayloadAction<Note[]>) => ({
      ...state,
      notesArray: [...state.notesArray, ...action.payload]
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
      notesArray: state.notesArray.filter(
        (_, index) => index !== action.payload
      )
    }),
    changeActiveNote: (state, action: PayloadAction<ChangeActiveType>) => ({
      ...state,
      notesArray: state.notesArray.map((element, i) =>
        i === action.payload.index
          ? { ...element, isActive: action.payload.isActive ?? true }
          : { ...element, isActive: false }
      )
    }),
    addActiveNote: (state, action: PayloadAction<number>) => ({
      ...state,
      notesArray: state.notesArray.map((element, i) =>
        i === action.payload
          ? { ...element, isActive: !element.isActive }
          : element
      )
    }),
    removeActiveNotes: (state) => ({
      ...state,
      notesArray: state.notesArray.map((element) => ({...element, isActive: false})
      )
    }),
    addPlayingNote: (state, action: PayloadAction<string>) => ({
      ...state,
      playingNotes: [...state.playingNotes, action.payload]
    }),
    removePlayingNote: (state, action: PayloadAction<string>) => ({
      ...state,
      playingNotes: state.playingNotes.filter((item) => item !== action.payload)
    }),
    setCurrentNote: (state, action: PayloadAction<string>) => ({
      ...state,
      currentNote: action.payload
    }),
    setDeltaSize: (state, action: PayloadAction<number>) => ({
      ...state,
      deltaSize: action.payload
    })
  }
});
export const {
  setNotes,
  addNote,
  updateNotePosition,
  updateNoteDuration,
  deleteNote,
  changeActiveNote,
  addActiveNote,
  removeActiveNotes,
  addPlayingNote,
  removePlayingNote,
  setCurrentNote,
  setDeltaSize,
  addNotes
} = notesArraySlice.actions;
