import { useEffect } from 'react';

import TactsNumbers from 'src/components/TactsNumbers/TactsNumbers';
import VerticalPiano from 'src/components/VerticalPiano/VerticalPiano';

import DrawableField from 'src/features/DrawableField/DrawableField';

import './InstrumentPage.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'src/shared/redux/store/store';
import { generatePreview } from 'src/shared/functions/generatePreview';

interface InstrumentPageProps {
  className?: string;
}

const InstrumentPage = ({ className = '' }: InstrumentPageProps) => {
  useEffect(() => {
    document
      .getElementsByClassName('vertical-piano__key')?.[15]
      .scrollIntoView();
  }, []);

  const tactsCounter = useSelector((state: RootState) => state.settings.tacts);
  const elementWidth = useSelector(
    (state: RootState) => state.drawableField.elementWidth
  );

  const notesArray = useSelector(
    (state: RootState) => state.notesArray.notesArray
  );

  console.log(generatePreview(notesArray));

  return (
    <main
      className={`instrument-page ${className}`}
      style={{
        '--tacts-count': `${tactsCounter}`,
        '--element-width': `${elementWidth*16}px`
      }}
    >
      
      <TactsNumbers className="top-field__tacts-number" />
      <VerticalPiano className="instrument-page__vertical-piano" />
      <DrawableField className="instrument-page__drawable-field" />
    </main>
  );
};

export default InstrumentPage;
