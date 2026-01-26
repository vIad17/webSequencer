import { useDispatch } from 'react-redux';
import './EffectPreview.scss';

import clsx from 'clsx';
import { Icon } from 'src/shared/icons/Icon';
import { IconType } from 'src/shared/icons/IconMap';
import { addEffect, EffectType } from 'src/shared/redux/slices/effectsSlice';

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

interface EffectPreviewProps {
  className?: string;
  type: EffectType;
}

const EffectPreview = ({className, type }: EffectPreviewProps) => {
  
  const dispatch = useDispatch();

  const effectPreviewData = effectPreviewByType[type];

  const onClick = () => {
    dispatch(addEffect({type, id: crypto.randomUUID()}))
  }

  return (
    <div className={clsx('effect-preview', className)} onClick={onClick}>
      <Icon className='effect-preview__icon' icon={effectPreviewData.icon} size={20}/>
      <h2 className='effect-preview__name'>{effectPreviewData.name}</h2>
    </div>
  );
};

export default EffectPreview;