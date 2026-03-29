import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useDispatch, useSelector } from 'react-redux';

import { pitchNotes } from 'src/shared/const/notes';
import { setColumnsCount } from 'src/shared/redux/slices/drawableFieldSlice';
import { RootState } from 'src/shared/redux/store/store';

import './NoteGrid.scss';

interface NoteGridProps {
  className?: string;
}

const NoteGrid = ({ className = '' }: NoteGridProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const drawableField = useSelector((state: RootState) => state.drawableField);
  const tactsCount =
    useSelector((state: RootState) => state.settings.tacts) ?? 8;
  const plaingNotes = useSelector(
    (state: RootState) => state.notesArray.playingNotes
  );

  const elemWidth = drawableField.elementWidth;
  const elemHeight = drawableField.elementHeight;
  const columnCount = drawableField.columnsCount;
  const rowsCount = drawableField.rowsCount;

  const dispatch = useDispatch();

  useEffect(() => {
    if (tactsCount) {
      dispatch(setColumnsCount(tactsCount * 16));
    }
  }, [tactsCount, dispatch]);

  const drawGrid = () => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', elemWidth * columnCount)
      .attr('height', elemHeight * rowsCount);

    for (let i = 0; i <= rowsCount; i++) {
      const isPlaying = plaingNotes.includes(pitchNotes[i]);
      const isBlack = pitchNotes[i]?.charAt(1) === '#';
      
      const color = isBlack 
        ? isPlaying ? '#350b46' : '#030918'
        : isPlaying ? '#331654' : '#001629';

      svg
        .append('rect')
        .attr('x', 0)
        .attr('y', i * elemHeight)
        .attr('width', elemWidth * columnCount)
        .attr('height', elemHeight)
        .attr('fill', color);
    }

    for (let x = 0; x <= columnCount; x++) {
      svg
        .append('line')
        .attr('x1', x * elemWidth)
        .attr('y1', 0)
        .attr('x2', x * elemWidth)
        .attr('y2', rowsCount * elemHeight)
        .attr('stroke', '#FFFFFF')
        .attr('opacity', 0.4)
        .attr('stroke-width', x % 16 === 0 ? 4 : 1);
    }

    for (let y = 0; y <= rowsCount; y++) {
      svg
        .append('line')
        .attr('x1', 0)
        .attr('y1', y * elemHeight)
        .attr('x2', elemWidth * columnCount)
        .attr('y2', y * elemHeight)
        .attr('stroke', '#FFFFFF')
        .attr('opacity', 0.4)
        .attr('stroke-width', 1);
    }
  };

  useEffect(() => {
    if (tactsCount && svgRef.current) {
      drawGrid();
    }
  }, [elemWidth, elemHeight, columnCount, rowsCount, tactsCount, plaingNotes]);

  if (!tactsCount) return null;

  return (
    <svg
      ref={svgRef}
      className={`grid ${className}`}
      style={{ display: 'block' }}
    />
  );
};

export default NoteGrid;
