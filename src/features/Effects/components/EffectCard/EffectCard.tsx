import { ReactNode, useState } from 'react';
import './EffectCard.scss';
import clsx from 'clsx';
import { Icon } from 'src/shared/icons/Icon';
import { IconType } from 'src/shared/icons/IconMap';

interface EffectCardProps {
  className?: string;
  name: string;
  width: number;
  canRemove?: boolean;
  children: ReactNode;
}

const EffectCard = ({className = "", name, width, canRemove = true, children }: EffectCardProps) => {

  const [collapsed, setCollapsed] = useState(false);
  const [muted, setMuted] = useState(false);

  const switchCollapsed = ()=> {
    setCollapsed((prev) => !prev);
  };

  const switchMuted = ()=> {
    setMuted((prev) => !prev);
  };

  return (
  <div className={clsx('effect', className, { 'collapsed': collapsed }, { 'muted': muted })} style={{ width: `${collapsed?35:width}px` }}>
    <header className="effect__header">
      <h5 className="effect__header-title">{name}</h5>
      <div className="effect__header_controls">
        <button className='effect__header_button' onClick={() => switchCollapsed()}>
          <Icon icon={IconType.Eye} interactable />
        </button>
        <button className='effect__header_button muteBT' onClick={() => switchMuted()}>
          <Icon icon={IconType.Power} interactable/>
        </button>
        <button className='effect__header_button'>
          <Icon icon={IconType.X} interactable/>
        </button>
      </div>
    </header>
    <div className="effect__content">
      {children}
    </div>
  </div>
);
}

const EffectIcon = ({ icon }: { icon: string }) => {
  return <div className="effect-icon">{icon[0]}</div>;
};

export default EffectCard;
