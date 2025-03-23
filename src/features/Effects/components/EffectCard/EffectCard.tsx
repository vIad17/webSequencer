import { ReactNode } from 'react';
import './EffectCard.scss';

interface EffectCardProps {
  className?: string;
  name: string;
  canRemove?: boolean;
  children: ReactNode;
}

const EffectCard = ({className = "", name, canRemove = true, children }: EffectCardProps) => (
  <div className={`effect ${className}`}>
    <header className="effect__header">
      <h5 className="effect__header-title">{name}</h5>
      <div className="effect__header-icons">
        <EffectIcon icon='hide' />
        <EffectIcon icon='mute' />
        {canRemove && <EffectIcon icon='delete' />}
      </div>
    </header>
    {children}
  </div>
);

const EffectIcon = ({ icon }: { icon: string }) => {
  return <div className="effect-icon">{icon[0]}</div>;
};

export default EffectCard;
