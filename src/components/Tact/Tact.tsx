import Bit from 'src/components/Bit/Bit';

import './Tact.scss';

interface TactProps {
  className?: string;
  tactNumber: number;
}

const Tact = ({ className = '', tactNumber }: TactProps) => (
  <div className="tact-with-number">
    <h2 className="tact-number">{tactNumber}</h2>
    <div className={`tact ${className}`}>
      <Bit bitNumber={tactNumber * 4} />
      <Bit bitNumber={tactNumber * 4 + 1} />
      <Bit bitNumber={tactNumber * 4 + 2} />
      <Bit bitNumber={tactNumber * 4 + 3} />
    </div>
  </div>
);

export default Tact;
