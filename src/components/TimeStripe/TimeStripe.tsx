import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { round } from 'src/shared/functions/math';
import { setCurrentBit } from 'src/shared/redux/slices/currentMusicSlice';
import { RootState } from 'src/shared/redux/store/store';

import * as d3 from 'd3';

import './TimeStripe.scss';

interface TimeStripeProps {
  className?: string;
}

const stripeHeight = 30;
const triangleWidth = 20;

const TimeStripe = ({ className = '' }: TimeStripeProps) => {
  const bpm = useSelector((state: RootState) => state.settings.bpm);
  const currentBit = useSelector((state: RootState) => state.currentMusic.currentBit);
  const isPlaying = useSelector((state: RootState) => state.currentMusic.isPlaying);
  const drawableField = useSelector((state: RootState) => state.drawableField);
  const elementWidth = drawableField.elementWidth;
  const columnsCount = drawableField.columnsCount;

  const dispatch = useDispatch();

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Handle click on SVG to set current bit
  const onClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const bit = round(offsetX, elementWidth) / elementWidth;
    dispatch(setCurrentBit(bit));
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.attr('width', elementWidth * columnsCount)
       .attr('height', stripeHeight)
       .style('cursor', 'pointer');

    svg.selectAll('*').remove();

    svg.append('circle')
    .attr('cx', triangleWidth / 2)
    .attr('cy', stripeHeight / 1.5)
    .attr('r', 8)
    .attr('fill', '#fff');
  
    svg.append('line')
      .attr('x1', elementWidth / 2  - 2)
      .attr('y1', stripeHeight / 2)
      .attr('x2', elementWidth / 2 - 2)
      .attr('y2', "100%")
      .attr('stroke', '#fff')
      .attr('stroke-width', 6);

  }, [elementWidth, columnsCount]);

  if (!bpm) return null;

  return (
    <div
      className={`time-stripe ${isPlaying ? 'time-stripe_animated ' : ''}${className}`}
      style={{
        '--x': `${currentBit * elementWidth - 10}px`,
        '--anim-time': `${60 / (bpm * 4)}s`
      } as React.CSSProperties}
    >
        <svg
          ref={svgRef}
          className="time-stripe__timeline"
          onClick={onClick}
          role="img"
          aria-label="Time stripe timeline"
        />
    </div>
  );
};

export default TimeStripe;
