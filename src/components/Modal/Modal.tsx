import clsx from 'clsx';
import { useHandleClickOutside } from 'src/shared/hooks/useHandleClickOutside';
import './Modal.scss';
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

const Modal = ({ className = '', modalActions = [], isOpen }: NoteProps) => {
  return (
    isOpen && (
      <div className={clsx('modal', className)}>
        {modalActions.map((el) => (
          <button className={clsx('modal__item')} onClick={el.callback}>
            <p className="modal__text">{el.text}</p>
            <div className="modal__side-content">{el.sideContent}</div>
          </button>
        ))}
      </div>
    )
  );
};

export default Modal;
