import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';

export interface SoundSettingsState {
  volume: number | null;
  attack: number | null;
  decay: number | null;
  sustain: number | null;
  release: number | null;
  tremoloFrequency: number | null;
  tremoloDepth: number | null;
  delayTime: number | null;
  feedback: number | null;
  distortion: number | null;
  bits: number | null;
  pitchShift: number | null;
  lowFilter: number | null;
  highFilter: number | null;
  wave: NonCustomOscillatorType | null;
}

const initialState: SoundSettingsState = {
  volume: null,
  attack: null,
  decay: null,
  sustain: null,
  release: null,
  tremoloFrequency: null,
  tremoloDepth: null,
  delayTime: null,
  feedback: null,
  distortion: null,
  bits: null,
  pitchShift: null,
  lowFilter: null,
  highFilter: null,
  wave: null
};

export const soundSettingsSlice = createSlice({
  name: 'soundSettings',
  initialState,
  reducers: {
    setSoundSettings: (state, action: PayloadAction<SoundSettingsState>) => ({
      ...state,
      ...action.payload
    }),
    setVolume: (state, action: PayloadAction<number>) => ({
      ...state,
      volume: action.payload
    }),
    setAttack: (state, action: PayloadAction<number>) => ({
      ...state,
      attack: action.payload
    }),
    setDecay: (state, action: PayloadAction<number>) => ({
      ...state,
      decay: action.payload
    }),
    setSustain: (state, action: PayloadAction<number>) => ({
      ...state,
      sustain: action.payload
    }),
    setRelease: (state, action: PayloadAction<number>) => ({
      ...state,
      release: action.payload
    }),
    setTremoloFrequency: (state, action: PayloadAction<number>) => ({
      ...state,
      tremoloFrequency: action.payload
    }),
    setTremoloDepth: (state, action: PayloadAction<number>) => ({
      ...state,
      tremoloDepth: action.payload
    }),
    setDelayTime: (state, action: PayloadAction<number>) => ({
      ...state,
      delayTime: action.payload
    }),
    setFeedback: (state, action: PayloadAction<number>) => ({
      ...state,
      feedback: action.payload
    }),
    setDistortion: (state, action: PayloadAction<number>) => ({
      ...state,
      distortion: action.payload
    }),
    setBits: (state, action: PayloadAction<number>) => ({
      ...state,
      bits: action.payload
    }),
    setPitchShift: (state, action: PayloadAction<number>) => ({
      ...state,
      pitchShift: action.payload
    }),
    setWave: (state, action: PayloadAction<NonCustomOscillatorType>) => ({
      ...state,
      wave: action.payload
    }),
    setLowFilter: (state, action: PayloadAction<number>) => ({
      ...state,
      lowFilter: action.payload
    }),
    setHighFilter: (state, action: PayloadAction<number>) => ({
      ...state,
      highFilter: action.payload
    })
  }
});
export const {
  setSoundSettings,
  setVolume,
  setAttack,
  setDecay,
  setSustain,
  setRelease,
  setTremoloFrequency,
  setTremoloDepth,
  setDelayTime,
  setFeedback,
  setDistortion,
  setBits,
  setPitchShift,
  setWave,
  setLowFilter,
  setHighFilter
} = soundSettingsSlice.actions;
