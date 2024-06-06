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
      dispatch(setSoundSettings(obj.soundSettings));
      dispatch(setSettings(obj.settings));
    }
    setPageIsStarted(false);
  }, []);

  // useEffect(() => {
  //   const param = searchParams.get('params');
  //   let count = 0;
  //   const a = setInterval(() => {
  //     console.log(count);
  //     count = 0;
  //   }, 1000);
  //   const aa = setInterval(() => {
  //     for (let i = 0; i < 150; i++) {
  //       decompress(param);
  //     }
  //     count++;
  //   }, 1);
  //   // while (true) {
  //   //   compress(obj);
  //   //   // count++;
  //   // }
  // }, []);

  useEffect(() => {
    const obj = { notesArray, settings, soundSettings };
    !pageIsStarted && setSearchParams('params=' + compress(obj));
  }, [notesArray, settings, soundSettings]);

  return <></>;
};

export default SearchParamsManager;
