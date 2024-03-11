import { configureStore } from '@reduxjs/toolkit';

import { bitSlice } from 'src/shared/redux/slices/bitSlice';
import { melodyArraySlice } from 'src/shared/redux/slices/melodyArraySlice';
import { notesArraySlice } from 'src/shared/redux/slices/notesArraySlice';
import { settingsSlice } from 'src/shared/redux/slices/settingsSlice';
import { soundSettingsSlice } from 'src/shared/redux/slices/soundSettingsSlice';

import { drawableFieldSlice } from '../slices/drawableFieldSlice';

const store = configureStore({
  reducer: {
    [settingsSlice.name]: settingsSlice.reducer,
    [soundSettingsSlice.name]: soundSettingsSlice.reducer,
    [melodyArraySlice.name]: melodyArraySlice.reducer,
    [bitSlice.name]: bitSlice.reducer,
    [notesArraySlice.name]: notesArraySlice.reducer,
    [drawableFieldSlice.name]: drawableFieldSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
