import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum EffectType {
  ADSR,
  TREMOLO,
  DELAY,
  DISTORTION,
  BITS,
  PITCH_SHIFT,
  FILTER
}

export interface Effect {
  type: EffectType
  id: string
}

interface EffectsState {
  effects: Effect[]
}

const initialState: EffectsState = {
  effects: []
};

export const effectsSlice = createSlice({
  name: 'effects',
  initialState,
  reducers: {
    addEffect: (state, action: PayloadAction<Effect>) => ({
      ...state,
      effects: [...state.effects, action.payload]
    }),
    removeEffect: (state, action: PayloadAction<string>) => ({
      ...state,
      effects: state.effects.filter(e => e.id !== action.payload),
    }),
  }
});
export const { addEffect, removeEffect } = effectsSlice.actions;
