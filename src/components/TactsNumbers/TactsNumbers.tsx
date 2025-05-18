import { useSelector } from 'react-redux';

import { RootState } from 'src/shared/redux/store/store';

import './TactsNumbers.scss';
import clsx from 'clsx';
import TimeStripe from '../TimeStripe/TimeStripe';

interface TactsNumbersProps {
  className?: string;
}

const TactsNumbers = ({ className = '' }: TactsNumbersProps) => {
  const tactsCounter = useSelector((state: RootState) => state.settings.tacts);
  const elementWidth = useSelector(
    (state: RootState) => state.drawableField.elementWidth
  );

  const renderTactsNumber = () =>
    Array.from({ length: tactsCounter ?? 0 }, (_, i) => (
      <div
        className={clsx('tacts-number__tact', {
          'tacts-number__tact_first': i === 0
        })}
        key={i}
        style={{ '--width': `${elementWidth * 16}px` }}
      >
        <p className="tacts-number__tact-text">{i}</p>
      </div>
    ));

  return (
    <div
      className={`tacts-number ${className}`}
      style={{ '--width': `${elementWidth * 16}px` }}
    >
      {/* <TimeStripe className="tacts-number__time-stripe" /> */}
      {renderTactsNumber()}
    </div>
  );
};

export default TactsNumbers;
