import React from 'react';

const UnderlineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M6 4v6a6 6 0 0 0 12 0V4" />
        <line x1="4" y1="20" x2="20" y2="20" />
    </svg>
);

export default UnderlineIcon;