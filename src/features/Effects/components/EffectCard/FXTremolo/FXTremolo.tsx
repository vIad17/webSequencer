import { ReactNode, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './FXTremolo.scss';

import { setTremoloFrequency, setTremoloDepth } from 'src/shared/redux/slices/soundSettingsSlice';

import { RootState } from 'src/shared/redux/store/store';
import { useSelector, useDispatch } from 'react-redux';

import { graphSAW, graphSIN, graphSQR, graphTRI } from 'src/shared/functions/waveforms';
import EffectCard from '../EffectCard';
import KnobInput from '../../KnobInput/KnobInput';

interface FXTremoloProps {
  className?: string;
  name: string;
}

const FXTremolo = ({ name = '', className }: FXTremoloProps) => {
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


    const sineData = d3.range(0.001, cols, 0.005).map((x) => ({
      x,
      y: (graphSIN((x-2)* (soundSettings.tremoloFrequency??1))*1.5*(soundSettings.tremoloDepth??1)+2)
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
    const height = 100;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    drawSketch(svg, width, height);
  }, [soundSettings.tremoloDepth, soundSettings.tremoloFrequency]);

  return (
    <EffectCard name={'Tremolo'} children={
      <div className="tremolo-content">
        <svg ref={svgRef} className="synth__graph" />
        <div className='Effect_knobs_horizontal'>
          <KnobInput 
            value={soundSettings.tremoloFrequency}
            setValue={setTremoloFrequency}
            min={0}
            max={10}
            step={0.01}
            label="frequency"
            showValue={false}
            lockMouse={true}
          />
          <KnobInput 
            value={soundSettings.tremoloDepth}
            setValue={setTremoloDepth}
            min={0}
            max={1}
            step={0.01}
            label="depth"
            showValue={false}
            lockMouse={true}
          />
        </div>
      </div>
      }>
    </EffectCard>
  );
};

export default FXTremolo;