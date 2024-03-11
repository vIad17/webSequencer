import { useSelector } from 'react-redux';

import { RootState } from 'src/shared/redux/store/store';

import './NoteNames.scss';

interface NoteNamesProps {
  className?: string;
}

const NoteNames = ({ className = '' }: NoteNamesProps) => {
  const drawableField = useSelector((state: RootState) => state.drawableField);
  const melodyArray = useSelector(
    (state: RootState) => state.melodyArray.melodyArray
  );

  return (
    <div className={`note-names ${className}`}>
      {Object.entries(melodyArray).map((element) => (
        <p
          className="note-names__element"
          key={element[0]}
          style={{ '--height': `${drawableField.elementHeight}px` }}
        >
          {element[0]}
        </p>
      ))}
    </div>
  );
};

export default NoteNames;
