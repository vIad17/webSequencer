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

export type EffectParams =
  EffectParamsADSR |
  EffectParamsTremollo |
  EffectParamsDelay |
  EffectParamsDistortion |
  EffectParamsBits |
  EffectParamsPitchShift |
  EffectParamsFilter

export interface EffectParamsADSR {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface EffectParamsTremollo {
  tremoloFrequency: number;
  tremoloDepth: number;
}

export interface EffectParamsDelay {
  delayTime: number;
  feedback: number;
}

export interface EffectParamsDistortion {
  distortion: number;
}

export interface EffectParamsBits {
  bits: number;
}

export interface EffectParamsPitchShift {
  pitchShift: number;
}

export interface EffectParamsFilter {
  lowFilter: number | null;
  highFilter: number | null;
}

export interface Effect {
  type: EffectType;
  id: string;
  params: EffectParams;
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
    setEffects: (state, action: PayloadAction<Effect[]>) => ({
      ...state,
      effects: action.payload
    }),
    setEffectParams: (state, action: PayloadAction<{ id: string, params: EffectParams }>) => ({
      ...state,
      effects: state.effects.map(e => ({ ...e, params: e.id === action.payload.id ? action.payload.params : e.params }))
    }),
    setIsEffectMuted: (state, action: PayloadAction<{ id: string, isMuted : boolean }>) => ({
      ...state,
      effects: state.effects.map(e => ({ ...e, isMuted: e.id === action.payload.id ? action.payload.isMuted : e.isMuted }))
    }),
    toggleIsEffectMuted: (state, action: PayloadAction<{ id: string }>) => ({
      ...state,
      effects: state.effects.map(e => ({ ...e, isMuted: e.id === action.payload.id ? !e.isMuted : e.isMuted }))
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
export const { setEffects, setIsEffectMuted, toggleIsEffectMuted, addEffect, setEffectParams, removeEffect } = effectsSlice.actions;
