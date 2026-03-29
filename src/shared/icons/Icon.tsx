import clsx from 'clsx';

import { IconMap, IconType } from './IconMap';

import './Icon.scss';

export type IconProps = React.SVGProps<SVGSVGElement> & {
  icon: IconType;
  interactable?: boolean;
  size?: number;
};

export const Icon = (props: IconProps) => {
  return IconMap[props.icon]({
    ...props,
    className: clsx(
      'icon',
      { icon_interactable: props.interactable },
      props.className
    ),
    size: props.size ? `${props.size}px` : '24px',
    width: props.size ? `${props.size}px` : '24px',
    height: props.size ? `${props.size}px` : '24px'
  });
};
