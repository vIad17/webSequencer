import { useDispatch } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import { Icon } from 'src/shared/icons/Icon';
import { IconType } from 'src/shared/icons/IconMap';
import './KnobInput.scss';

interface KnobInputProps {
  value: number | null;
  setValue: (arg1: number) => AnyAction;
  min: number;
  max: number;
  step: number;
  label: string;
  showValue: boolean;
  lockMouse: boolean;
}

const KnobInput = ({
  value,
  setValue,
  min,
  max,
  step,
  label,
  showValue,
  lockMouse
}: KnobInputProps) => {
  const dispatch = useDispatch();

  // Format value to avoid floating point precision issues
  const formatValue = (val: number): number => {
    // Calculate decimal places in step
    const stepDecimalPlaces = step.toString().split('.')[1]?.length || 0;
    return Number(val.toFixed(stepDecimalPlaces));
  };

  // Calculate rotation angle (0-280 degrees)
  const getRotationAngle = () => {
    if (value === null) return -140;
    const percentage = (value - min) / (max - min);
    return percentage * 280 - 140; // -140° to +140°
  };

  // Handle mouse drag interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const knobElement = e.currentTarget as HTMLElement;
    let startValue = value ?? min;
    let isFirstMove = true; // Track first movement
    
    if (knobElement.requestPointerLock && lockMouse) {
      knobElement.requestPointerLock();
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (lockMouse && isFirstMove) {
        isFirstMove = false;
        return;
      }

      const deltaX = moveEvent.movementX || 0;
      const deltaY = -(moveEvent.movementY || 0); 
      
      const delta = deltaX + deltaY;
      const range = max - min;
      const sensitivity = 300;
      const valueChange = (delta / sensitivity) * range;
      let newValue = startValue + valueChange;
      
      newValue = Math.min(max, Math.max(min, newValue));
      
      const stepDecimalPlaces = step.toString().split('.')[1]?.length || 0;
      const roundedValue = Math.round(newValue / step) * step;
      const formattedValue = Number(roundedValue.toFixed(stepDecimalPlaces));
      
      dispatch(setValue(formattedValue));
      startValue = formattedValue;
    };

    const handleMouseUp = () => {
      if (document.exitPointerLock && lockMouse) {
        document.exitPointerLock();
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const displayValue = value !== null ? formatValue(value) : 0;

  return value !== null ? (
    <div className="knob__element">
      <button className="knob__bt" onMouseDown={handleMouseDown} >
        <Icon className='knob__icon' icon={IconType.Knob} 
          style={{ transform: `rotate(${getRotationAngle()}deg)` }} 
        />
      </button>
      <p className="knob__name">{label}</p>
      {showValue && <p className="knob__value">{displayValue}</p>}
    </div>
  ) : null;
};

export default KnobInput;