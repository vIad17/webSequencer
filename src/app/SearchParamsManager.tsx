import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import $api from 'src/shared/api/axiosConfig';
import $mockApi from 'src/shared/api/axiosMockConfig';
import { compress, decompress } from 'src/shared/functions/compress';
import {
  NotesArrayState,
  setNotes
} from 'src/shared/redux/slices/notesArraySlice';
import {
  setSettings,
  SettingsState
} from 'src/shared/redux/slices/settingsSlice';
import {
  setSoundSettings,
  SoundSettingsState
} from 'src/shared/redux/slices/soundSettingsSlice';
import { RootState, SequencerDispatch } from 'src/shared/redux/store/store';
import { fetchProjectData } from 'src/shared/redux/thunks/projectThunks';

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

const DEFAULT_MAIN_SETTINGS = { bpm: 120, tacts: 8 };

interface LoadableData {
  notesArray?: NotesArrayState;
  soundSettings?: SoundSettingsState;
  settings?: SettingsState;
}

const SearchParamsManager = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageIsStarted, setPageIsStarted] = useState(true);

  const dispatch = useDispatch<SequencerDispatch>();

  const soundSettings = useSelector((state: RootState) => state.soundSettings);
  const settings = useSelector((state: RootState) => state.settings);
  const notesArray = useSelector(
    (state: RootState) => state.notesArray.notesArray
  );
  const { id: user_id } = useSelector((state: RootState) => state.user);
  const { link: projectLink, userId } = useSelector(
    (state: RootState) => state.project
  );

  async function updateLink(link: string) {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      await $mockApi.put(`/projects/${id}`, {
        link
      });
    } else {
      await $api.put(`/projects/${id}`, {
        link
      });
    }
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectData(id));
    }
  }, [dispatch, id]);

  const loadFromObject = (obj: LoadableData) => {
    const safeNotes = Array.isArray(obj?.notesArray) ? obj.notesArray : [];
    const safeSound = obj?.soundSettings ?? INITIAL_SETTINGS;
    const safeSettings = obj?.settings ?? DEFAULT_MAIN_SETTINGS;

    dispatch(setNotes(safeNotes));
    dispatch(setSoundSettings(safeSound));
    dispatch(setSettings(safeSettings));
  };

  const initializePage = async () => {
    try {
      if (id) {
        if (projectLink) {
          const obj = JSON.parse(decompress(decodeURIComponent(projectLink)));
          loadFromObject(obj);
        } else {
          dispatch(setSoundSettings(INITIAL_SETTINGS));
          dispatch(setSettings(DEFAULT_MAIN_SETTINGS));
        }
      } else {
        const param = searchParams.get('params');
        if (param) {
          const obj = JSON.parse(decompress(param));
          loadFromObject(obj);
        } else {
          dispatch(setSoundSettings(INITIAL_SETTINGS));
          dispatch(setSettings(DEFAULT_MAIN_SETTINGS));
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
      dispatch(setSoundSettings(INITIAL_SETTINGS));
      dispatch(setSettings(DEFAULT_MAIN_SETTINGS));
    } finally {
      setPageIsStarted(false);
    }
  };

  useEffect(() => {
    if (!pageIsStarted) return;

    if (id && projectLink === null) return;

    initializePage();
  }, [pageIsStarted, id, searchParams, projectLink]);

  useEffect(() => {
    if (pageIsStarted) return;

    const storedNotesArray = Array.isArray(notesArray)
      ? notesArray.map((note) => ({
          note: note.note,
          attackTime: note.attackTime,
          duration: note.duration
        }))
      : [];

    const obj = { notesArray: storedNotesArray, settings, soundSettings };
    const compressed = compress(obj);

    if (id) {
      try {
        if (user_id !== userId) {
          console.error('У вас нет прав изменять этот проект');
          return;
        }

        updateLink(compressed);
      } catch (e) {
        if (e.response?.status === 403) {
          console.error('Нет прав (403 Forbidden)');
          return;
        }

        console.error('Ошибка при обновлении ссылки');
      }
    } else {
      setSearchParams('params=' + compressed);
    }
  }, [notesArray, settings, soundSettings]);

  return <></>;
};

export default SearchParamsManager;
