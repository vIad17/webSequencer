import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Tone from 'tone';

import { setIsPlaying } from 'src/shared/redux/slices/currentMusicSlice';
import { setColumnsCount } from 'src/shared/redux/slices/drawableFieldSlice';
import { setBpm, setTacts } from 'src/shared/redux/slices/settingsSlice';
import { RootState } from 'src/shared/redux/store/store';

import arrowRightIcon from './images/arrowRightIcon.svg';
import checkIcon from './images/checkIcon.svg';

import './Header.scss';
import {
  pauseMusic,
  stopMusic,
  openMIDI,
  exportMp3
} from 'src/app/SoundManager';
import { useHandleClickOutside } from 'src/shared/hooks/useHandleClickOutside';
import clsx from 'clsx';

import { useMIDIInputs } from '@react-midi/hooks';
import { Icon } from 'src/shared/icons/Icon';
import { IconType } from 'src/shared/icons/IconMap';
import ProgressModal from 'src/components/Modals/ProgressModal/ProgressModal';
import FileModal, { ModalItem } from 'src/components/Modals/FileModal/FileModal';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [myBpm, setMyBpm] = useState(120);
  const [myTacts, setMyTacts] = useState(8);
  const [fileOpen, setFileOpen] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);

  const { modalRef } = useHandleClickOutside(() => {
    setFileOpen(false);
    setInputModalOpen(false);
  });

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
          setFileOpen(false);
        }
      };

      reader.onerror = () => {
        console.error('Error reading MIDI file');
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const { input, inputs, selectInput, selectedInputId } = useMIDIInputs();

  useEffect(() => {
    const midiInput = localStorage.getItem('midi-input');
    midiInput && selectInput(midiInput);
  }, [selectInput]);

  const midiDeviceModalData: ModalItem[] = inputs.map((el) => ({
    text: el.name,
    callback: (event) => {
      event.stopPropagation();
      localStorage.setItem('midi-input', el.id);
      selectInput(el.id);
    },
    sideContent: (
      <Icon
        icon={IconType.Check}
        className={clsx('modal__side-icon', 'modal__check-icon', {
          'modal__side-icon_hidden': selectedInputId !== el.id
        })}
      />
    )
  }));

  const FileData: ModalItem[] = [
    { text: 'Export to mp3', callback: exportMp3 },
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
    // {
    //   text: 'Autosave',
    //   callback: () => { }
    // },
    {
      text: 'MIDI input',
      callback: () => {
        setInputModalOpen((prev) => !prev);
      },
      sideContent: (
        <>
          <Icon icon={IconType.ChevronRight} className="modal__side-icon" />
          <FileModal
            className={clsx(
              'header__inputs-left-button-sub-modal',
              'header__left-button-sub-modal'
            )}
            modalActions={midiDeviceModalData}
            isOpen={inputModalOpen}
          />
        </>
      )
    }
  ];

  const dispatch = useDispatch();

  return (
    <>
      <ProgressModal />
      <header className={`header ${className}`}>
        <div className="header__left">
          <div ref={modalRef} className="header__left-item">
            <button
              className={clsx('header__left-button', {
                'header__left-button_active': fileOpen
              })}
              onClick={() => {
                setFileOpen((prev) => !prev);
                setInputModalOpen(false);
              }}
            >
              File
            </button>
            <FileModal
              className={clsx('header__left-button-modal')}
              modalActions={FileData}
              isOpen={fileOpen}
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
                <Icon
                  icon={IconType.Play}
                  interactable
                  className="header__icon header__icon-start"
                />
              </button>
              <button className="header__button" onClick={pauseMusic}>
                <Icon
                  icon={IconType.Pause}
                  interactable
                  className="header__icon header__icon-pause"
                />
              </button>
              <button className="header__button" onClick={stopMusic}>
                <Icon
                  icon={IconType.Repeat}
                  interactable
                  className="header__icon header__icon_stop"
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
    </>
  );
};

export default Header;
