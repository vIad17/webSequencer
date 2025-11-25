import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import $api from 'src/shared/api/axiosConfig';

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

const DEFAULT_MAIN_SETTINGS = { bpm: 120, tacts: 8 };

const SearchParamsManager = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageIsStarted, setPageIsStarted] = useState(true);

  const dispatch = useDispatch();

  const soundSettings = useSelector((state: RootState) => state.soundSettings);
  const settings = useSelector((state: RootState) => state.settings);
  const notesArray = useSelector(
    (state: RootState) => state.notesArray.notesArray
  );

  async function getProjectById(id: string) {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const { data } = await axios.get(`/projects/${id}`);
        return data.link;
      }
    } else {
      const { data } = await $api.get(`/projects/${id}`);
      return data.link;
    }
  }

  async function updateLink(link: string) {
    if (import.meta.env.VITE_USE_MOCKS === 'true') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await axios.put(`/projects/${id}`, {
          link
        });
      }
    } else {
      await $api.put(`/projects/${id}`, {
        link
      });
    }
  }

  useEffect(() => {
    if (!pageIsStarted) return;

    const loadFromObject = (obj: any) => {
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
          const projectLink = await getProjectById(id);
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

    initializePage();
  }, [pageIsStarted, id, searchParams, dispatch]);

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
      updateLink(compressed);
    } else {
      setSearchParams('params=' + compressed);
    }
  }, [notesArray, settings, soundSettings]);

  return <></>;
};

export default SearchParamsManager;
