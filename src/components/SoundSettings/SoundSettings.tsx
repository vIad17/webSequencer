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

interface SoundSettingsProps {
  className?: string;
}

const SoundSettings = ({ className = '' }: SoundSettingsProps) => {
  const soundSettings = useSelector((state: RootState) => state.soundSettings);
  const dispatch = useDispatch();

  return (
    <div className={`sound-settings ${className}`}>
      <ul className="sound-settings__list">
        <li className="sound-settings__element">
          <p className="sound-settings__name">volume</p>
          <label className="sound-settings__label" htmlFor="volume">
            <input
              id="volume"
              className="sound-settings__range"
              type="range"
              min="-50"
              max="10"
              step="0.1"
              defaultValue={soundSettings.volume}
              onChange={(event) =>
                dispatch(setVolume(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.volume}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">attack</p>
          <label className="sound-settings__label" htmlFor="attack">
            <input
              id="attack"
              className="sound-settings__range"
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={soundSettings.attack}
              onChange={(event) =>
                dispatch(setAttack(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.attack}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">decay</p>
          <label className="sound-settings__label" htmlFor="decay">
            <input
              id="decay"
              className="sound-settings__range"
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={soundSettings.decay}
              onChange={(event) =>
                dispatch(setDecay(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">{soundSettings.decay}</p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">sustain</p>
          <label className="sound-settings__label" htmlFor="sustain">
            <input
              id="sustain"
              className="sound-settings__range"
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={soundSettings.sustain}
              onChange={(event) =>
                dispatch(setSustain(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.sustain}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">release</p>
          <label className="sound-settings__label" htmlFor="release">
            <input
              id="release"
              className="sound-settings__range"
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={soundSettings.release}
              onChange={(event) =>
                dispatch(setRelease(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.release}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">tremolo frequency</p>
          <label className="sound-settings__label" htmlFor="tremoloFrequency">
            <input
              id="tremoloFrequency"
              className="sound-settings__range"
              type="range"
              min="0"
              max="10"
              step="0.01"
              defaultValue={soundSettings.tremoloFrequency}
              onChange={(event) =>
                dispatch(setTremoloFrequency(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.tremoloFrequency}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">tremolo depth</p>
          <label className="sound-settings__label" htmlFor="tremoloDepth">
            <input
              id="tremoloDepth"
              className="sound-settings__range"
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={soundSettings.tremoloDepth}
              onChange={(event) =>
                dispatch(setTremoloDepth(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.tremoloDepth}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">delay time</p>
          <label className="sound-settings__label" htmlFor="delayTime">
            <input
              id="delayTime"
              className="sound-settings__range"
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={soundSettings.delayTime}
              onChange={(event) =>
                dispatch(setDelayTime(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.delayTime}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">feedback</p>
          <label className="sound-settings__label" htmlFor="feedback">
            <input
              id="feedback"
              className="sound-settings__range"
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={soundSettings.feedback}
              onChange={(event) =>
                dispatch(setFeedback(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.feedback}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">distortion</p>
          <label className="sound-settings__label" htmlFor="distortion">
            <input
              id="distortion"
              className="sound-settings__range"
              type="range"
              min="0"
              max="10"
              step="0.01"
              defaultValue={soundSettings.distortion}
              onChange={(event) =>
                dispatch(setDistortion(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.distortion}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">bits</p>
          <label className="sound-settings__label" htmlFor="bits">
            <input
              id="bits"
              className="sound-settings__range"
              type="range"
              min="1"
              max="16"
              step="0.1"
              defaultValue={soundSettings.bits}
              onChange={(event) =>
                dispatch(setBits(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">{soundSettings.bits}</p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">pitch shift</p>
          <label className="sound-settings__label" htmlFor="pitchShift">
            <input
              id="pitchShift"
              className="sound-settings__range"
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={soundSettings.pitchShift}
              onChange={(event) =>
                dispatch(setPitchShift(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.pitchShift}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">lowFilter</p>
          <label className="sound-settings__label" htmlFor="lowFilter">
            <input
              id="lowFilter"
              className="sound-settings__range"
              type="range"
              min="20"
              max="8000"
              step="1"
              defaultValue={soundSettings.lowFilter}
              onChange={(event) =>
                dispatch(setLowFilter(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.lowFilter}
            </p>
          </label>
        </li>
        <li className="sound-settings__element">
          <p className="sound-settings__name">highFilter</p>
          <label className="sound-settings__label" htmlFor="highFilter">
            <input
              id="highFilter"
              className="sound-settings__range"
              type="range"
              min="20"
              max="8000"
              step="1"
              defaultValue={soundSettings.highFilter}
              onChange={(event) =>
                dispatch(setHighFilter(event.target.valueAsNumber))
              }
            />
            <p className="sound-settings__range-value">
              {soundSettings.highFilter}
            </p>
          </label>
        </li>
        <li className="sound-settings__element sound-settings__element-radio">
          <p className="sound-settings__name">type</p>
          <label className="sound-settings__label" htmlFor="sine">
            <input
              id="sine"
              className="sound-settings__radio"
              type="radio"
              name="wave"
              defaultChecked
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
              onChange={() => dispatch(setWave('triangle'))}
            />
            <div className="sound-settings__fake-radio" />
            <p className="sound-settings__range-value">triangle</p>
          </label>
        </li>
      </ul>
    </div>
  );
};

export default SoundSettings;
