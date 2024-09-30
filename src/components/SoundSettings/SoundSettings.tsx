import { useDispatch, useSelector } from 'react-redux';

import {
  setAttack,
  setBits,
  setDecay,
  setDelayTime,
  setDistortion,
  setFeedback,
  setHighFilter,
  setLowFilter,
  setPitchShift,
  setRelease,
  setSustain,
  setTremoloDepth,
  setTremoloFrequency,
  setVolume,
  setWave
} from 'src/shared/redux/slices/soundSettingsSlice';
import { RootState } from 'src/shared/redux/store/store';

import './SoundSettings.scss';
import RangeSetting from './RangeSetting';

interface SoundSettingsProps {
  className?: string;
}

const SoundSettings = ({ className = '' }: SoundSettingsProps) => {
  const soundSettings = useSelector((state: RootState) => state.soundSettings);
  const dispatch = useDispatch();

  return (
    <div className={`sound-settings ${className}`}>
      <ul className="sound-settings__list">
        <RangeSetting
          value={soundSettings.volume}
          setValue={setVolume}
          min={-50}
          max={10}
          step={0.1}
          label="volume"
        />
        <RangeSetting
          value={soundSettings.attack}
          setValue={setAttack}
          min={0}
          max={1}
          step={0.01}
          label="attack"
        />
        <RangeSetting
          value={soundSettings.decay}
          setValue={setDecay}
          min={0}
          max={1}
          step={0.01}
          label="decay"
        />
        <RangeSetting
          value={soundSettings.sustain}
          setValue={setSustain}
          min={0}
          max={1}
          step={0.01}
          label="sustain"
        />

        <RangeSetting
          value={soundSettings.release}
          setValue={setRelease}
          min={0}
          max={1}
          step={0.01}
          label="release"
        />
        <RangeSetting
          value={soundSettings.tremoloFrequency}
          setValue={setTremoloFrequency}
          min={0}
          max={10}
          step={0.01}
          label="tremolo frequency"
        />
        <RangeSetting
          value={soundSettings.tremoloDepth}
          setValue={setTremoloDepth}
          min={0}
          max={1}
          step={0.01}
          label="tremolo depth"
        />
        <RangeSetting
          value={soundSettings.delayTime}
          setValue={setDelayTime}
          min={0}
          max={1}
          step={0.01}
          label="delay time"
        />
        <RangeSetting
          value={soundSettings.feedback}
          setValue={setFeedback}
          min={0}
          max={1}
          step={0.01}
          label="feedback"
        />
        {/* <RangeSetting
          value={soundSettings.distortion}
          setValue={setDistortion}
          min={0}
          max={10}
          step={0.01}
          label="distortion"
        /> */}
        <RangeSetting
          value={soundSettings.bits}
          setValue={setBits}
          min={1}
          max={16}
          step={0.1}
          label="bits"
        />
        <RangeSetting
          value={soundSettings.pitchShift}
          setValue={setPitchShift}
          min={0}
          max={1}
          step={0.01}
          label="pitch shift"
        />
        <RangeSetting
          value={soundSettings.lowFilter}
          setValue={setLowFilter}
          min={20}
          max={8000}
          step={1}
          label="lowFilter"
        />
        <RangeSetting
          value={soundSettings.highFilter}
          setValue={setHighFilter}
          min={20}
          max={8000}
          step={1}
          label="highFilter"
        />
        {soundSettings.wave ? (
          <li className="sound-settings__element sound-settings__element-radio">
            <p className="sound-settings__name">type</p>
            <label className="sound-settings__label" htmlFor="sine">
              <input
                id="sine"
                className="sound-settings__radio"
                type="radio"
                name="wave"
                defaultChecked={soundSettings.wave === 'sine'}
                onChange={() => dispatch(setWave('sine'))}
              />
              <div className="sound-settings__fake-radio" />
              <p className="sound-settings__range-value">sine</p>
            </label>
            <label className="sound-settings__label" htmlFor="square">
              <input
                id="square"
                className="sound-settings__radio"
                type="radio"
                name="wave"
                defaultChecked={soundSettings.wave === 'square'}
                onChange={() => dispatch(setWave('square'))}
              />
              <div className="sound-settings__fake-radio" />
              <p className="sound-settings__range-value">square</p>
            </label>
            <label className="sound-settings__label" htmlFor="sawtooth">
              <input
                id="sawtooth"
                className="sound-settings__radio"
                type="radio"
                name="wave"
                defaultChecked={soundSettings.wave === 'sawtooth'}
                onChange={() => dispatch(setWave('sawtooth'))}
              />
              <div className="sound-settings__fake-radio" />
              <p className="sound-settings__range-value">sawtooth</p>
            </label>
            <label className="sound-settings__label" htmlFor="triangle">
              <input
                id="triangle"
                className="sound-settings__radio"
                type="radio"
                name="wave"
                defaultChecked={soundSettings.wave === 'triangle'}
                onChange={() => dispatch(setWave('triangle'))}
              />
              <div className="sound-settings__fake-radio" />
              <p className="sound-settings__range-value">triangle</p>
            </label>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
};

export default SoundSettings;
