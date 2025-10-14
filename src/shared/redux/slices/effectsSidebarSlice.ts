import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EffectsSidebarState {
  isOpen: boolean;
}

const initialState: EffectsSidebarState = {
  isOpen: false
};

export const effectsSidebarSlice = createSlice({
  name: 'effectsSidebar',
  initialState,
  reducers: {
    setIsSidebarOpen: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isOpen: action.payload
    }),
  }
});
export const { setIsSidebarOpen } = effectsSidebarSlice.actions;
