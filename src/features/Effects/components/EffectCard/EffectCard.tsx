import { ReactNode, useState } from 'react';
import './EffectCard.scss';
import clsx from 'clsx';
import { Icon } from 'src/shared/icons/Icon';
import { IconType } from 'src/shared/icons/IconMap';
import { useDispatch, useSelector } from 'react-redux';
import { removeEffect, toggleIsEffectMuted } from 'src/shared/redux/slices/effectsSlice';
import { RootState } from 'src/shared/redux/store/store';

interface EffectCardProps {
  className?: string;
  name: string;
  width: number;
  canRemove?: boolean;
  id: string;
  children: ReactNode;
}

const EffectCard = ({ className = "", name, width, canRemove = true, id, children }: EffectCardProps) => {
  const dispatch = useDispatch();

  const effect = useSelector((state: RootState) => state.effects.effects).find(el => el.id === id);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div id={id} className={clsx('effect', className, { 'collapsed': collapsed }, { 'muted': effect?.isMuted })} style={{ width: `${collapsed ? 35 : width}px` }}>
      <header className="effect__header">
        <h5 className="effect__header-title">{name}</h5>
        <div className="effect__header_controls">
          <button className='effect__header_button' onClick={(event) => {
            event.stopPropagation();
            setCollapsed((prev) => !prev);
          }} onMouseDown={(event) => {
            event.stopPropagation();
          }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}>
            <Icon icon={IconType.Eye} interactable />
          </button>
          <button className='effect__header_button muteBT'
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              dispatch(toggleIsEffectMuted({id}))
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}>
            <Icon icon={IconType.Power} interactable />
          </button>
          <button className='effect__header_button'
            onClick={(event) => {
              dispatch(removeEffect(id))
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}>
            <Icon icon={IconType.X} interactable />
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
