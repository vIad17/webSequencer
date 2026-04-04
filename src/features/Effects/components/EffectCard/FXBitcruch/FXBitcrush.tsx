import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './FXBitcrush.scss';

import { RootState } from 'src/shared/redux/store/store';
import { useSelector, useDispatch } from 'react-redux';

import { graphSIN } from 'src/shared/functions/waveforms';
import EffectCard from '../EffectCard';
import KnobInput from '../../KnobInput/KnobInput';
import { EffectParamsBits, setEffectParams } from 'src/shared/redux/slices/effectsSlice';

interface FXBitcrushProps {
  className?: string;
  name?: string;
  id: string;
}

const FXBitcrush = ({ name = '', className, id }: FXBitcrushProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dispatch = useDispatch();

  const effect = useSelector((state: RootState) => state.effects.effects).find(el => el.id === id);
  const effectParams = effect?.params as EffectParamsBits;

  const setBits = (value: number) => {
    dispatch(setEffectParams({ id, params: { ...effectParams, bits: value } }));
  }

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

    const bits = effectParams.bits ?? 16;

    const sineData = d3.range(0.001, cols, 0.005).map((x) => ({
      x,
      y: Math.round((graphSIN(x) * 1.5 + 2) * bits) / bits
    }));

    const lineGenerator = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveLinear);

    svg
      .append('path')
      .datum(sineData)
      .attr('class', 'sine-wave FXgraph-line')
      .attr('d', lineGenerator)
  };


  useEffect(() => {
    const width = 230;
    const height = 100;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    drawSketch(svg, width, height);
  }, [effectParams.bits]);

  return (
    <EffectCard name={'Bitcrush'} width={230} id={id} children={
      <div className="effect__content_inner">
        <svg ref={svgRef} className="synth__graph" />
        <div className='Effect_knobs_horizontal'>
          <KnobInput
            value={effectParams.bits ?? 16}
            setValue={setBits}
            min={1}
            max={16}
            step={0.1}
            label="bits"
            showValue={false}
            lockMouse={true}
          />
        </div>
      </div>
    }>
    </EffectCard>
  );
};

export default FXBitcrush;