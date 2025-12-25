import { configureStore } from '@reduxjs/toolkit';

import { copiedObjectsSlise } from 'src/shared/redux/slices/copiedObjectsSlise';
import { currentMusicSlice } from 'src/shared/redux/slices/currentMusicSlice';
import { drawableFieldSlice } from 'src/shared/redux/slices/drawableFieldSlice';
import { melodyArraySlice } from 'src/shared/redux/slices/melodyArraySlice';
import { notesArraySlice } from 'src/shared/redux/slices/notesArraySlice';
import { progressSlice } from 'src/shared/redux/slices/progressSlice';
import { projectLinkSlice } from 'src/shared/redux/slices/projectLinkSlice';
import { projectNameSlice } from 'src/shared/redux/slices/projectNameSlice';
import { projectUserIdSlice } from 'src/shared/redux/slices/projectUserIdSlice';
import { settingsSlice } from 'src/shared/redux/slices/settingsSlice';
import { soundSettingsSlice } from 'src/shared/redux/slices/soundSettingsSlice';
import { userSlice } from 'src/shared/redux/slices/userSlice';

const store = configureStore({
  reducer: {
    [settingsSlice.name]: settingsSlice.reducer,
    [soundSettingsSlice.name]: soundSettingsSlice.reducer,
    [melodyArraySlice.name]: melodyArraySlice.reducer,
    [currentMusicSlice.name]: currentMusicSlice.reducer,
    [notesArraySlice.name]: notesArraySlice.reducer,
    [drawableFieldSlice.name]: drawableFieldSlice.reducer,
    [copiedObjectsSlise.name]: copiedObjectsSlise.reducer,
    [progressSlice.name]: progressSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [projectNameSlice.name]: projectNameSlice.reducer,
    [projectLinkSlice.name]: projectLinkSlice.reducer,
    [projectUserIdSlice.name]: projectUserIdSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type SequencerDispatch = typeof store.dispatch;

export default store;
