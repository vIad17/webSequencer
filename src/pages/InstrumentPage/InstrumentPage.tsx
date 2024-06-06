import { useEffect } from 'react';

import TactsNumbers from 'src/components/TactsNumbers/TactsNumbers';
import TimeStripe from 'src/components/TimeStripe/TimeStripe';
import VerticalPiano from 'src/components/VerticalPiano/VerticalPiano';

import DrawableField from 'src/features/DrawableField/DrawableField';

import './InstrumentPage.scss';

interface InstrumentPageProps {
  className?: string;
}

const InstrumentPage = ({ className = '' }: InstrumentPageProps) => {
  useEffect(() => {
    document
      .getElementsByClassName('vertical-piano__key')?.[15]
      .scrollIntoView();
  }, []);

  return (
    <main className={`instrument-page ${className}`}>
      <div className="top-field__empty" />
      <div className="top-field__content">
        <TactsNumbers className="top-field__tacts-number" />
        <TimeStripe className="top-field__time-stripe" />
      </div>
      <VerticalPiano className="instrument-page__vertical-piano" />
      <DrawableField className="instrument-page__drawable-field" />
    </main>
  );
};

export default InstrumentPage;
