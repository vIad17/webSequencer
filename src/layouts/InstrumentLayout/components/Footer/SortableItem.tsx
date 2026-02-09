import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FXBitcrush from 'src/features/Effects/components/EffectCard/FXBitcruch/FXBitcrush';
import FXGainADSR from 'src/features/Effects/components/EffectCard/FXGainADSR/FXGainADSR';
import FXTremolo from 'src/features/Effects/components/EffectCard/FXTremolo/FXTremolo';
import { index } from 'd3';
import { Effect, EffectType } from 'src/shared/redux/slices/effectsSlice';
import FXDelay from 'src/features/Effects/components/EffectCard/FXDelay/FXDelay';
import FXDistortion from 'src/features/Effects/components/EffectCard/FXDistortion/FXDistortion';
import FXPitchShift from 'src/features/Effects/components/EffectCard/FXPitchShift/FXPitchShift';

export const EffectComponentByType: Partial<Record<EffectType, React.ComponentType<{ id: string }>>> = {
  [EffectType.ADSR]: FXGainADSR,
  [EffectType.TREMOLO]: FXTremolo,
  [EffectType.BITS]: FXBitcrush,
  [EffectType.DELAY]: FXDelay,
  [EffectType.DISTORTION]: FXDistortion,
  [EffectType.PITCH_SHIFT]: FXPitchShift,
};

export const SortableItem = ({id, effect}: {id: string, effect: Effect}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString({x: transform?.x ?? 0, y: transform?.y ?? 0, scaleX: 1, scaleY: 1}),
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 10 : 0,
  };

  const EffectCard = EffectComponentByType[effect.type];

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {EffectCard ? <EffectCard id={id} /> : null}
    </div>
  );
}