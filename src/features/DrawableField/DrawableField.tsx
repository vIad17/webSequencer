import TimeStripe from 'src/components/TimeStripe/TimeStripe';
import NoteGrid from './components/NoteGrid/NoteGrid';
import NoteManager from './components/NoteManager/NoteManager';

import './DrawableField.scss';

interface DrawableFieldProps {
  className?: string;
}

const DrawableField = ({ className = '' }: DrawableFieldProps) => {
  return (
    <div className={`drawable-field ${className}`}>
      <TimeStripe className="drawable-field__time-stripe" />
      <NoteGrid className="drawable-field__note-grid"/>
      <NoteManager className="drawable-field__note-manager"/>
    </div>
  );
};

export default DrawableField;
