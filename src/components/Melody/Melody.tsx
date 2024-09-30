import { useSelector } from 'react-redux';

import NoteNames from 'src/components/NoteNames/NoteNames';
import Tact from 'src/components/Tact/Tact';

import { RootState } from 'src/shared/redux/store/store';

import './Melody.scss';

interface MelodyProps {
  className?: string;
}

const Melody = ({ className = '' }: MelodyProps) => {
  const tactsCounter = useSelector((state: RootState) => state.settings.tacts);

  const renderTacts = () =>
    Array.from({ length: tactsCounter ?? 0 }, (_, i) => (
      <Tact key={i} tactNumber={i} />
    ));

  return (
    <div className={`melody ${className}`}>
      <NoteNames />
      {renderTacts()}
    </div>
  );
};

export default Melody;
