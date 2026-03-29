import clsx from 'clsx';
import './ExportModal.scss'; // Reusing the same SCSS
import { FormEvent, useState } from 'react';
import { exportMp3 } from 'src/app/SoundManager';

const DEFAULT_FILE_NAME = 'untitled'

interface ExportModalProps {
  className?: string;
  isOpen: boolean;
}

const ExportModal = ({
  className = '',
  isOpen,
}: ExportModalProps) => {
  const [fileName, setFileName] = useState(DEFAULT_FILE_NAME);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    exportMp3(); 
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => {}}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">Export MP3</div>
        <form onSubmit={handleSubmit} className="modal__body">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="modal__input"
            placeholder="Enter filename..."
            autoFocus
          />
        </form>
        <div className="modal__footer">
          <button
            type="button"
            className="modal__button modal__button_secondary"
            onClick={() => {}}
          >
            Cancel
          </button>
          <button
            type="submit"
            formNoValidate
            onClick={handleSubmit}
            className="modal__button modal__button_primary"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;