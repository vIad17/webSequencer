import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MelodyArray } from 'src/shared/interfaces';

interface ChangeValueType {
  note: string;
  position: number;
  isNotePressed: boolean;
}

interface MelodyArrayState {
  melodyArray: MelodyArray;
}

const initialState: MelodyArrayState = {
  melodyArray: {
    B6: [],
    'A#6': [],
    A6: [],
    'G#6': [],
    G6: [],
    'F#6': [],
    F6: [],
    E6: [],
    'D#6': [],
    D6: [],
    'C#6': [],
    C6: [],
    B5: [],
    'A#5': [],
    A5: [],
    'G#5': [],
    G5: [],
    'F#5': [],
    F5: [],
    E5: [],
    'D#5': [],
    D5: [],
    'C#5': [],
    C5: [],
    B4: [],
    'A#4': [],
    A4: [],
    'G#4': [],
    G4: [],
    'F#4': [],
    F4: [],
    E4: [],
    'D#4': [],
    D4: [],
    'C#4': [],
    C4: [],
    B3: [],
    'A#3': [],
    A3: [],
    'G#3': [],
    G3: [],
    'F#3': [],
    F3: [],
    E3: [],
    'D#3': [],
    D3: [],
    'C#3': [],
    C3: [],
    B2: [],
    'A#2': [],
    A2: [],
    'G#2': [],
    G2: [],
    'F#2': [],
    F2: [],
    E2: [],
    'D#2': [],
    D2: [],
    'C#2': [],
    C2: [],
    B1: [],
    'A#1': [],
    A1: [],
    'G#1': [],
    G1: [],
    'F#1': [],
    F1: [],
    E1: [],
    'D#1': [],
    D1: [],
    'C#1': [],
    C1: []
  }
};

export const melodyArraySlice = createSlice({
  name: 'melodyArray',
  initialState,
  reducers: {
    initArray: (state, action: PayloadAction<number>) => {
      const dict = state.melodyArray;
      for (const key in dict) {
        for (let i = 0; i < action.payload * 4; i++) {
          dict[key as keyof MelodyArray].push(false);
        }
      }
      // state.melodyArray = dict;
      return { ...state, melodyArray: dict };
    },
    resetArray: (state) => {
      const dict = state.melodyArray;
      for (const key in dict) {
        dict[key as keyof MelodyArray] = [];
      }
      // state.melodyArray = dict;
      return { ...state, melodyArray: dict };
    },
    resizeArray: (state, action: PayloadAction<number>) => {
      const bits = action.payload * 4;
      const dict: MelodyArray = initialState.melodyArray;
      for (const key in state.melodyArray) {
        dict[key as keyof MelodyArray] = [];
        for (let i = 0; i < bits; i++) {
          dict[key as keyof MelodyArray].push(
            state.melodyArray[key as keyof MelodyArray][i] || false
          );
        }
      }
      // state.melodyArray = dict;
      return { ...state, melodyArray: dict };
    },
    changeValue: (state, action: PayloadAction<ChangeValueType>) => {
      const dict = state.melodyArray;
      const key = action.payload.note;
      const index = action.payload.position;
      const value = action.payload.isNotePressed;
      dict[key as keyof MelodyArray][index] = value;

      /* eslint "no-param-reassign": "error" */
      state.melodyArray = dict;
      // return { ...state, melodyArray: dict };
    }
  }
});
export const { initArray, resetArray, resizeArray, changeValue } =
  melodyArraySlice.actions;
