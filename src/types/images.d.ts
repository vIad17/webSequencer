declare module '*.svg' {
  import React = require('react');
  const src: string;
  export const ReactComponent: (
    props: React.SVGProps<SVGSVGElement>
  ) => JSX.Element;
  export default src;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}
