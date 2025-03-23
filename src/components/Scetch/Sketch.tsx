import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as Tone from 'tone';
import './Sketch.scss';

interface MySketchProps {
  className?: string;
}

const drawSketch = (
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
  buffer: Float32Array<ArrayBufferLike>,
  width: number,
  height: number
) => {
  svg.selectAll('*').remove();

  let start = 0;
  for (let i = 1; i < buffer.length; i++) {
    if (buffer[i - 1] < 0 && buffer[i] >= 0) {
      start = i;
      break;
    }
  }

  const x = d3
    .scaleLinear()
    .domain([0, buffer.length / 2])
    .range([0, width]);

  const y = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

  const line = d3
    .area<number>()
    .x((_, i) => x(i))
    .y0(height)
    .y1((d) => y(d));

  const defs = svg.append('defs');
  const linearGradient = defs
    .append('linearGradient')
    .attr('id', 'MyGradient')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', '100%')
    .attr('y2', 0);
  linearGradient.append('stop').attr('offset', 0).attr('stop-color', '#06071F');
  linearGradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#033B71');

  svg
    .append('path')
    .datum(buffer.slice(start, buffer.length / 2 + start + 3))
    .attr('class', 'sketch__line')
    .attr('stroke', '#FD8DC2')
    .attr('stroke-width', 3)
    .attr('d', line)
    .attr('fill', 'url(#MyGradient)');
};

const MySketch = ({ className = '' }: MySketchProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const waveform = new Tone.Waveform();
  Tone.Master.connect(waveform);

  useEffect(() => {
    const width = 400;
    const height = 400;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    drawSketch(svg, waveform.getValue(), width, height);

    const updateWaveform = () => {
      const buffer = waveform.getValue();

      if (!(buffer[0] >= -0.001 && buffer[0] <= 0.001)) {
        drawSketch(svg, buffer, width, height);
      }
      requestAnimationFrame(updateWaveform);
    };

    updateWaveform();

    return () => {
      svg.selectAll('*').remove();
    };
  }, []);

  return <svg ref={svgRef} className={`sketch ${className}`}></svg>;
};

export default MySketch;
