import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum EffectType {
  ADSR,
  TREMOLO,
  DELAY,
  DISTORTION,
  BITS,
  // FILTER,
  PITCH_SHIFT
}

export interface Effect {
  type: EffectType;
  id: string;
  isMuted?: boolean;
}

export interface EffectsState {
  effects: Effect[];
}

const initialState: EffectsState = {
  effects: []
};

export const effectsSlice = createSlice({
  name: 'effects',
  initialState,
  reducers: {
    setEffects: (state, action: PayloadAction<Effect[]>) => {
      state.effects = action.payload;
    },
    setIsEffectMuted: (state, action: PayloadAction<{ id: string, isMuted: boolean }>) => {
      const effect = state.effects.find(e => e.id === action.payload.id);
      if (effect) {
        effect.isMuted = action.payload.isMuted;
      }
    },
    toggleIsEffectMuted: (state, action: PayloadAction<{ id: string }>) => {
      const effect = state.effects.find(e => e.id === action.payload.id);
      if (effect) {
        effect.isMuted = !effect.isMuted;
      }
    },
    addEffect: (state, action: PayloadAction<Effect>) => {
      state.effects.push(action.payload);
    },
    removeEffect: (state, action: PayloadAction<string>) => {
      state.effects = state.effects.filter(e => e.id !== action.payload);
    },
  }
});

export const { setEffects, setIsEffectMuted, toggleIsEffectMuted, addEffect, removeEffect } = effectsSlice.actions;
