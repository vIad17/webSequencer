import clsx from 'clsx';
import './ProgressModal.scss'; // Reusing the same SCSS
import { FormEvent, useState } from 'react';
import { exportMp3 } from 'src/app/SoundManager';
import { useSelector } from 'react-redux';
import { RootState } from 'src/shared/redux/store/store';

interface ProgressModalProps {
  className?: string;
  // isOpen: boolean;
  // progress: number; // Value from 0 to 100
  // currentStep: string; // e.g., "Encoding audio...", "Finalizing file..."
}

const ProgressModal = ({ className = '' }: ProgressModalProps) => {
  const progressSelector = useSelector((state: RootState) => state.progress);

  if (!progressSelector?.currentStep || progressSelector.progress === null)
    return null;
  
  return (
    <div className="modal-overlay" onClick={() => {}}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">Exporting MP3</div>
        <div className="modal__body">
          <div className="modal__progress-label">
            {progressSelector.currentStep}
          </div>
          <div className="modal__progress-bar-outer">
            <div
              className="modal__progress-bar-inner"
              style={{ width: `${progressSelector.progress}%` }}
            />
          </div>
          <div className="modal__progress-percent">
            {Math.round(progressSelector.progress)}%
          </div>
        </div>
        <div className="modal__footer">
          <small>Please wait...</small>
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
