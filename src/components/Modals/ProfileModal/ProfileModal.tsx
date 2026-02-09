import clsx from 'clsx';
import './ProfileModal.scss';
import { MouseEventHandler, ReactNode } from 'react';

export interface ModalItem {
  text: string;
  callback: MouseEventHandler<HTMLButtonElement>;
  sideContent?: ReactNode;
}

interface NoteProps {
  className?: string;
  modalActions?: ModalItem[];
  isOpen: boolean;
}

const ProfileModal = ({
  className = '',
  modalActions = [],
  isOpen
}: NoteProps) => {
  return (
    isOpen && (
      <div className={clsx('profile-modal', className)}>
        {modalActions.map((el) => (
          <button className={clsx('profile-modal__item')} onClick={el.callback}>
            <p className="profile-modal__text">{el.text}</p>
            <div className="profile-modal__side-content">{el.sideContent}</div>
          </button>
        ))}
      </div>
    )
  );
};

export default ProfileModal;
