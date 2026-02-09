import { ReactNode, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './FXDelay.scss';

import { setTremoloFrequency, setTremoloDepth, setDelayTime, setFeedback } from 'src/shared/redux/slices/soundSettingsSlice';

import { RootState } from 'src/shared/redux/store/store';
import { useSelector, useDispatch } from 'react-redux';

import { graphSAW, graphSIN, graphSQR, graphTRI } from 'src/shared/functions/waveforms';
import EffectCard from '../EffectCard';
import KnobInput from '../../KnobInput/KnobInput';

interface FXDelayProps {
  className?: string;
  name?: string;
  id: string
}

const FXDelay = ({ name = '', className, id }: FXDelayProps) => {
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

    const xScaleDelay = d3.scaleLinear().domain([0, cols*20]).range([2, (width*20*Math.max((soundSettings.delayTime ?? 0), 0.05))-1]);
    
    const delayLineHeight = 50;

    svg
      .selectAll('line.delay')
      .data(d3.range(cols*20 + 1))
      .enter()
      .append('line')
      .attr('class', 'delay-line FXgraph-line')
      .attr('x1', (d) => xScaleDelay(d))
      .attr('y1', (d) => 50-(delayLineHeight*Math.pow((soundSettings.feedback ?? 0),d)))
      .attr('x2', (d) => xScaleDelay(d))
      .attr('y2', (d) => 50+(delayLineHeight*Math.pow((soundSettings.feedback ?? 0),d)));
  };
  

  useEffect(() => {
    const width = 230;
    const height = 100;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    drawSketch(svg, width, height);
  }, [soundSettings.delayTime, soundSettings.feedback]);

  return (
    <EffectCard id={id} name={'Delay'} width={230} children={
      <div className="effect__content_inner">
        <svg ref={svgRef} className="synth__graph" />
        <div className='Effect_knobs_horizontal'>
          <KnobInput 
            value={soundSettings.delayTime}
            setValue={setDelayTime}
            min={0}
            max={1}
            step={0.01}
            label="Time"
            showValue={false}
            lockMouse={true}
          />
          <KnobInput 
            value={soundSettings.feedback}
            setValue={setFeedback}
            min={0}
            max={1}
            step={0.01}
            label="Feedback"
            showValue={false}
            lockMouse={true}
          />
        </div>
      </div>
      }>
    </EffectCard>
  );
};

export default FXDelay;