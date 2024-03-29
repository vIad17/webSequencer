import { useEffect, useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';

import {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  ESCAPE
} from 'src/shared/const/KeyboardKeys';
import { clamp, round } from 'src/shared/functions/math';
import {
  addActive,
  changeActive,
  deleteNote,
  setDeltaSize,
  updateNoteDuration,
  updateNotePosition
} from 'src/shared/redux/slices/notesArraySlice';
import { RootState } from 'src/shared/redux/store/store';

import CreationField from '../CreationField/CreationField';
import DraggableNote from '../DraggableNote/DraggableNote';

const moveByGreed = {
  ArrowUp: { x: 0, y: -1 },
  ArrowRight: { x: 1, y: 0 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }
};

const NoteManager = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragg, setIsDragg] = useState(false);
  const [isblockedCreation, setIsBlockedCreation] = useState(false);

  const notesArray = useSelector(
    (state: RootState) => state.notesArray.notesArray
  );
  const drawableField = useSelector((state: RootState) => state.drawableField);

  const dispatch = useDispatch();

  const KeyDownHandler = (event: KeyboardEvent) => {
    if (event.key === ESCAPE) {
      dispatch(changeActive({ index: 0, isActive: false }));
    }
    if (
      event.key === ARROW_UP ||
      event.key === ARROW_RIGHT ||
      event.key === ARROW_DOWN ||
      event.key === ARROW_LEFT
    ) {
      event.preventDefault();

      if (event.shiftKey) {
        let deltaDuration = 0;
        let multiplier = 1;
        if (event.ctrlKey) {
          multiplier = 4;
        }
        if (event.key === ARROW_RIGHT) {
          deltaDuration = 1 * multiplier;
        } else if (event.key === ARROW_LEFT) {
          deltaDuration = -1 * multiplier;
        }
        notesArray.forEach((note, index) => {
          if (note.isActive) {
            dispatch(
              updateNoteDuration({
                index,
                duration: Math.max(note.duration + deltaDuration, 1)
              })
            );
          }
        });
      } else {
        let xMultiplier = 1;
        let yMultiplier = 1;
        if (event.ctrlKey) {
          xMultiplier = 4;
          yMultiplier = 12;
        }
        const coordinates = moveByGreed[event.key as keyof typeof moveByGreed];
        notesArray.forEach((note, index) => {
          note.isActive &&
            dispatch(
              updateNotePosition({
                index,
                attackTime: clamp(
                  note.attackTime + coordinates.x * xMultiplier,
                  0,
                  drawableField.columnsCount - 1
                ),
                note: clamp(
                  note.note + coordinates.y * yMultiplier,
                  0,
                  drawableField.rowsCount - 1
                )
              })
            );
        });
      }
    }
  };

  const dragNoteHandler = (e: DraggableEvent, position: DraggableData) => {
    setIsDragg(true);
    e.preventDefault();
    notesArray.forEach((note, index) => {
      if (note.isActive) {
        dispatch(
          updateNotePosition({
            index,
            attackTime: Math.max(
              0,
              notesArray[index].attackTime +
                position.deltaX / drawableField.elementWidth
            ),
            note: Math.max(
              0,
              notesArray[index].note +
                position.deltaY / drawableField.elementHeight
            )
          })
        );
      }
    });
  };

  const deleteNoteHandler = (e: React.MouseEvent, index1: number) => {
    e.preventDefault();
    dispatch(deleteNote(index1));
  };

  const resizeNoteHandler = (mouseDownEvent: React.MouseEvent) => {
    setIsBlockedCreation(true);
    let curDeltaSize = 0;

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      setIsResizing(true);
      curDeltaSize = mouseMoveEvent.pageX - mouseDownEvent.pageX;
      dispatch(setDeltaSize(curDeltaSize));
    }

    function onMouseUp() {
      setIsResizing(false);
      document.body.removeEventListener('mousemove', onMouseMove);

      notesArray.forEach((note, index) => {
        if (note.isActive) {
          dispatch(
            updateNoteDuration({
              index,
              duration: Math.max(
                round(
                  (note.duration * drawableField.elementWidth + curDeltaSize) /
                    drawableField.elementWidth
                ),
                1
              )
            })
          );
        }
      });
      dispatch(setDeltaSize(0));
      setIsBlockedCreation(false);
    }

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp, { once: true });
  };

  const changeActiveNoteHandler = (e: React.MouseEvent, index1: number) => {
    if (!notesArray[index1].isActive) {
      if (e.shiftKey) {
        dispatch(addActive(index1));
      } else {
        dispatch(changeActive({ index: index1, isActive: true }));
      }
    }
  };

  const NoteMouseUpHandler = (e: React.MouseEvent, index1: number) => {
    if (!isDragg && !isResizing && !e.shiftKey) {
      dispatch(changeActive({ index: index1, isActive: true }));
    }
    setIsDragg(false);
    setIsBlockedCreation(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', KeyDownHandler);
    return () => {
      document.removeEventListener('keydown', KeyDownHandler);
    };
  }, [notesArray]);

  const renderArray = () =>
    notesArray?.map((element, index) => (
      <DraggableNote
        key={index}
        x={element.attackTime}
        y={element.note}
        size={element.duration}
        index={index}
        isActive={element.isActive}
        onDrag={dragNoteHandler}
        onMouseDown={changeActiveNoteHandler}
        onMouseUp={NoteMouseUpHandler}
        onRightClick={deleteNoteHandler}
        onSizeableClick={resizeNoteHandler}
      />
    ));

  console.log(isResizing || isDragg);

  return (
    <>
      <CreationField
        isblockedCreation={isblockedCreation}
        setIsBlockedCreation={setIsBlockedCreation}
      />
      {renderArray()}
    </>
  );
};

export default NoteManager;
