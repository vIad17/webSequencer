import { ReactNode, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './FXBitcrush.scss';

import { setBits } from 'src/shared/redux/slices/soundSettingsSlice';

import { RootState } from 'src/shared/redux/store/store';
import { useSelector, useDispatch } from 'react-redux';

import { graphSAW, graphSIN, graphSQR, graphTRI } from 'src/shared/functions/waveforms';
import EffectCard from '../EffectCard';
import KnobInput from '../../KnobInput/KnobInput';

interface FXBitcrushProps {
  className?: string;
  name: string;
}

// const EffectIcon = ({ icon }: { icon: string }) => {
//   return <div className="effect-icon">{icon[0]}</div>;
// };

const FXBitcrush = ({ name = '', className }: FXBitcrushProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dispatch = useDispatch();
  const soundSettings = useSelector((state: RootState) => state.soundSettings);

  const drawSketch = (
    svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>,
    width: number,
    height: number
  ) => {
    svg.selectAll('*').remove();

    const rows = 4;
    const cols = 4;

    const xScale = d3.scaleLinear().domain([0, cols]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, rows]).range([height, 0]);

    // Grid lines
    svg
      .selectAll('line.vertical')
      .data(d3.range(cols + 1))
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', (d) => xScale(d))
      .attr('y1', 0)
      .attr('x2', (d) => xScale(d))
      .attr('y2', height);

    svg
      .selectAll('line.horizontal')
      .data(d3.range(rows + 1))
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('y1', (d) => yScale(d))
      .attr('x2', width)
      .attr('y2', (d) => yScale(d));

    const bits = soundSettings.bits??16;

    const sineData = d3.range(0.001, cols, 0.005).map((x) => ({
      x,
      y: Math.round((graphSIN(x)*1.5+2) * bits)/bits
    }));

    const lineGenerator = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveLinear);

    svg
      .append('path')
      .datum(sineData)
      .attr('class', 'sine-wave')
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 3);
  };
  

  useEffect(() => {
    const width = 230;
    const height = 130;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    drawSketch(svg, width, height);
  }, [soundSettings.bits]);

  return (
    <EffectCard name={'Bitcrush'} children={
      <div className="bitcrush-content">
      <svg ref={svgRef} className="synth__graph" />
      <KnobInput 
        value={soundSettings.bits ?? 16}
        setValue={setBits}
        min={1}
        max={16}
        step={0.1}
        label="bits"
        showValue={false}
        lockMouse={true}
        />
      </div>
      }>
    </EffectCard>
  );
};

export default FXBitcrush;