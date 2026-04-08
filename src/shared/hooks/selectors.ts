import { RootState } from "../redux/store/store";

export const selectEffectById = (state: RootState, id: string) => 
  state.effects.effects.find(el => el.id === id);

export const selectEffectParamsById = (state: RootState, id: string) => 
  state.effectsParams.effects.find(el => el.id === id);