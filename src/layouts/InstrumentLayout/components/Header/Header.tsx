import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Tone from 'tone';

import { setIsPlaying } from 'src/shared/redux/slices/currentMusicSlice';
import { setColumnsCount } from 'src/shared/redux/slices/drawableFieldSlice';
import { setBpm, setTacts } from 'src/shared/redux/slices/settingsSlice';
import { RootState } from 'src/shared/redux/store/store';

// import pauseIcon from './images/pause_icon.png';
// import startIcom from './images/play_icon.png';
// import stopIcon from './images/stop_icon.png';
import startIcon from './images/playIcon.svg';
import stopIcon from './images/stopIcon.svg';
import pauseIcon from './images/pauseIcon.svg';

import './Header.scss';
import { pauseMusic, stopMusic, openMIDI } from 'src/app/SoundManager';
import Modal, { ModalItem } from 'src/components/Modal/Modal';
import { useHandleClickOutside } from 'src/shared/hooks/useHandleClickOutside';
import clsx from 'clsx';

interface HeaderProps {
  className?: string;
}


const Header = ({ className = '' }: HeaderProps) => {
  const [myBpm, setMyBpm] = useState(120);
  const [myTacts, setMyTacts] = useState(8);
  const [fileOpen, setFileOpen] = useState(false);

  const { modalRef } = useHandleClickOutside(() => setFileOpen(false));

  const settings = useSelector((state: RootState) => state.settings);

  const handleButtonClick = () => {
    document.getElementById('import-midi-file-input')?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
  
      reader.onload = (loadEvent) => {
        const arrayBuffer = loadEvent.target?.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          openMIDI(arrayBuffer);
          setFileOpen(false)
        }
      };
  
      reader.onerror = () => {
        console.error('Error reading MIDI file');
      };
  
      reader.readAsArrayBuffer(file);
    }
  };

  const FileData: ModalItem[] = [
    {
      text: 'Import MIDI File',
      callback: handleButtonClick,
      sideContent: (
        <input
          type="file"
          id="import-midi-file-input"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      )
    },
    {
      text: 'Autosave',
      callback: () => {}
    }
  ];

  const dispatch = useDispatch();

  return (
    <header className={`header ${className}`}>
      <div className="header__left">
        <div ref={modalRef}  className="header__left-item">
          <button
            className={clsx('header__left-button', {
              'header__left-button_active': fileOpen
            })}
            onClick={() => setFileOpen((prev) => !prev)}
          >
            File
          </button>
          <Modal
            className={clsx('header__left-button-modal')}
            modalActions={FileData}
            isOpen={fileOpen}
            setIsOpen={setFileOpen}
          />
        </div>
      </div>

      <div className="header__center">
        {(!!settings.bpm || !!settings.tacts) && (
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
                src={startIcon}
                alt="start"
              />
            </button>
            <button className="header__button" onClick={pauseMusic}>
              <img
                className="header__icon header__icon-pause"
                src={pauseIcon}
                alt="pause"
              />
            </button>
            <button className="header__button" onClick={stopMusic}>
              <img
                className="header__icon header__icon_stop"
                src={stopIcon}
                alt="stop"
              />
            </button>
          </div>
        )}

        <div className="header__inputs">
          {!!settings.bpm && (
            <form
              className="header__input-form"
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
          )}

          {!!settings.tacts && (
            <form
              className="header__input-form"
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
          )}
        </div>
      </div>

      <div className="header__right"></div>
    </header>
  );
};

export default Header;
