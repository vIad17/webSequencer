import NoteNames from 'src/components/NoteNames/NoteNames';
import TactsNumbers from 'src/components/TactsNumbers/TactsNumbers';

import DrawableField from 'src/features/DrawableField/DrawableField';

import './InstrumentPage.scss';

interface InstrumentPageProps {
  className?: string;
}

const InstrumentPage = ({ className = '' }: InstrumentPageProps) => {
  return (
    <main className={`instrument-page ${className}`}>
      <TactsNumbers className="instrument-page__tacts-number" />
      <div className="instrument-page__drawable-field">
        <NoteNames className="instrument-page__note-names" />
        <DrawableField />
      </div>
    </main>
  );
};

export default InstrumentPage;
