import { useDispatch } from 'react-redux';
import './EffectPreview.scss';

import clsx from 'clsx';
import { Icon } from 'src/shared/icons/Icon';
import { IconType } from 'src/shared/icons/IconMap';
import { addEffect, EffectParams, EffectType } from 'src/shared/redux/slices/effectsSlice';
import { useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { chain, GetChain } from 'src/app/SoundManager';

export interface EffectPreviewData {
  icon: IconType;
  name: string;
  createEffectObject: () => Tone.ToneAudioNode;
  defaultParams: EffectParams
}


//TODO move to smth
export const effectPreviewByType: Record<EffectType, EffectPreviewData> = {
  [EffectType.ADSR]: {
    icon: IconType.EffectAdsr,
    name: 'ADSR',
    createEffectObject: () => new Tone.Tremolo(0, 0),
    defaultParams: { attack: 0, decay: 0, sustain: 1, release: 0 }
  },
  [EffectType.BITS]: {
    icon: IconType.EffectBits,
    name: 'Bits',
    createEffectObject: () => new Tone.BitCrusher(16),
    defaultParams: { bits: 16 }
  },
  [EffectType.DELAY]: {
    icon: IconType.EffectDelay,
    name: 'Delay',
    createEffectObject: () => new Tone.FeedbackDelay(0, 0),
    defaultParams: { delayTime: 0, feedback: 0 }
  },
  [EffectType.DISTORTION]: {
    icon: IconType.EffectDistortion,
    name: 'Distortion',
    createEffectObject: () => new Tone.Distortion(0),
    defaultParams: { distortion: 0 }
  },
  [EffectType.FILTER]: { // TODO: not ready yet
    icon: IconType.EffectFilter,
    name: 'Filter',
    createEffectObject: () => new Tone.Filter(20, 'lowpass'),
    defaultParams: { lowFilter: 20, highFilter: 8000 }
  },
  [EffectType.PITCH_SHIFT]: {
    icon: IconType.EffectPitchShift,
    name: 'Pitch shift',
    createEffectObject: () => new Tone.PitchShift(0),
    defaultParams: { pitchShift: 0 }
  },
  [EffectType.TREMOLO]: {
    icon: IconType.EffectTremolo,
    name: 'Tremolo',
    createEffectObject: () => new Tone.Tremolo(0, 0),
    defaultParams: { tremoloFrequency: 0, tremoloDepth: 0 }
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
    dispatch(addEffect({ type, id: crypto.randomUUID(), params: effectPreviewData.defaultParams }));
    chain.appendFX(effectPreviewByType[type].createEffectObject());
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