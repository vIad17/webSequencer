import { useDispatch, useSelector } from 'react-redux';

import Note from 'src/components/Note/Note';

import { MelodyArray } from 'src/shared/interfaces';
import { changeValue } from 'src/shared/redux/slices/melodyArraySlice';
import { RootState } from 'src/shared/redux/store/store';

import './Bit.scss';

interface BitProps {
  className?: string;
  bitNumber: number;
}

const Bit = ({ className = '', bitNumber }: BitProps) => {
  const melodyArray = useSelector(
    (state: RootState) => state.melodyArray.melodyArray
  );
  const currentBit = useSelector((state: RootState) => state.bit.bit);

  const dispatch = useDispatch();

  return (
    <div
      className={`bit ${bitNumber === currentBit && 'bit--active'} ${className}`}
    >
      {Object.entries(melodyArray).map((element) => (
        <Note
          key={element[0]}
          className={element[0].charAt(1) === '#' ? 'note-button--gray' : ''}
          isActive={melodyArray[element[0] as keyof MelodyArray][bitNumber]}
          onClick={async () => {
            dispatch(
              changeValue({
                note: element[0],
                position: bitNumber,
                isNotePressed:
                  !melodyArray[element[0] as keyof MelodyArray][bitNumber]
              })
            );
          }}
        />
      ))}
    </div>
  );
};

export default Bit;
