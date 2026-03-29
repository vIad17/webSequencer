import clsx from 'clsx';
import './FileModal.scss';
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

const FileModal = ({ className = '', modalActions = [], isOpen }: NoteProps) => {
  return (
    isOpen && (
      <div className={clsx('file-modal', className)}>
        {modalActions.map((el) => (
          <button className={clsx('file-modal__item')} onClick={el.callback}>
            <p className="file-modal__text">{el.text}</p>
            <div className="file-modal__side-content">{el.sideContent}</div>
          </button>
        ))}
      </div>
    )
  );
};

export default FileModal;
