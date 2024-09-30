import { useSelector } from 'react-redux';

import { RootState } from 'src/shared/redux/store/store';

import './TactsNumbers.scss';

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
      <p className="tacts-number__tact" key={i}>
        {i}
      </p>
    ));

  return (
    <div
      className={`tacts-number ${className}`}
      style={{ '--width': `${elementWidth * 16}px` }}
    >
      {renderTactsNumber()}
    </div>
  );
};

export default TactsNumbers;
