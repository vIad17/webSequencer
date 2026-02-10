import { arrayMove } from '@dnd-kit/sortable';
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

type MoveEffectPayload = { id: string; toIndex: number };

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
    moveEffect: (state, action: PayloadAction<MoveEffectPayload>) => {
      if (state.effects.length <= 1) return;

      let fromIndex: number;
      let toIndex: number;
      
      fromIndex = state.effects.findIndex((e) => e.id === action.payload.id);
      toIndex = action.payload.toIndex;

      if (toIndex === -1) return;
      if (fromIndex < 0 || fromIndex >= state.effects.length) return;

      toIndex = Math.max(0, Math.min(toIndex, length - 1));
      
      if (fromIndex === toIndex) return;

      arrayMove(state.effects, fromIndex, toIndex);
      return;
    },

    setEffects: (state, action: PayloadAction<Effect[]>) => ({
      ...state,
      effects: action.payload
    }),
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
export const { setEffects, addEffect, removeEffect } = effectsSlice.actions;
