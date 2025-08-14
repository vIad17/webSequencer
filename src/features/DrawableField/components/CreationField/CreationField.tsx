import { useDispatch, useSelector } from 'react-redux';

import { useMouse } from '@uidotdev/usehooks';

import { floor } from 'src/shared/functions/math';
import { addNote } from 'src/shared/redux/slices/notesArraySlice';
import { RootState } from 'src/shared/redux/store/store';

import './CreationField.scss';

interface CreationFieldProps {
  className?: string;
  isblockedCreation?: boolean;
  setIsBlockedCreation?: (arg: boolean) => void;
}

const CreationField = ({
  className = '',
  isblockedCreation = false,
  setIsBlockedCreation = () => {}
}: CreationFieldProps) => {
  const drawableField = useSelector((state: RootState) => state.drawableField);

  const dispatch = useDispatch();

  const [mouse, mouseRef] = useMouse<HTMLButtonElement>();

  const onMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.nativeEvent.button === 0 && !isblockedCreation) {
      const getPosition = (mousePosition: number, elementSize: number) =>
        floor(mousePosition, elementSize) / elementSize;
      dispatch(
        addNote({
          note: getPosition(mouse.elementY, drawableField.elementHeight),
          attackTime: getPosition(mouse.elementX, drawableField.elementWidth),
          duration: 4
        })
      );

      console.log("Creating note:"+ getPosition(mouse.elementY, drawableField.elementHeight) + " attackTime:" + getPosition(mouse.elementX, drawableField.elementWidth));
    }
    setIsBlockedCreation(false);
  };

  return (
    <button
      className={`creation-field ${className}`}
      onClickCapture={onMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      ref={mouseRef}
    />
  );
};

export default CreationField;
