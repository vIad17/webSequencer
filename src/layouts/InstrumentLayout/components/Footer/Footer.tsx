import MySketch from 'src/components/Scetch/Sketch';
import SoundSettings from 'src/components/SoundSettings/SoundSettings';

import './Footer.scss';
import clsx from 'clsx';
import SynthCard from 'src/features/Effects/components/SynthCard/SynthCard';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

//temp
import { useState } from 'react';
import { SortableItem } from './SortableItem';
//--

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
  const [items, setItems] = useState([1, 2, 3]);
  const [draggingIndex, setDraggingIndex] = useState(-1);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  //   function onDragStart(event) {
  //   setDra
  // }

  function onDragStart(event: any) {
    const { active, over } = event;
        setDraggingIndex(active.id);
  }

  function onDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }


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
          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
          >
            {items.map(id => <SortableItem key={id} id={id} />)}
          </SortableContext>
          <DragOverlay>
            <SortableItem key={draggingIndex} id={draggingIndex}></SortableItem>
          </DragOverlay>
        </DndContext>
      </div>
      <MySketch className="footer__sketch" />
    </div>
  )
};

export default Footer;
