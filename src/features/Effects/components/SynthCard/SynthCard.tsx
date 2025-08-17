import { ReactNode, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './SynthCard.scss';

import { setVolume, setWave } from 'src/shared/redux/slices/soundSettingsSlice';

import { NonCustomOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';
import { RootState } from 'src/shared/redux/store/store';
import { useSelector, useDispatch } from 'react-redux';
import RangeSetting from 'src/components/SoundSettings/RangeSetting';
import clsx from 'clsx';
import { Icon } from 'src/shared/icons/Icon';
import { IconType } from 'src/shared/icons/IconMap';

interface SynthCardProps {
  className?: string;
  name: string;
}

// Waveform functions
function graphSIN(x: number): number {
  return Math.sin(x * Math.PI);
}
function graphTRI(x: number): number {
  return Math.abs(((x + 1) % 2) - 1) * 2 - 1;
}
function graphSAW(x: number): number {
  return (x % 1) * 2 - 1;
}
function graphSQR(x: number): number {
  return Math.sign(Math.sin(x * Math.PI));
}

interface WaveType {
  name: NonCustomOscillatorType;
  fn: (x: number) => number;
}

const waveTypes: WaveType[] = [
  { name: 'sine', fn: graphSIN },
  { name: 'triangle', fn: graphTRI },
  { name: 'sawtooth', fn: graphSAW },
  { name: 'square', fn: graphSQR }
];

// const EffectIcon = ({ icon }: { icon: string }) => {
//   return <div className="effect-icon">{icon[0]}</div>;
// };

const SynthCard = ({ name = '', className }: SynthCardProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dispatch = useDispatch();
  const soundSettings = useSelector((state: RootState) => state.soundSettings);

  // Find the current wave index from Redux state
  const getCurrentWaveIndex = (): number => {
    const index = waveTypes.findIndex(
      (wave) => wave.name === soundSettings.wave
    );
    return index === -1 ? 0 : index; // fallback to sine if not found
  };

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

    // Waveform - use the current wave from Redux
    const currentWaveIndex = getCurrentWaveIndex();
    const currentFn = waveTypes[currentWaveIndex].fn;

    // Fixed volume calculation - normalize volume to 0-1 range for amplitude scaling
    const normalizedVolume = Math.max(
      0,
      ((soundSettings.volume ?? 0) + 50) / 60
    );

    const sineData = d3.range(0.001, cols, 0.005).map((x) => ({
      x,
      y: 2 + 1.5 * currentFn(x / 2) * normalizedVolume
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

  const changeWave = (forward: boolean) => {
    const currentIndex = getCurrentWaveIndex();
    const newIndex =
      (currentIndex + (forward ? 1 : -1) + waveTypes.length) % waveTypes.length;
    dispatch(setWave(waveTypes[newIndex].name));
  };

  useEffect(() => {
    const width = 230;
    const height = 130;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    drawSketch(svg, width, height);

    return () => {
      svg.selectAll('*').remove();
    };
  }, [soundSettings.wave, soundSettings.volume]); // Re-run when wave OR volume changes

  // Get current wave name for display
  const currentWaveName = waveTypes[getCurrentWaveIndex()]?.name || 'sine';

  return (
    <div className={clsx('synth', className)}>
      <header className="synth__header">
        <h5 className="synth__header-title">Oscillator</h5>
        {/* <div className="synth__header-icons">
          <EffectIcon icon="hide" />
          <EffectIcon icon="mute" />
        </div> */}
      </header>
      <div className="synth__render">
        <div className="synth__top-menu">
          <button className="synth__button" onClick={() => changeWave(false)}>
            <Icon icon={IconType.ArrowLeft} interactable />
          </button>
          <h3 className="synth__name">{currentWaveName.toUpperCase()}</h3>
          <button className="synth__button" onClick={() => changeWave(true)}>
            <Icon icon={IconType.ArrowRight} interactable />
          </button>
        </div>
        <svg ref={svgRef} className="synth__graph" />
      </div>
      <div className="synth__range-wrap">
        <Icon className="synth__range-icon" icon={IconType.Sound} />
        <RangeSetting
          className="synth__range"
          value={soundSettings.volume}
          setValue={(value) => dispatch(setVolume(value))} // Dispatch the action with value
          min={-50}
          max={10}
          step={0.1}
          label="volume"
          hideText
        />
      </div>
    </div>
  );
};

export default SynthCard;
