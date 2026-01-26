import MySketch from 'src/components/Scetch/Sketch';
import SynthCard from 'src/features/Effects/components/SynthCard/SynthCard';

import './Footer.scss';
import clsx from 'clsx';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { useEffect, useMemo, useState } from 'react';
import { SortableItem } from './SortableItem';

import { addEffect, EffectType } from 'src/shared/redux/slices/effectsSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'src/shared/redux/store/store';

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
  const effects = useSelector((state: RootState) => state.effects.effects);

  const dispatch = useDispatch();

  const [orderedEffectIds, setOrderedEffectIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const effectsById = useMemo(() => {
    const map: Record<string, (typeof effects)[number]> = {};
    for (const e of effects) map[e.id] = e;
    return map;
  }, [effects]);

  useEffect(() => {
    const ids = effects.map((e) => e.id);
    setOrderedEffectIds((prev) => {
      if (prev.length === 0) return ids;

      const idsSet = new Set(ids);
      const prevSet = new Set(prev);

      const kept = prev.filter((id) => idsSet.has(id));
      const added = ids.filter((id) => !prevSet.has(id));

      return [...kept, ...added];
    });
  }, [effects]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const activeKey = String(active.id);
    const overKey = String(over.id);

    if (activeKey === overKey) return;

    setOrderedEffectIds((ids) => {
      const oldIndex = ids.indexOf(activeKey);
      const newIndex = ids.indexOf(overKey);
      if (oldIndex === -1 || newIndex === -1) return ids;
      return arrayMove(ids, oldIndex, newIndex);
    });
  }

  const activeEffect = activeId ? effectsById[activeId] : null;

  return (
    <div className={clsx('footer', className)}>
      <SynthCard className="footer__synth" name="Synth" />

      <div className="footer__effects">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={orderedEffectIds} strategy={horizontalListSortingStrategy}>
            {orderedEffectIds.map((id) => {
              const effect = effectsById[id];
              if (!effect) return null;
              return <SortableItem key={id} id={id} effect={effect} />;
            })}
          </SortableContext>

          <DragOverlay>
            {activeEffect ? <SortableItem key={activeEffect.id} id={activeEffect.id} effect={activeEffect} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <MySketch className="footer__sketch" />
    </div>
  );
};

export default Footer;
