import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { AxiosError } from 'axios';

import { apiClient } from 'src/shared/api/apiClient';
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
import {
  fetchProjectLink,
  fetchProjectUserId
} from 'src/shared/redux/thunks/projectThunks';

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
  const userId = useSelector((state: RootState) => state.user.id);
  const { link: projectLink } = useSelector(
    (state: RootState) => state.projectLink
  );

  const projectUserId = useSelector((state: RootState) => state.projectUserId.userId);
  const isDragging = useSelector((state: RootState) => state.user.isDragging);
  
  async function updateLink(link: string) {
    await apiClient.put(`/projects/${id}`, {
      link
    });
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectLink(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectUserId(id));
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
    if (isDragging) return;

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
        if (userId !== projectUserId) {
          console.error("You haven't permissions to modify the project");
          return;
        }

        updateLink(compressed);
      } catch (e: unknown) {
        const error = e as AxiosError;
        if (error.response?.status === 403) {
          console.error('No permissions (403 Forbidden)');
          return;
        }

        console.error('Error for updating link');
      }
    } else {
      setSearchParams('params=' + compressed);
    }
  }, [isDragging, notesArray, settings, soundSettings]);

  return <></>;
};

export default SearchParamsManager;
