import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as d3 from 'd3';

import { RootState } from 'src/shared/redux/store/store';

import { rewindMusic } from 'src/app/SoundManager';

import './TactsNumbers.scss';
import clsx from 'clsx';

interface TactsNumbersProps {
  className?: string;
}

const TactsNumbers = ({ className = '' }: TactsNumbersProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const bRewindActiveRef = useRef(false);

  const tactsCounter = useSelector((state: RootState) => state.settings.tacts);
  const elementWidth = useSelector(
    (state: RootState) => state.drawableField.elementWidth
  );

  const totalBits = (tactsCounter ?? 0) * 16;

  const handleGlobalMouseUp = useCallback(() => {
    bRewindActiveRef.current = false;
    document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const drawGrid = () => {
    if (!svgRef.current) return;

    // Очистим SVG перед рисованием
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', elementWidth * totalBits)
      .attr('height', 30);

    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', elementWidth * totalBits)
      .attr('height', 30)
      .attr('fill', '#030918');

    // Рисуем вертикальные линии сетки
    for (let x = 0; x <= totalBits; x++) {
      svg
        .append('line')
        .attr('x1', x * elementWidth)
        .attr('y1', 0)
        .attr('x2', x * elementWidth)
        .attr('y2', 30)
        .attr('stroke', '#FFFFFF')
        .attr('opacity', 0.4)
        .attr('stroke-width', x % 16 === 0 ? 4 : 1);
    }

    // Рисуем горизонтальные линии сетки
    svg
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', elementWidth * totalBits)
      .attr('y2', 0)
      .attr('stroke', '#FFFFFF')
      .attr('opacity', 0.4)
      .attr('stroke-width', 1);
  };

  // Перерисовываем сетку при изменениях параметров
  useEffect(() => {
    if (svgRef.current) {
      drawGrid();
    }
  }, [elementWidth, totalBits]);

  useEffect(() => {
    //document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseUp]);

  const handleMouseDownTacts = (event: React.MouseEvent<HTMLButtonElement>) => {
    document.addEventListener('mouseup', handleGlobalMouseUp);
    bRewindActiveRef.current = true;
    handleRewindTacts(event);
  };

  const handleRewindTacts = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!bRewindActiveRef.current) return;
    if (!tactsCounter) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - rect.left - 50;
    const totalWidth = svgRef.current?.width.baseVal.value ?? 1;
    const clickPosition = relativeX / totalWidth;

    const targetBit = Math.round(clickPosition * totalBits);

    rewindMusic(targetBit);
  };

  const renderTactsNumber = () =>
    Array.from({ length: tactsCounter ?? 0 }, (_, i) => (
      <div
        className={clsx('tacts-number__tact', {
          'tacts-number__tact_first': i === 0
        })}
        key={i}
        style={{ '--width': `${elementWidth * 16}px` }}
      >
        <p className="tacts-number__tact-text">{i}</p>
      </div>
    ));

  return (
    <div
      className={`tacts-number ${className}`}
      style={{ '--width': `${elementWidth * 16}px` }}
      //onClick={handleClickTacts}
      // onMouseDown={handleMouseDownTacts}
      // onMouseMove={handleRewindTacts}
    >
      <div className="tacts-number__empty" />
      <button
      className="tacts-number__background"
        onMouseDown={handleMouseDownTacts}
        onMouseMove={handleRewindTacts}
      >
        <svg ref={svgRef}
        className="tacts-number__background" 
        />
      </button>
      {/* <TimeStripe className="tacts-number__time-stripe" /> */}
      {renderTactsNumber()}
    </div>
  );
};

export default TactsNumbers;
