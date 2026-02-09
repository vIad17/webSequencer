import { ReactElement } from 'react';

import ArrowDown from './svg/arrow-down.svg?react';
import ArrowLeft from './svg/arrow-left.svg?react';
import ArrowRight from './svg/arrow-right.svg?react';
import Check from './svg/check.svg?react';
import ChevronLeft from './svg/chevron-left.svg?react';
import ChevronRight from './svg/chevron-right.svg?react';
import Download from './svg/download.svg?react';
import Eye from './svg/eye.svg?react';
import Pause from './svg/pause.svg?react';
import Play from './svg/play.svg?react';
import Power from './svg/power.svg?react';
import Repeat from './svg/repeat.svg?react';
import X from './svg/x.svg?react';
import Knob from './svg/knob.svg?react';
import Sound from './svg/sound.svg?react';
import EffectAdsr from './svg/effect-adsr.svg?react';
import EffectBits from './svg/effect-bits.svg?react';
import EffectDelay from './svg/effect-delay.svg?react';
import EffectDistortion from './svg/effect-distortion.svg?react';
import EffectFilter from './svg/effect-filter.svg?react';
import EffectPitchShift from './svg/effect-pitch-shift.svg?react';
import EffectTremolo from './svg/effect-tremolo.svg?react';

export enum IconType {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pause,
  Play,
  Power,
  Repeat,
  X,
  Knob,
  Sound,
  EffectAdsr,
  EffectBits,
  EffectDelay,
  EffectDistortion,
  EffectFilter,
  EffectPitchShift,
  EffectTremolo
}

export type IconProps = React.SVGProps<SVGSVGElement> & {
  icon: IconType;
  size?: string;
  width?: string;
  height?: string;
};

export const IconMap: Record<IconType, (props: IconProps) => ReactElement> = {
  [IconType.ArrowDown]: (props) => <ArrowDown {...props} />,
  [IconType.ArrowLeft]: (props) => <ArrowLeft {...props} />,
  [IconType.ArrowRight]: (props) => <ArrowRight {...props} />,
  [IconType.Check]: (props) => <Check {...props} />,
  [IconType.ChevronLeft]: (props) => <ChevronLeft {...props} />,
  [IconType.ChevronRight]: (props) => <ChevronRight {...props} />,
  [IconType.Download]: (props) => <Download {...props} />,
  [IconType.Eye]: (props) => <Eye {...props} />,
  [IconType.Pause]: (props) => <Pause {...props} />,
  [IconType.Play]: (props) => <Play {...props} />,
  [IconType.Power]: (props) => <Power {...props} />,
  [IconType.Repeat]: (props) => <Repeat {...props} />,
  [IconType.X]: (props) => <X {...props} />,
  [IconType.Knob]: (props) => <Knob {...props} />,
  [IconType.Sound]: (props) => <Sound {...props} />,
  [IconType.EffectAdsr]: (props) => <EffectAdsr {...props} />,
  [IconType.EffectBits]: (props) => <EffectBits {...props} />,
  [IconType.EffectDelay]: (props) => <EffectDelay {...props} />,
  [IconType.EffectDistortion]: (props) => <EffectDistortion {...props} />,
  [IconType.EffectFilter]: (props) => <EffectFilter {...props} />,
  [IconType.EffectPitchShift]: (props) => <EffectPitchShift {...props} />,
  [IconType.EffectTremolo]: (props) => <EffectTremolo {...props} />,
};
