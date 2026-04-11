import { ReactNode, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './FXTremolo.scss';

import { RootState } from 'src/shared/redux/store/store';
import { useSelector, useDispatch } from 'react-redux';

import { graphSIN } from 'src/shared/functions/waveforms';
import EffectCard from '../EffectCard';
import KnobInput from '../../KnobInput/KnobInput';
import { selectEffectById, selectEffectParamsById } from 'src/shared/hooks/selectors';
import { EffectParamsTremollo, setEffectParams } from 'src/shared/redux/slices/effectsParamsSlice';
import { GetChain } from 'src/app/SoundManager';
import { Tremolo } from 'tone';

interface FXTremoloProps {
  className?: string;
  name?: string;
  id: string;
}

const FXTremolo = ({ name = '', className, id }: FXTremoloProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dispatch = useDispatch();

  const effect = useSelector((state: RootState) => selectEffectParamsById(state, id));
  const effectParams = effect?.params as EffectParamsTremollo;

  useEffect(() => {
    if (effectParams != null) {
      const fxNode = GetChain().getFX(id)?.node;
      if (fxNode instanceof Tremolo) {
        fxNode.frequency.value = effectParams.tremoloFrequency;
        fxNode.depth.value = effectParams.tremoloDepth;
      }
    }
  }, []);

  const setTremoloFrequency = (value: number) => {
    dispatch(setEffectParams({ id, params: { ...effectParams, tremoloFrequency: value } }));
    const fxNode = GetChain().getFX(id)?.node;
    if (fxNode instanceof Tremolo) {
      fxNode.frequency.value = value;
    }
  }

  const setTremoloDepth = (value: number) => {
    dispatch(setEffectParams({ id, params: { ...effectParams, tremoloDepth: value } }));
    const fxNode = GetChain().getFX(id)?.node;
    if (fxNode instanceof Tremolo) {
      fxNode.depth.value = value;
    }
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


    const sineData = d3.range(0.001, cols, 0.005).map((x) => ({
      x,
      y: (graphSIN((x - 2) * (effectParams?.tremoloFrequency ?? 1)) * 1.5 * (effectParams?.tremoloDepth ?? 1) + 2)
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
  }, [effectParams?.tremoloDepth, effectParams?.tremoloFrequency]);

  return (
    <EffectCard name={'Tremolo'} width={230} id={id} children={
      <div className="effect__content_inner">
        <svg ref={svgRef} className="synth__graph" />
        <div className='Effect_knobs_horizontal'>
          <KnobInput
            value={effectParams?.tremoloFrequency ?? 0}
            setValue={setTremoloFrequency}
            min={0}
            max={10}
            step={0.01}
            label="frequency"
            showValue={false}
            lockMouse={true}
          />
          <KnobInput
            value={effectParams?.tremoloDepth ?? 0}
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