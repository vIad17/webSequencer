import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { compress, decompress } from 'src/shared/functions/compress';
import { setNotes } from 'src/shared/redux/slices/notesArraySlice';
import { setSettings } from 'src/shared/redux/slices/settingsSlice';
import {
  setSoundSettings,
  SoundSettingsState
} from 'src/shared/redux/slices/soundSettingsSlice';
import { RootState } from 'src/shared/redux/store/store';

const INITIAL_SETTINGS: SoundSettingsState = {
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

const SearchParamsManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageIsStarted, setPageIsStarted] = useState(true);

  const dispatch = useDispatch();

  const soundSettings = useSelector((state: RootState) => state.soundSettings);
  const settings = useSelector((state: RootState) => state.settings);
  const notesArray = useSelector(
    (state: RootState) => state.notesArray.notesArray
  );

  useEffect(() => {
    const param = searchParams.get('params');
    if (!!param && pageIsStarted) {
      const obj = JSON.parse(decompress(param));
      dispatch(setNotes(obj.notesArray));
      dispatch(setSoundSettings(obj?.soundSettings ?? INITIAL_SETTINGS));
      dispatch(setSettings(obj?.settings ?? { bpm: 120, tacts: 8 }));
    } else if (pageIsStarted) {
      dispatch(setSoundSettings(INITIAL_SETTINGS));
      dispatch(setSettings({ bpm: 120, tacts: 8 }));
    }
    setPageIsStarted(false);
  }, []);

  useEffect(() => {
    const storedNotesArray = notesArray?.map((note) => ({
      note: note.note,
      attackTime: note.attackTime,
      duration: note.duration
    }));
    const obj = { notesArray: storedNotesArray, settings, soundSettings };
    !pageIsStarted && setSearchParams('params=' + compress(obj));
  }, [notesArray, settings, soundSettings]);

  return <></>;
};

export default SearchParamsManager;
