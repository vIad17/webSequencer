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

export interface EffectParamsData {
  id: string;
  params: EffectParams;
}

export interface EffectsState {
  effects: EffectParamsData[];
}

const initialState: EffectsState = {
  effects: []
};

export const effectsParamsSlice = createSlice({
  name: 'effectsParams',
  initialState,
  reducers: {
    setEffectsParams: (state, action: PayloadAction<EffectParamsData[]>) => {
      state.effects = action.payload
    },    
    setEffectParams: (state, action: PayloadAction<EffectParamsData>) => {
      const effect = state.effects.find(e => e.id === action.payload.id);
      if (effect) {
        effect.params = action.payload.params;
      } else {
        state.effects.push(action.payload);
      }
    },
    removeEffectParam: (state, action: PayloadAction<string>) => {
      state.effects = state.effects.filter(e => e.id !== action.payload);
    },
  }
});

export const { setEffectsParams, setEffectParams, removeEffectParam } = effectsParamsSlice.actions;
