import { useDispatch } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';

import './SoundSettings.scss';
import clsx from 'clsx';

interface RangeSettingProps {
  className?: string
  value: number | null;
  setValue: (arg1: number) => AnyAction;
  min: number;
  max: number;
  step: number;
  label: string;
  hideText?: boolean;
}

const RangeSetting = ({
  className,
  value,
  setValue,
  min,
  max,
  step,
  label,
  hideText = false
}: RangeSettingProps) => {
  const dispatch = useDispatch();

  return value !== null ? (
    <li className={clsx("sound-settings__element", className)}>
      {!hideText && <p className="sound-settings__name">{label}</p>}
      <label className="sound-settings__label" htmlFor={label}>
        <div className='sound-settings__range_bg' style={{ '--_settings-range-value': `${((value - min) / (max - min)) * 100}%` }}>
          <input
            id={label}
            className="sound-settings__range"
            type="range"
            min={min}
            max={max}
            step={step}
            defaultValue={value}
            onChange={(event) => dispatch(setValue(event.target.valueAsNumber))}
          />
        </div>
        
        {!hideText && <p className="sound-settings__range-value">{value}</p>}
      </label>
    </li>
  ) : (
    <></>
  );
};

export default RangeSetting;
