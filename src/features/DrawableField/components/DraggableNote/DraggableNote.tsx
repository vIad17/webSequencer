import React from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useSelector } from 'react-redux';

import { RootState } from 'src/shared/redux/store/store';

import './DraggableNote.scss';

interface DraggableNoteProps {
  x: number;
  y: number;
  size?: number;
  index: number;
  isActive?: boolean;
  onDrag?: (e: DraggableEvent, position: DraggableData) => void;
  onMouseDown?: (e: React.MouseEvent, index: number) => void;
  onMouseUp?: (e: React.MouseEvent, index: number) => void;
  onRightClick?: (e: React.MouseEvent, index: number) => void;
  onSizeableClick?: (e: React.MouseEvent) => void;
}

const DraggableNote = ({
  x,
  y,
  size = 4,
  index,
  isActive = false,
  onDrag = () => {},
  onMouseDown = () => {},
  onMouseUp = () => {},
  onRightClick = () => {},
  onSizeableClick = () => {}
}: DraggableNoteProps) => {
  const drawableField = useSelector((state: RootState) => state.drawableField);
  const columnsCount = drawableField.columnsCount;
  const elementHeight = drawableField.elementHeight;
  const elementWidth = drawableField.elementWidth;
  const deltaSize = useSelector(
    (state: RootState) => state.notesArray.deltaSize
  );

  const tempSize = isActive
    ? Math.max(
        size * elementWidth +
          Math.min(deltaSize, (columnsCount - (x + size)) * elementWidth),
        elementWidth
      )
    : size * elementWidth;

  return (
    <Draggable
      position={{
        x: x * elementWidth,
        y: y * elementHeight
      }}
      cancel=".draggable-note__resizible-button"
      onDrag={onDrag}
      bounds="parent"
      grid={[elementWidth, elementHeight]}
    >
      <div
        className={`draggable-note ${isActive && 'draggable-note--active'}`}
        onMouseDownCapture={(e) => onMouseDown(e, index)}
        onMouseUpCapture={(e) => onMouseUp(e, index)}
        onContextMenu={(e) => onRightClick(e, index)}
        style={{
          '--width': `${tempSize}px`,
          '--height': `${elementHeight}px`
        }}
      >
        <button
          onMouseDown={onSizeableClick}
          className="draggable-note__resizible-button"
        />
      </div>
    </Draggable>
  );
};

export default React.memo(DraggableNote);
