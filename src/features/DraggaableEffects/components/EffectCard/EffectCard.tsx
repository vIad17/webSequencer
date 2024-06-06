import { ReactNode } from 'react';
import './EffectCard.scss';

interface EffectCardProps {
  className?: string;
  children?: ReactNode;
}

const EffectCard = ({ className = '', children = <></> }: EffectCardProps) => {

  
  return <div className={`effect-card ${className}`}>{children}</div>;
};

export default EffectCard;
