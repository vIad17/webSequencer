import { useCallback, useEffect, useRef, useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';

import {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  BACKSPACE,
  DEL,
  C,
  ESCAPE,
  V,
  D,
  X,
  Z
} from 'src/shared/const/KeyboardKeys';
import { clamp, round } from 'src/shared/functions/math';
import {
  addSelectedNote,
  addNotes,
  changeSelectedNote,
  deleteNote,
  deleteSelectedNotes,
  removeSelectedNotes,
  setDeltaSize,
  updateNoteDuration,
  updateNotePosition
} from 'src/shared/redux/slices/notesArraySlice';
import { RootState } from 'src/shared/redux/store/store';

import CreationField from '../CreationField/CreationField';
import DraggableNote from '../DraggableNote/DraggableNote';
import { setCopiedObjects } from 'src/shared/redux/slices/copiedObjectsSlise';
import { useNavigate } from 'react-router-dom';
import { Note } from 'src/shared/interfaces';
import { setIsDragging } from 'src/shared/redux/slices/userSlice';

const moveByGreed = {
  ArrowUp: { x: 0, y: -1 },
  ArrowRight: { x: 1, y: 0 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }
};

interface NoteManagerProps {
  className?: string;
  isEditable?: boolean;
}

const NoteManager = ({ className, isEditable = true }: NoteManagerProps) => {
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

  const pressedKeysRef = useRef<Set<string>>(new Set());

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const notesArrayRef = useRef(notesArray);
  useEffect(() => {
    notesArrayRef.current = notesArray;
  }, [notesArray]);

  const moveNote = useCallback(
    (deltaX: number, deltaY: number) => {
      let localDeltaX = deltaX;
      let localDeltaY = deltaY;

      notesArrayRef.current.forEach((note) => {
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

      notesArrayRef.current.forEach((note, index) => {
        note.isSelected &&
          dispatch(
            updateNotePosition({
              index,
              attackTime: note.attackTime + localDeltaX,
              note: note.note + localDeltaY
            })
          );
      });
    },
    [dispatch, drawableField.columnsCount, drawableField.rowsCount]
  );

  const KeyDownHandler = (event: KeyboardEvent) => {
    if (pressedKeysRef.current.has(event.key)) {
      event.preventDefault();
      return; // Key already pressed, ignore repeat
    }

    switch (event.code) {
      case ESCAPE:
        dispatch(removeSelectedNotes());
        break;
      case C:
        if (event.ctrlKey) {
          const activeNotes = notesArray.filter((note) => note.isSelected);
          dispatch(setCopiedObjects(activeNotes));
        }
        break;
      case X:
        if (event.ctrlKey) {
          const activeNotes = notesArray.filter((note) => note.isSelected);
          dispatch(setCopiedObjects(activeNotes));
          dispatch(deleteSelectedNotes());
        }
        break;
      case V:
        if (event.ctrlKey) {
          dispatch(removeSelectedNotes());
          const deltaPosition =
            currentBit -
            Math.min(...copiedObjects.map((obj) => obj.attackTime));
          const pastedObjects = copiedObjects.map((obj) => ({
            ...obj,
            attackTime: obj.attackTime + deltaPosition
          }));
          dispatch(addNotes(pastedObjects));
        }
        break;
      case D:
        if (event.ctrlKey) {
          const activeNotes = notesArray.filter((note) => note.isSelected);
          dispatch(removeSelectedNotes());
          const deltaPosition = Math.max(
            ...activeNotes.map((obj) => obj.duration)
          );
          const pastedObjects = activeNotes.map((obj) => ({
            ...obj,
            attackTime: obj.attackTime + deltaPosition
          }));
          dispatch(addNotes(pastedObjects));
        }
        break;
      case Z:
        if (event.ctrlKey) {
          navigate(event.shiftKey ? 1 : -1);
        }
        break;

      case BACKSPACE:
      case DEL:
        dispatch(deleteSelectedNotes());
        break;

      case ARROW_UP:
      case ARROW_RIGHT:
      case ARROW_DOWN:
      case ARROW_LEFT:
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
          const coordinates =
            moveByGreed[event.key as keyof typeof moveByGreed];
          moveNote(coordinates.x * xMultiplier, coordinates.y * yMultiplier);
        }
        break;

      default:
        return;
    }

    pressedKeysRef.current.add(event.key);
    event.preventDefault();
  };

  const KeyUpHandler = useCallback((e: KeyboardEvent) => {
    pressedKeysRef.current.delete(e.key);
  }, []);

  const dragNoteHandler = useCallback(
    (e: DraggableEvent, position: DraggableData) => {
      setIsDragg(true);
      e.preventDefault();
      moveNote(
        position.deltaX / drawableField.elementWidth,
        position.deltaY / drawableField.elementHeight
      );
    },
    [moveNote]
  );

  const deleteNoteHandler = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      dispatch(deleteNote(index));
    },
    [dispatch]
  );

  const resizeNoteHandler = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      setIsBlockedCreation(true);
      let curDeltaSize = 0;

      function onMouseMove(mouseMoveEvent: MouseEvent) {
        setIsResizing(true);
        curDeltaSize = mouseMoveEvent.pageX - mouseDownEvent.pageX;
        dispatch(setDeltaSize(curDeltaSize));
      }

      function onMouseUp(localNotesArray: Note[]) {
        setIsResizing(false);
        document.body.removeEventListener('mousemove', onMouseMove);

        localNotesArray.forEach((note, index) => {
          if (note.isSelected) {
            dispatch(
              updateNoteDuration({
                index,
                duration: clamp(
                  round(
                    (note.duration * drawableField.elementWidth +
                      curDeltaSize) /
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
      document.body.addEventListener(
        'mouseup',
        () => onMouseUp(notesArrayRef.current),
        { once: true }
      );
    },
    [
      dispatch,
      setIsBlockedCreation,
      setIsResizing,
      drawableField.elementWidth,
      drawableField.columnsCount
    ]
  );

  const ChangeSelectedNoteHandler = useCallback(
    (e: React.MouseEvent, i: number) => {
      if (!isEditable) return;

      if (!notesArrayRef.current[i].isSelected) {
        if (e.shiftKey) {
          dispatch(addSelectedNote(i));
        } else {
          dispatch(changeSelectedNote({ index: i, isSelected: true }));
        }
      }

      dispatch(setIsDragging(true));
    },
    [dispatch, addSelectedNote, changeSelectedNote]
  );

  const NoteMouseUpHandler = useCallback(
    (e: React.MouseEvent, index1: number) => {
      if (!isEditable) return;

      if (!isDragg && !isResizing && !e.shiftKey) {
        dispatch(changeSelectedNote({ index: index1, isSelected: true }));
      }
      setIsDragg(false);
      dispatch(setIsDragging(false));
      setIsBlockedCreation(false);
    },
    [isDragg, isResizing, dispatch]
  );

  useEffect(() => {
    document.addEventListener('keydown', KeyDownHandler);
    document.addEventListener('keyup', KeyUpHandler);

    return () => {
      document.removeEventListener('keydown', KeyDownHandler);
      document.removeEventListener('keyup', KeyUpHandler);
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
        isEditable={isEditable}
        onDrag={dragNoteHandler}
        onMouseDown={ChangeSelectedNoteHandler}
        onMouseUp={NoteMouseUpHandler}
        onRightClick={deleteNoteHandler}
        onSizeableClick={resizeNoteHandler}
      />
    ));

  return (
    <>
      <CreationField
        className={className}
        isblockedCreation={isblockedCreation || !isEditable}
        setIsBlockedCreation={setIsBlockedCreation}
      />
      {renderArray()}
    </>
  );
};

export default NoteManager;
