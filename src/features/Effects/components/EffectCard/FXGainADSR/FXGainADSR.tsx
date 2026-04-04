import { ReactNode, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './FXGainADSR.scss';

import { RootState } from 'src/shared/redux/store/store';
import { useSelector, useDispatch } from 'react-redux';

import EffectCard from '../EffectCard';
import KnobInput from '../../KnobInput/KnobInput';
import { EffectParamsADSR, setEffectParams } from 'src/shared/redux/slices/effectsSlice';

interface FXGainADSRProps {
  className?: string;
  name?: string;
  id: string;
}

const FXGainADSR = ({ name = '', className, id }: FXGainADSRProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dispatch = useDispatch();

  const effect = useSelector((state: RootState) => state.effects.effects).find(el => el.id === id);
  const effectParams = effect?.params as EffectParamsADSR;

  const setAttack = (value: number) => {
    dispatch(setEffectParams({ id, params: { ...effectParams, attack: value } }));
  }

  const setDecay = (value: number) => {
    dispatch(setEffectParams({ id, params: { ...effectParams, decay: value } }));
  }

  const setSustain = (value: number) => {
    dispatch(setEffectParams({ id, params: { ...effectParams, sustain: value } }));
  }

  const setRelease = (value: number) => {
    dispatch(setEffectParams({ id, params: { ...effectParams, release: value } }));
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

    const attack = Math.max((effectParams.attack ?? 0) / 2.0, 0.0001);
    const decay = Math.max((effectParams.decay ?? 0) / 2.0, 0.0001);
    const sustain = effectParams.sustain ?? 1;
    const release = Math.max((effectParams.release ?? 0) / 5.0, 0.0001);

    // Define key ADSR points in data space (x: time, y: amplitude)
    const points = [
      { id: 'attack', x: attack, y: 4 },
      { id: 'decay', x: attack + decay, y: sustain * 4 },
      { id: 'sustain', x: attack + decay + 1, y: sustain * 4 }, // fixed sustain duration = 1
      { id: 'release', x: attack + decay + 1 + release, y: 0 },
    ];

    // Generate waveform data
    const sineData = d3
      .range(0.001, cols, 0.005)
      .map((x) => {
        let y;
        if (x < attack) {
          y = x / attack; // attack
        } else if (x < attack + decay) {
          y = 1 - ((x - attack) / decay) * (1 - sustain); // decay
        } else if (x < attack + decay + 1) {
          y = sustain; // sustain
        } else {
          const rel = x - (attack + decay + 1);
          y = Math.max(0, (1 - rel / release) * sustain); // release
        }
        y *= 4;
        return { x, y };
      });

    const lineGenerator = d3
      .line<{ x: number; y: number }>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveLinear);

    // Draw waveform
    svg
      .append('path')
      .datum(sineData)
      .attr('class', 'FXgraph-line')
      .attr('d', lineGenerator)

    const svgNode = svg.node();

    // Drag behavior
    const drag = d3
      .drag<SVGCircleElement, { id: string; x: number; y: number }>()
      .on('start', function () {
        // d3.select(this).raise().attr('fill', 'orange').attr('r', 6);
        d3.select(this).raise().attr('class', 'draggable-point active');
      })
      .on('drag', function (event, d) {
        const [mouseX, mouseY] = d3.pointer(event, svgNode);

        const xData = xScale.invert(mouseX);
        const yData = yScale.invert(mouseY);

        // Constrain to graph bounds [0, cols] x [0, rows]
        const constrainedX = Math.max(0, Math.min(cols, xData));
        const constrainedY = Math.max(0, Math.min(rows, yData));

        let newAttack = effectParams.attack ?? 0;
        let newDecay = effectParams.decay ?? 0;
        let newSustain = effectParams.sustain ?? 1;
        let newRelease = effectParams.release ?? 0;

        if (d.id === 'attack') {
          newAttack = Math.min(Math.max(0, constrainedX * 2), 2);
          d.x = constrainedX;
          d.y = 1;
          setAttack(newAttack);
        } else if (d.id === 'decay') {
          newSustain = Math.min(Math.max(0, Math.min(1, constrainedY / 4)), 1);
          newDecay = Math.min(Math.max(0, (constrainedX - attack) * 2), 2);
          d.x = constrainedX;
          d.y = newSustain;
          setDecay(newDecay);
          setSustain(newSustain);
        } else if (d.id === 'sustain') {
          newSustain = Math.max(0, Math.min(1, constrainedY / 4));
          d.y = newSustain;
          setSustain(newSustain);
        } else if (d.id === 'release') {
          newRelease = Math.min(Math.max(0, (constrainedX - (attack + decay + 1)) * 5), 5);
          d.x = constrainedX;
          d.y = 0;
          setRelease(newRelease);
        }

        // Update visual position
        d3.select(this)
          .attr('cx', xScale(d.x))
          .attr('cy', yScale(d.y));
      })
      .on('end', function () {
        // d3.select(this).attr('fill', 'white');
        d3.select(this).attr('class', 'draggable-point');
      });
  }

  useEffect(() => {
    const width = 270;
    const height = 100;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    drawSketch(svg, width, height);
  }, [effectParams.attack, effectParams.decay, effectParams.sustain, effectParams.release]);

  return (
    <EffectCard name={'Gain ADSR'} width={280} id={id} children={
      <div className="effect__content_inner">
        <svg ref={svgRef} className="synth__graph" />
        <div className="Effect_knobs_horizontal">
          <KnobInput
            value={effectParams.attack ?? 1}
            setValue={setAttack}
            min={0}
            max={2}
            step={0.01}
            label="attack"
            showValue={false}
            lockMouse={true}
          />
          <KnobInput
            value={effectParams.decay ?? 1}
            setValue={setDecay}
            min={0}
            max={2}
            step={0.01}
            label="decay"
            showValue={false}
            lockMouse={true}
          />
          <KnobInput
            value={effectParams.sustain ?? 1}
            setValue={setSustain}
            min={0}
            max={1}
            step={0.01}
            label="sustain"
            showValue={false}
            lockMouse={true}
          />
          <KnobInput
            value={effectParams.release ?? 1}
            setValue={setRelease}
            min={0}
            max={5}
            step={0.01}
            label="release"
            showValue={false}
            lockMouse={true}
          />
        </div>
      </div>
    }>
    </EffectCard>
  );
};

export default FXGainADSR;