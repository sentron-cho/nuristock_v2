declare module '*.jpg';
declare module '*.png';
declare module '*.jpeg';
declare module '*.gif';

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// vite + typescript 조합에서 svg를 컴포넌트 형식으로 import 하기 위한 설정
// https://ghksals0904.tistory.com/123
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.svg?react' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

