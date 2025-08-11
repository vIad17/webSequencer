import clsx from "clsx";
import { IconMap, IconType } from "./IconMap";

import "./Icon.scss";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  icon: IconType;
  size?: number;
};

export const Icon = (props: IconProps) => {
  return IconMap[props.icon]({
    ...props,
    className: clsx("icon", props.className),
    size: props.size ? `${props.size}px` : '24px',
    width: props.size ? `${props.size}px` : '24px',
    height: props.size ? `${props.size}px` : '24px',
  });
};