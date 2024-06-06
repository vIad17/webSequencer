import { useState } from 'react';
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

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [myBpm, setMyBpm] = useState(120);
  const [myTacts, setMyTacts] = useState(8);

  const settings = useSelector((state: RootState) => state.settings);

  console.log(settings);

  const dispatch = useDispatch();

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
          dispatch(setBpm(myBpm));
        }}
      >
        bpm
        <input
          className="header__input"
          type="text"
          defaultValue={settings.bpm}
          onChange={(event) => {
            if (Number(event.target.value)) {
              setMyBpm(Number(event.target.value));
            }
          }}
        />
      </form>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch(setTacts(myTacts));
          dispatch(setColumnsCount(myTacts * 16));
        }}
      >
        tacts
        <input
          className="header__input"
          type="text"
          defaultValue={settings.tacts}
          onChange={(event) => {
            if (Number(event.target.value)) {
              setMyTacts(Number(event.target.value));
            }
          }}
        />
      </form>
    </header>
  );
};

export default Header;
