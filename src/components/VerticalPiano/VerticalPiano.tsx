import { useDispatch, useSelector } from 'react-redux';

import { pitchNotes } from 'src/shared/const/notes';
import { setCurrentNote } from 'src/shared/redux/slices/notesArraySlice';
import { RootState } from 'src/shared/redux/store/store';

import './VerticalPiano.scss';

interface VerticalPianoProps {
  className?: string;
}

const VerticalPiano = ({ className = '' }: VerticalPianoProps) => {
  const elemHeight = useSelector(
    (state: RootState) => state.drawableField.elementHeight
  );
  const plaingNotes = useSelector(
    (state: RootState) => state.notesArray.playingNotes
  );

  
  const dispatch = useDispatch();
  
  const extraClassName = (note: string) => {
    const color = note.at(1) === '#' ? 'black' : 'white';
    const isActive = plaingNotes.includes(note);
    const className = `vertical-piano__key-${color}`;
    return `${className}${isActive ? ` ${className}__active` : ''}`;
  };
  
  // console.log(extraClassName("D4"));

  const onMouseDown = (note: string) => {
    dispatch(setCurrentNote(note));
  };

  const onMouseUp = () => {
    dispatch(setCurrentNote(''));
  };

  return (
    <div className={`vertical-piano ${className}`}>
      {pitchNotes.map((note) => (
        <button
          key={note}
          className={`vertical-piano__key ${extraClassName(note)}`}
          style={{ '--height': `${elemHeight}px` }}
          onMouseDown={() => onMouseDown(note)}
          onMouseUp={() => onMouseUp()}
        >
          {note}
        </button>
      ))}
    </div>
  );
};

export default VerticalPiano;
