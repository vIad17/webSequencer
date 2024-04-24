import { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import { useDispatch, useSelector } from 'react-redux';

import p5 from 'p5';

import { pitchNotes } from 'src/shared/const/notes';
import { setColumnsCount } from 'src/shared/redux/slices/drawableFieldSlice';
import { RootState } from 'src/shared/redux/store/store';

import p5svg, { p5SVG } from 'p5.js-svg';

import './NoteGrid.scss';

p5svg(p5);

interface NoteGridProps {
  className?: string;
}

const NoteGrid = ({ className = '' }: NoteGridProps) => {
  const [p5, setP5] = useState<p5>();

  const drawableField = useSelector((state: RootState) => state.drawableField);
  const tactsCount = useSelector((state: RootState) => state.settings.tacts);

  const elemWidth = drawableField.elementWidth;
  const elemHeight = drawableField.elementHeight;
  const columnCount = drawableField.columnsCount;
  const rowsCount = drawableField.rowsCount;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setColumnsCount(tactsCount * 16));
  }, []);

  useEffect(() => {
    if (p5) {
      p5.resizeCanvas(elemWidth * columnCount, elemHeight * rowsCount);
    }
  }, [drawableField, tactsCount]);

  const setup = (p5: p5SVG, canvasParentRef: Element) => {
    setP5(p5);
    p5.createCanvas(
      elemWidth * columnCount,
      elemHeight * rowsCount,
      p5.SVG // @ts-expect-error: can't declare a p5SVG type
    ).parent(canvasParentRef);
    p5.noLoop();
  };
  const draw = (p5: p5) => {
    setP5(p5);

    for (let i = 0; i <= columnCount / 16; i++) {
      const color = i % 2 === 0 ? '#D3D3D3' : '#C0C0C0';
      p5.fill(color);
      p5.rect(elemWidth * 16 * i, 0, elemWidth * 16, elemHeight * rowsCount);
    }

    p5.fill(0, 0, 0, 50);

    for (let i = 0; i <= rowsCount; i++) {
      if (pitchNotes[i]?.charAt(1) === '#') {
        p5.rect(0, i * elemHeight, elemWidth * columnCount, elemHeight);
      }
    }

    for (let x = 0; x <= columnCount; x++) {
      p5.line(x * elemWidth, 0, x * elemWidth, rowsCount * elemHeight);
      p5.strokeWeight(1);
    }
    for (let y = 0; y <= rowsCount; y++) {
      p5.line(0, y * elemHeight, elemWidth * columnCount, y * elemHeight);
    }
  };

  return (
    <Sketch
      className={`grid ${className}`}
      setup={(p5, canvasParentRef) => setup(p5 as p5SVG, canvasParentRef)}
      draw={draw}
    />
  );
};

export default NoteGrid;
