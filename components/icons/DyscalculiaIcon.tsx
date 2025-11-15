import React from 'react';

const DyscalculiaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 8h8v8" />
        <path d="m16 8-8 8" />
    </svg>
);

export default DyscalculiaIcon;
