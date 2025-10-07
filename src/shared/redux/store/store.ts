import { configureStore } from '@reduxjs/toolkit';

import { currentMusicSlice } from '../slices/currentMusicSlice';
import { melodyArraySlice } from '../slices/melodyArraySlice';
import { notesArraySlice } from '../slices/notesArraySlice';
import { settingsSlice } from '../slices/settingsSlice';
import { soundSettingsSlice } from 'src/shared/redux/slices/soundSettingsSlice';
import { drawableFieldSlice } from '../slices/drawableFieldSlice';
import { copiedObjectsSlise } from '../slices/copiedObjectsSlise';
import { progressSlice } from '../slices/progressSlice';

const store = configureStore({
  reducer: {
    [settingsSlice.name]: settingsSlice.reducer,
    [soundSettingsSlice.name]: soundSettingsSlice.reducer,
    [melodyArraySlice.name]: melodyArraySlice.reducer,
    [currentMusicSlice.name]: currentMusicSlice.reducer,
    [notesArraySlice.name]: notesArraySlice.reducer,
    [drawableFieldSlice.name]: drawableFieldSlice.reducer,
    [copiedObjectsSlise.name]: copiedObjectsSlise.reducer,
    [progressSlice.name]: progressSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
