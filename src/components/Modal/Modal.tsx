import clsx from 'clsx'
import { useHandleClickOutside } from 'src/shared/hooks/useHandleClickOutside';;
import './Modal.scss';
import { ReactNode } from 'react';

export interface ModalItem {
  text: string;
  callback: () => void;
  sideContent?: ReactNode;
}

interface NoteProps {
  className?: string;
  modalActions?: ModalItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Modal = ({
  className = '',
  modalActions = [],
  isOpen,
  setIsOpen
}: NoteProps) => {
  // const { modalRef } = useHandleClickOutside(() => setIsOpen(false));
  return (
    isOpen && (
      <div className={clsx('modal', className)}>
        {modalActions.map((el) => (
          <button className={clsx("modal__item")} onClick={el.callback}>
            <p>{el.text}</p>
            {el.sideContent}
          </button>
        ))}
      </div>
    )
  );
};

export default Modal;
