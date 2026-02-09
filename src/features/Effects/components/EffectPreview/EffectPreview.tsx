import { useDispatch } from 'react-redux';
import './EffectPreview.scss';

import clsx from 'clsx';
import { Icon } from 'src/shared/icons/Icon';
import { IconType } from 'src/shared/icons/IconMap';
import { addEffect, EffectType } from 'src/shared/redux/slices/effectsSlice';
import { useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';

export interface EffectPreviewData {
  icon: IconType;
  name: string;
}

export const effectPreviewByType: Record<EffectType, EffectPreviewData> = {
  [EffectType.ADSR]: {
    icon: IconType.EffectAdsr,
    name: 'ADSR',
  },
  [EffectType.BITS]: {
    icon: IconType.EffectBits,
    name: 'Bits',
  },
  [EffectType.DELAY]: {
    icon: IconType.EffectDelay,
    name: 'Delay',
  },
  [EffectType.DISTORTION]: {
    icon: IconType.EffectDistortion,
    name: 'Distortion',
  },
  [EffectType.FILTER]: {
    icon: IconType.EffectFilter,
    name: 'Filter',
  },
  [EffectType.PITCH_SHIFT]: {
    icon: IconType.EffectPitchShift,
    name: 'Pitch shift',
  },
  [EffectType.TREMOLO]: {
    icon: IconType.EffectTremolo,
    name: 'Tremolo',
  },
};

const makeId = () => `id_${Date.now()}_${Math.random()}`;

interface EffectPreviewProps {
  className?: string;
  type: EffectType;
}

const EffectPreview = ({ className, type }: EffectPreviewProps) => {

  const dispatch = useDispatch();

  const [dragId, setDragId] = useState(() => `fx_${type}_${makeId()}`);

  const effectPreviewData = effectPreviewByType[type];

  const onClick = () => {
    dispatch(addEffect({ type, id: crypto.randomUUID() }))
  }

  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'sidebar', effectType: type },
  });

  useEffect(() => {
    if (!isDragging) setDragId(`fx_${type}_${makeId()}`);
  }, [isDragging, type]);

  return (
    <div
      {...listeners}
      {...attributes}
      data-dnd-origin="sidebar"
      ref={setNodeRef}
      className={clsx('effect-preview', className)}
      onDoubleClick={onClick}
    >
      <Icon className='effect-preview__icon' icon={effectPreviewData.icon} size={20} />
      <h2 className='effect-preview__name'>{effectPreviewData.name}</h2>
    </div>
  );
};

export default EffectPreview;