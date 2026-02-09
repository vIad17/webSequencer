import { configureStore } from '@reduxjs/toolkit';

import { currentMusicSlice } from 'src/shared/redux/slices/currentMusicSlice';
import { melodyArraySlice } from 'src/shared/redux/slices/melodyArraySlice';
import { notesArraySlice } from 'src/shared/redux/slices/notesArraySlice';
import { settingsSlice } from 'src/shared/redux/slices/settingsSlice';
import { soundSettingsSlice } from 'src/shared/redux/slices/soundSettingsSlice';
import { drawableFieldSlice } from '../slices/drawableFieldSlice';
import { copiedObjectsSlise } from '../slices/copiedObjectsSlise';
import { effectsSidebarSlice } from '../slices/effectsSidebarSlice';
import { effectsSlice } from '../slices/effectsSlice';

const store = configureStore({
  reducer: {
    [settingsSlice.name]: settingsSlice.reducer,
    [soundSettingsSlice.name]: soundSettingsSlice.reducer,
    [melodyArraySlice.name]: melodyArraySlice.reducer,
    [currentMusicSlice.name]: currentMusicSlice.reducer,
    [notesArraySlice.name]: notesArraySlice.reducer,
    [drawableFieldSlice.name]: drawableFieldSlice.reducer,
    [copiedObjectsSlise.name]: copiedObjectsSlise.reducer,
    [effectsSidebarSlice.name]: effectsSidebarSlice.reducer,
    [effectsSlice.name]: effectsSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
