import NoteGrid from './components/NoteGrid/NoteGrid';
import NoteManager from './components/NoteManager/NoteManager';

import './DrawableField.scss';

interface DrawableFieldProps {
  className?: string;
}

const DrawableField = ({ className = '' }: DrawableFieldProps) => {
  return (
    <div className={`drawable-field ${className}`}>
      <NoteGrid />
      <NoteManager />
    </div>
  );
};

export default DrawableField;
