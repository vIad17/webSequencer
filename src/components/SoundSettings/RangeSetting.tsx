import { useDispatch } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';

import './SoundSettings.scss';
import { setIsDragging } from 'src/shared/redux/slices/userSlice';

interface RangeSettingProps {
  value: number | null;
  setValue: (arg1: number) => AnyAction;
  min: number;
  max: number;
  step: number;
  label: string;
}

const RangeSetting = ({
  value,
  setValue,
  min,
  max,
  step,
  label
}: RangeSettingProps) => {
  const dispatch = useDispatch();

  return value !== null ? (
    <li className="sound-settings__element">
      <p className="sound-settings__name">{label}</p>
      <label className="sound-settings__label" htmlFor={label}>
        <input
          id={label}
          className="sound-settings__range"
          type="range"
          min={min}
          max={max}
          step={step}
          defaultValue={value}
          onMouseDown={() => dispatch(setIsDragging(true))}
          onMouseUp={() => dispatch(setIsDragging(false))}
          onChange={(event) => dispatch(setValue(event.target.valueAsNumber))}
        />
        <p className="sound-settings__range-value">{value}</p>
      </label>
    </li>
  ) : (
    <></>
  );
};

export default RangeSetting;
