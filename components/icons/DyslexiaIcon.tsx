import React from 'react';

const DyslexiaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z" />
        <path d="m14 10-2 5-2-5" />
        <path d="M9 12h7" />
    </svg>
);

export default DyslexiaIcon;
