import { useEffect } from 'react';

import TactsNumbers from 'src/components/TactsNumbers/TactsNumbers';
import TimeStripe from 'src/components/TimeStripe/TimeStripe';
import VerticalPiano from 'src/components/VerticalPiano/VerticalPiano';

import DrawableField from 'src/features/DrawableField/DrawableField';

import './InstrumentPage.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'src/shared/redux/store/store';

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

  return (
    <main
      className={`instrument-page ${className}`}
      style={{
        '--tacts-count': `${tactsCounter}`,
        '--element-width': `${elementWidth*16}px`
      }}
    >

      <div className="top-field__empty" />
      <TactsNumbers className="top-field__tacts-number" />
      <VerticalPiano className="instrument-page__vertical-piano" />
      <DrawableField className="instrument-page__drawable-field" />
    </main>
  );
};

export default InstrumentPage;
