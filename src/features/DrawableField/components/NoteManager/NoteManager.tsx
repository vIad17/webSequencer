import { useEffect, useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';

import {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  BACKSPACE,
  C,
  ESCAPE,
  V,
  Z
} from 'src/shared/const/KeyboardKeys';
import { clamp, round } from 'src/shared/functions/math';
import {
  addSelectedNote,
  addNotes,
  changeSelectedNote,
  deleteNote,
  removeSelectedNotes,
  setDeltaSize,
  setNotes,
  updateNoteDuration,
  updateNotePosition
} from 'src/shared/redux/slices/notesArraySlice';
import { RootState } from 'src/shared/redux/store/store';

import CreationField from '../CreationField/CreationField';
import DraggableNote from '../DraggableNote/DraggableNote';
import {
  setCopiedObjects,
  deleteObjects
} from 'src/shared/redux/slices/copiedObjectsSlise';
import { useNavigate } from 'react-router-dom';

const moveByGreed = {
  ArrowUp: { x: 0, y: -1 },
  ArrowRight: { x: 1, y: 0 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }
};

interface NoteManagerProps {
  className?: string;
}

const NoteManager = ({className} : NoteManagerProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragg, setIsDragg] = useState(false);
  const [isblockedCreation, setIsBlockedCreation] = useState(false);

  const notesArray = useSelector(
    (state: RootState) => state.notesArray.notesArray
  );
  const copiedObjects = useSelector(
    (state: RootState) => state.copiedObjects.objects
  );
  const drawableField = useSelector((state: RootState) => state.drawableField);
  const currentBit = useSelector(
    (state: RootState) => state.currentMusic.currentBit
  );

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const moveNote = (deltaX: number, deltaY: number) => {
    let localDeltaX = deltaX;
    let localDeltaY = deltaY;

    notesArray.forEach((note) => {
      if (note.isSelected) {
        if (note.attackTime + localDeltaX < 0) {
          localDeltaX = -note.attackTime;
        } else {
          localDeltaX = Math.min(
            localDeltaX,
            drawableField.columnsCount - (note.attackTime + note.duration)
          );
        }
        if (note.note + localDeltaY < 0) {
          localDeltaY = -note.note;
        } else {
          localDeltaY = Math.min(
            localDeltaY,
            drawableField.rowsCount - note.note + 1
          );
        }
      }
    });

    notesArray.forEach((note, index) => {
      note.isSelected &&
        dispatch(
          updateNotePosition({
            index,
            attackTime: note.attackTime + localDeltaX,
            note: note.note + localDeltaY
          })
        );
    });
  };

  const KeyDownHandler = (event: KeyboardEvent) => {
    if (event.key === ESCAPE) {
      dispatch(removeSelectedNotes());
    }
    if (event.ctrlKey && event.key === C) {
      const activeNotes = notesArray.filter((note) => note.isSelected);
      dispatch(setCopiedObjects(activeNotes));
    }
    if (event.ctrlKey && event.key === V) {
      dispatch(removeSelectedNotes());
      const deltaPosition =
        currentBit - Math.min(...copiedObjects.map((obj) => obj.attackTime));
      const pastedObjects = copiedObjects.map((obj) => ({
        ...obj,
        attackTime: obj.attackTime + deltaPosition
      }));
      dispatch(addNotes(pastedObjects));
    }
    if (event.ctrlKey && !event.shiftKey && event.key === Z) {
      navigate(-1);
    }
    if (event.ctrlKey && event.shiftKey && event.key === Z) {
      navigate(1);
    }
    if (event.key === BACKSPACE) {
      const activeNotesIndex = notesArray.map((note, index) => {
        if (note.isSelected) return index;
      });
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
          if (note.isSelected) {
            dispatch(
              updateNoteDuration({
                index,
                duration: Math.max(
                  note.duration +
                    Math.min(
                      deltaDuration,
                      drawableField.columnsCount -
                        (note.attackTime + note.duration)
                    ),
                  1
                )
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
        moveNote(coordinates.x * xMultiplier, coordinates.y * yMultiplier);
      }
    }
  };

  const dragNoteHandler = (e: DraggableEvent, position: DraggableData) => {
    setIsDragg(true);
    e.preventDefault();
    moveNote(
      position.deltaX / drawableField.elementWidth,
      position.deltaY / drawableField.elementHeight
    );
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
        if (note.isSelected) {
          dispatch(
            updateNoteDuration({
              index,
              duration: clamp(
                round(
                  (note.duration * drawableField.elementWidth + curDeltaSize) /
                    drawableField.elementWidth
                ),
                1,
                drawableField.columnsCount - note.attackTime
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

  const changeSelectedNoteHandler = (e: React.MouseEvent, index1: number) => {
    if (!notesArray[index1].isSelected) {
      if (e.shiftKey) {
        dispatch(addSelectedNote(index1));
      } else {
        dispatch(changeSelectedNote({ index: index1, isSelected: true }));
      }
    }
  };

  const NoteMouseUpHandler = (e: React.MouseEvent, index1: number) => {
    if (!isDragg && !isResizing && !e.shiftKey) {
      dispatch(changeSelectedNote({ index: index1, isSelected: true }));
    }
    setIsDragg(false);
    setIsBlockedCreation(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', KeyDownHandler);
    return () => {
      document.removeEventListener('keydown', KeyDownHandler);
    };
  }, [notesArray, currentBit, copiedObjects]);

  const renderArray = () =>
    notesArray?.map((element, index) => (
      <DraggableNote
        key={index}
        x={element.attackTime}
        y={element.note}
        size={element.duration}
        index={index}
        isSelected={element.isSelected}
        isActive={element.isActive}
        onDrag={dragNoteHandler}
        onMouseDown={changeSelectedNoteHandler}
        onMouseUp={NoteMouseUpHandler}
        onRightClick={deleteNoteHandler}
        onSizeableClick={resizeNoteHandler}
      />
    ));

  return (
    <>
      <CreationField className={className}
        isblockedCreation={isblockedCreation}
        setIsBlockedCreation={setIsBlockedCreation}
      />
      {renderArray()}
    </>
  );
};

export default NoteManager;
