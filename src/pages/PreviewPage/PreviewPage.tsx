import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import DrawableField from 'src/features/DrawableField/DrawableField';
import { RootState } from 'src/shared/redux/store/store';
import { setElementHeigth } from 'src/shared/redux/slices/drawableFieldSlice';

import './PreviewPage.scss';

interface InstrumentPageProps {
  className?: string;
}

const PreviewPage = ({ className = '' }: InstrumentPageProps) => {
  const notesArray = useSelector(
    (state: RootState) => state.notesArray.notesArray
  );

  // for updating data
  useSelector(
    (state: RootState) => state.drawableField.elementHeight
  );

  const domRef = useRef<HTMLElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const minNoteIndex = notesArray?.reduce(
      (minIndex, current, currentIndex, array) => {
        return current.note < array[minIndex].note ? currentIndex : minIndex;
      },
      0
    );

    const maxNoteIndex = notesArray?.reduce(
      (minIndex, current, currentIndex, array) => {
        return current.note > array[minIndex].note ? currentIndex : minIndex;
      },
      0
    );

    const defaultDeltaNote = notesArray[maxNoteIndex] && notesArray[minNoteIndex] ? notesArray[maxNoteIndex].note - notesArray[minNoteIndex].note : 0;
    const deltaNote = Math.max(defaultDeltaNote, 12);

    const windowHeight = window.innerHeight;

    const elementHeight = windowHeight / (deltaNote + 3);

    dispatch(setElementHeigth(elementHeight));

    document.querySelector('.preview')?.scrollTo({
      top: elementHeight * notesArray[minNoteIndex]?.note - elementHeight
    });

    const preventInputScroll = (e: WheelEvent) => e.preventDefault();
    domRef.current?.addEventListener('wheel', preventInputScroll);
    return () => {
      domRef.current?.removeEventListener('wheel', preventInputScroll);
    };
  });

  return (
    <main className={clsx('preview', className)} ref={domRef}>
      <DrawableField className="preview__drawable-field" isPreview={true} />
    </main>
  );
};

export default PreviewPage;
