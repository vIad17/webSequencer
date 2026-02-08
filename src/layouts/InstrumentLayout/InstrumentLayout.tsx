import { Outlet } from 'react-router-dom';

import Header from 'src/layouts/InstrumentLayout/components/Header/Header';

import './InstrumentLayout.scss';
import Footer, { FOOTER_DROP_ID } from './components/Footer/Footer';
import EffectsSidebar from './components/EffectsSidebar/EffectsSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/shared/redux/store/store';
import { useMemo, useState } from 'react';
import { closestCenter, CollisionDetection, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, pointerWithin, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { SortableItem } from './components/Footer/SortableItem';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { addEffect, Effect, EffectType, removeEffect, setEffects } from 'src/shared/redux/slices/effectsSlice';
import FXGainADSR from 'src/features/Effects/components/EffectCard/FXGainADSR/FXGainADSR';
import FXTremolo from 'src/features/Effects/components/EffectCard/FXTremolo/FXTremolo';
import FXBitcrush from 'src/features/Effects/components/EffectCard/FXBitcruch/FXBitcrush';

const EffectGhost = ({ effect }: { effect: Effect }) => {
  switch (effect.type) {
    case EffectType.ADSR:
      return <FXGainADSR id={effect.id} />;
    case EffectType.TREMOLO:
      return <FXTremolo id={effect.id} />;
    case EffectType.BITS:
      return <FXBitcrush id={effect.id} />;
    default:
      return null;
  }
};

const collisionDetection: CollisionDetection = (args) => {
  if (args.pointerCoordinates) return pointerWithin(args);
  return closestCenter(args);
};

const InstrumentLayout = () => {

  const effects = useSelector((state: RootState) => state.effects.effects);

  const dispatch = useDispatch();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOverFooter, setIsOverFooter] = useState(false);
  const [isNewEffect, setIsNewEffect] = useState(false);

  const footerIds = useMemo(() => new Set(effects.map((e) => e.id)), [effects]);

  const isFooterTarget = (overId: unknown) => {
    if (!overId) return false;
    const id = String(overId);
    return id === "sidebar" || id === FOOTER_DROP_ID || footerIds.has(id);
  };


  const effectsById = useMemo(() => {
    const map: Record<string, (typeof effects)[number]> = {};
    for (const e of effects) map[e.id] = e;
    return map;
  }, [effects]);

const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
);

  function onDragStart(event: DragStartEvent) {
    const data = event.active.data.current

    const id = String(event.active.id);
    const isFromSidebar = data?.from === 'sidebar'

    setActiveId(id);

    setIsNewEffect(isFromSidebar);

    if (isFromSidebar) {
      dispatch(addEffect({ id, type: data.effectType }));
    }
  }

  function onDragOver(event: DragOverEvent) {
    setIsOverFooter(isFooterTarget(event.over?.id));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);



    // if (!over) return;

    const activeEffect = effects.find(effect => effect.id === active.id);
    const overEffect = over ? effects.find(effect => effect.id === over.id) : undefined;

    if (!isOverFooter && !!activeEffect) {
      dispatch(removeEffect(activeEffect.id));
      return
    }

    if (!activeEffect || !overEffect) return;

    if (activeEffect?.id === overEffect?.id) return;

    const setOrderedEffectIds = (() => {
      const oldIndex = effects.indexOf(activeEffect);
      const newIndex = effects.indexOf(overEffect);
      if (oldIndex === -1 || newIndex === -1) return effects;
      return arrayMove(effects, oldIndex, newIndex);
    });

    dispatch(setEffects(setOrderedEffectIds()))

    setIsOverFooter(false);
  }

  const activeEffect = activeId ? effectsById[activeId] : null;
  const activeEffectComp = activeId ? document.getElementById(activeId) : null;

  const { setNodeRef: setMainRef } = useDroppable({ id: "main" });
  const { setNodeRef: setSidebarRef } = useDroppable({ id: "sidebar" });

  return <div className="instrument-layout">
    <Header className="instrument-layout__header" />


    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      modifiers={[snapCenterToCursor]}
    >
      <div ref={setMainRef} className='instrument-layout__main'>
        <div ref={setSidebarRef}>
          <EffectsSidebar className='instrument-layout__effects-sidebar' />
        </div>
        <div className="instrument-layout__content">
          <Outlet />
        </div>
      </div>
      <Footer className="instrument-layout__footer" />

      <DragOverlay style={{ opacity: isOverFooter ? 1 : 0.35 }}>
        {activeEffect ?
          isNewEffect ?
            <EffectGhost effect={activeEffect} /> :
            activeEffectComp ?
              <div dangerouslySetInnerHTML={{ __html: activeEffectComp.outerHTML }} /> :
              null :
          null}
      </DragOverlay>
    </DndContext>
  </div>
}

export default InstrumentLayout;
