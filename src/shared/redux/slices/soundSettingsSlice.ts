import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';

interface SoundSettingsState {
  volume: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  tremoloFrequency: number;
  tremoloDepth: number;
  delayTime: number;
  feedback: number;
  distortion: number;
  bits: number;
  pitchShift: number;
  lowFilter: number;
  highFilter: number;
  wave: NonCustomOscillatorType;
}

const initialState: SoundSettingsState = {
  volume: 0,
  attack: 0,
  decay: 0,
  sustain: 1,
  release: 0,
  tremoloFrequency: 0,
  tremoloDepth: 0,
  delayTime: 0,
  feedback: 0,
  distortion: 0,
  bits: 16,
  pitchShift: 0,
  lowFilter: 20,
  highFilter: 8000,
  wave: 'sine'
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
