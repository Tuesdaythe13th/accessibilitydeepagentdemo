import React from 'react';

const TextSizeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M4 7V6h16v1" />
        <path d="M12 6V20" />
        <path d="M8 20h8" />
        <path d="M17 11h-2.5" />
        <path d="M9.5 11H7" />
    </svg>
);

export default TextSizeIcon;