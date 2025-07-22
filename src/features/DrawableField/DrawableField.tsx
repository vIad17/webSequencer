import TimeStripe from 'src/components/TimeStripe/TimeStripe';
import NoteGrid from './components/NoteGrid/NoteGrid';
import NoteManager from './components/NoteManager/NoteManager';

import './DrawableField.scss';

interface DrawableFieldProps {
  className?: string;
  isPreview?: boolean;
}

const DrawableField = ({ className = '', isPreview = false }: DrawableFieldProps) => {
  return (
    <div className={`drawable-field ${className}`}>
      <NoteManager className="drawable-field__note-manager" isEditable={!isPreview}/>
      {!isPreview && <TimeStripe className="drawable-field__time-stripe" />}
      <NoteGrid className="drawable-field__note-grid" />
    </div>
  );
};

export default DrawableField;
