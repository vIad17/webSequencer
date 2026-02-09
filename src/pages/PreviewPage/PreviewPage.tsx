import { useEffect } from 'react';

import TactsNumbers from 'src/components/TactsNumbers/TactsNumbers';
import TimeStripe from 'src/components/TimeStripe/TimeStripe';
import VerticalPiano from 'src/components/VerticalPiano/VerticalPiano';

import DrawableField from 'src/features/DrawableField/DrawableField';

import './PreviewPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/shared/redux/store/store';
import clsx from 'clsx';
import { setElementHeigth } from 'src/shared/redux/slices/drawableFieldSlice';

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

    const deltaNote =
      notesArray[maxNoteIndex]?.note - notesArray[minNoteIndex]?.note;

    const windowHeight = window.innerHeight;

    const aaa = windowHeight / (deltaNote + 3);
    console.log(deltaNote, windowHeight, aaa);

    dispatch(setElementHeigth(aaa));

      document.querySelector('.preview')?.scrollTo({
        top: aaa * notesArray[minNoteIndex]?.note - aaa
      });
    // }
  });

  return (
    <main className={clsx('preview', className)}>
      <DrawableField className="preview__drawable-field" isPreview={true} />
    </main>
  );
};

export default PreviewPage;
