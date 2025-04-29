import React from 'react';

export const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 488 512" 
    xmlns="http://www.w3.org/2000/svg"
    {...props} // Pass down other SVG props like className, aria-hidden, etc.
  >
    <path 
      fill="currentColor" 
      d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 261.8S110.3 11.6 244 11.6c67.3 0 120.3 24.1 162.6 63.9L349.3 127c-36.1-33.6-81.3-51.6-105.3-51.6-84.9 0-153.9 69.1-153.9 153.9s69 153.9 153.9 153.9c97.2 0 135.1-67.3 140.8-103.8H244v-71.5h244c2.6 12.9 3.9 26.7 3.9 41.4z"
    />
  </svg>
); 