import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useMIDIInputs } from '@react-midi/hooks';
import clsx from 'clsx';
import FileModal, {
  ModalItem
} from 'src/components/Modals/FileModal/FileModal';
import ProfileModal from 'src/components/Modals/ProfileModal/ProfileModal';
import ProgressModal from 'src/components/Modals/ProgressModal/ProgressModal';
import * as Tone from 'tone';

import {
  exportMp3,
  openMIDI,
  pauseMusic,
  stopMusic
} from 'src/app/SoundManager';
import $api from 'src/shared/api/axiosConfig';
import { useHandleClickOutside } from 'src/shared/hooks/useHandleClickOutside';
import { Icon } from 'src/shared/icons/Icon';
import { IconType } from 'src/shared/icons/IconMap';
import avatar from 'src/shared/icons/svg/avatar.svg';
import { setIsPlaying } from 'src/shared/redux/slices/currentMusicSlice';
import { setColumnsCount } from 'src/shared/redux/slices/drawableFieldSlice';
import { setBpm, setTacts } from 'src/shared/redux/slices/settingsSlice';
import { RootState, SequencerDispatch } from 'src/shared/redux/store/store';
import { fetchUserData } from 'src/shared/redux/thunks/userThunks';
import Button from 'src/shared/ui/Button/Button';

import './Header.scss';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [myBpm, setMyBpm] = useState(120);
  const [myTacts, setMyTacts] = useState(8);
  const [fileOpen, setFileOpen] = useState(false);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const { modalRef: fileModalRef } = useHandleClickOutside(() => {
    setFileOpen(false);
    setInputModalOpen(false);
  });

  const { modalRef: profileModalRef } = useHandleClickOutside(() => {
    setProfileDropdown(false);
  });

  const dispatch = useDispatch<SequencerDispatch>();
  const settings = useSelector((state: RootState) => state.settings);
  const { username, isLoading, error } = useSelector(
    (state: RootState) => state.user
  );

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
    dispatch(fetchUserData());
  }, [dispatch]);

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

  const ProfileData: ModalItem[] = [
    {
      text: 'Profile',
      callback: () => {
        window.location.href = '/main/myprojects';
      }
    },
    {
      text: 'Log out',
      callback: () => {
        $api.post('/logout');
        localStorage.clear();
      }
    }
  ];

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <>
      <ProgressModal />
      <header className={`header ${className}`}>
        <div className="header__left">
          <div ref={fileModalRef} className="header__left-item">
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
          {!!settings.bpm || !!settings.tacts ? (
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
          ) : null}

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

        <div className="header__right" ref={profileModalRef}>
          {localStorage.getItem('accessToken') && username ? (
            <>
              <button
                className="header__right_profile"
                onClick={() => setProfileDropdown(!profileDropdown)}
              >
                <img
                  className="header__right_avatar"
                  src={avatar}
                  alt="avatar"
                />
                <h2 className="header__right_username">{username}</h2>
              </button>
              <ProfileModal
                className={clsx('header__right-button-modal')}
                modalActions={ProfileData}
                isOpen={profileDropdown}
              />
            </>
          ) : (
            <>
              <Button type="header__right_login">
                <a href="/login">Log in</a>
              </Button>
              <Button type="header__right_signup">
                <a href="/register">Sign up</a>
              </Button>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
