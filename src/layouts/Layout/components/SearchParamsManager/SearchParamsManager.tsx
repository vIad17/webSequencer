import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { compress, decompress } from 'src/shared/functions/compress';
import { setNotes } from 'src/shared/redux/slices/notesArraySlice';
import { setSettings } from 'src/shared/redux/slices/settingsSlice';
import { setSoundSettings } from 'src/shared/redux/slices/soundSettingsSlice';
import { RootState } from 'src/shared/redux/store/store';

const SearchParamsManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageIsStarted, setPageIsStarted] = useState(true);

  const dispatch = useDispatch();

  function setParam(param: object) {
    setSearchParams({ ...Object.fromEntries(searchParams), ...param });
  }

  // console.log({...Object.fromEntries(searchParams)});

  const soundSettings = useSelector((state: RootState) => state.soundSettings);
  const settings = useSelector((state: RootState) => state.settings);
  const notesArray = useSelector(
    (state: RootState) => state.notesArray.notesArray
  );

  const searchParam = searchParams.get('params');
  const searchSettings = searchParams.get('settings');
  const searchSoundSettings = searchParams.get('soundSettings');
  const searchNotesArray = searchParams.get('notesArray');
  
  // console.log("AAAAAAAAAAAAAAAA", JSON.parse(decompress(searchNotesArray)));
  useEffect(() => {
    if (pageIsStarted) {
      // const obj = JSON.parse(decompress(searchParam));
      searchSettings && dispatch(setSettings(JSON.parse(decompress(searchSettings))));
      searchSoundSettings && dispatch(setSoundSettings(JSON.parse(decompress(searchSoundSettings))));
      searchNotesArray  && dispatch(setNotes(JSON.parse(decompress(searchNotesArray))));
    }
    setPageIsStarted(false);
  }, []);

  // useEffect(() => {
  //   const obj = { notesArray, settings, soundSettings };
  //   !pageIsStarted && setSearchParams({params: compress(obj)});
  // }, [notesArray, settings, soundSettings]);


  useEffect(() =>{
    !pageIsStarted && setParam({settings: compress(settings)});
  }, [settings]);

  useEffect(() =>{
    !pageIsStarted && setParam({soundSettings: compress(soundSettings)});
  }, [soundSettings]);

  useEffect(() =>{
    !pageIsStarted && setParam({notesArray: compress(notesArray)});
  }, [notesArray]);

  return <></>;
};

export default SearchParamsManager;
