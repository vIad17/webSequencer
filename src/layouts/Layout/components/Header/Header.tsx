import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Tone from 'tone';

import {
  setCurrentBit,
  setIsPlaying
} from 'src/shared/redux/slices/currentMusicSlice';
import { setColumnsCount } from 'src/shared/redux/slices/drawableFieldSlice';
import { setBpm, setTacts } from 'src/shared/redux/slices/settingsSlice';
import { RootState } from 'src/shared/redux/store/store';

import pauseIcon from './images/pause_icon.png';
import startIcom from './images/play_icon.png';
import stopIcon from './images/stop_icon.png';

import './Header.scss';
import { useSearchParams } from 'react-router-dom';
import { decompress } from 'src/shared/functions/compress';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [searchParams] = useSearchParams();
  const param = searchParams.get('settings');

  const obj = JSON.parse(decompress(param || '{}'));

  const [myBpm, setMyBpm] = useState(obj.bpm || 120);
  const [myTacts, setMyTacts] = useState(obj.tacts || 8);

  const dispatch = useDispatch();

  const handleChange = (
    event: ChangeEvent<HTMLFormElement | HTMLInputElement>,
    func: (arg1: number) => void
  ) => {
    const inputValue = event.target.value.replace(/\s/g, '');
    if (isNaN(inputValue)) {
      return;
    }

    func(inputValue);
  };

  return (
    <header className={`header ${className}`}>
      <div className="header__buttons">
        <button
          className="header__button"
          onClick={() => {
            if (Tone.context.state === 'suspended') {
              Tone.context.resume();
            }
            Tone.Transport.start();
            dispatch(setIsPlaying(true));
          }}
        >
          <img
            className="header__icon header__icon-start"
            src={startIcom}
            alt="start"
          />
        </button>

        <button
          className="header__button"
          onClick={() => {
            Tone.Transport.pause();
            dispatch(setIsPlaying(false));
          }}
        >
          <img
            className="header__icon header__icon-pause"
            src={pauseIcon}
            alt="pause"
          />
        </button>

        <button
          className="header__button"
          onClick={() => {
            dispatch(setCurrentBit(0));
            dispatch(setIsPlaying(false));
            Tone.Transport.stop();
          }}
        >
          <img
            className="header__icon header__icon_stop"
            src={stopIcon}
            alt="stop"
          />
        </button>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const newBpm = Number(myBpm) || 120;
          setMyBpm(newBpm);
          dispatch(setBpm(newBpm));
        }}
      >
        bpm
        <input
          className="header__input"
          type="text"
          value={myBpm}
          onChange={(e) => {
            handleChange(e, setMyBpm);
          }}
        />
      </form>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const newTact = Number(myTacts) || 4;
          setMyTacts(newTact);
          dispatch(setTacts(newTact));
          dispatch(setColumnsCount(newTact * 16));
        }}
      >
        tacts
        <input
          className="header__input"
          type="text"
          value={myTacts}
          onChange={(e) => {
            handleChange(e, setMyTacts);
          }}
        />
      </form>
    </header>
  );
};

export default Header;
