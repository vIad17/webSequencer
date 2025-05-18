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
  const tactsCount = useSelector((state: RootState) => state.settings.tacts) ?? 8;

  const elemWidth = drawableField.elementWidth;
  const elemHeight = drawableField.elementHeight;
  const columnCount = drawableField.columnsCount;
  const rowsCount = drawableField.rowsCount;

  const dispatch = useDispatch();

  // При изменении tactsCount устанавливаем columnsCount
  useEffect(() => {
    if (tactsCount) {
      dispatch(setColumnsCount(tactsCount * 16));
    }
  }, [tactsCount, dispatch]);

  // Функция отрисовки сетки с помощью d3
  const drawGrid = () => {
    if (!svgRef.current) return;

    // Очистим SVG перед рисованием
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', elemWidth * columnCount)
      .attr('height', elemHeight * rowsCount);

    // Рисуем полосы по 16 колонок с разным цветом
    // const bandCount = Math.ceil(columnCount / 16);
    // for (let i = 0; i <= bandCount; i++) {
    //   svg.append('rect')
    //     .attr('x', elemWidth * 16 * i)
    //     .attr('y', 0)
    //     .attr('width', elemWidth * 16)
    //     .attr('height', elemHeight * rowsCount)
    //     .attr('fill', i % 2 === 0 ? '#D3D3D3' : '#C0C0C0');
    // }

    // Рисуем затемнённые полосы для нот с #
    for (let i = 0; i <= rowsCount; i++) {
      if (pitchNotes[i]?.charAt(1) !== '#') {
        svg
          .append('rect')
          .attr('x', 0)
          .attr('y', i * elemHeight)
          .attr('width', elemWidth * columnCount)
          .attr('height', elemHeight)
          .attr('fill', '#001629');
      }
    }

    // Рисуем вертикальные линии сетки
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

    // Рисуем горизонтальные линии сетки
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

  // Перерисовываем сетку при изменениях параметров
  useEffect(() => {
    if (tactsCount && svgRef.current) {
      drawGrid();
    }
  }, [elemWidth, elemHeight, columnCount, rowsCount, tactsCount]);

  // Если tactsCount нет - ничего не рендерим
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
