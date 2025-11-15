import React from 'react';

const AutismSpectrumIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M12.5 2.5c-.3-1.3-2.7-1.3-3 0L8 8l-5.5.5c-1.3.1-1.8 1.8-.8 2.5L6 14.5l-1.5 5.5c-.3 1.3 1 2.3 2 1.5L12 18l5.5 3.5c1 .8 2.3-.2 2-1.5L18 14.5l4.5-3.5c1-1 .5-2.5-.8-2.5L16 8l-1.5-5.5z"/>
        <path d="M12 11.5v-1" />
        <path d="M12 18v-2.5" />
        <path d="m5.5 11 1.5 1" />
        <path d="m17 12 1.5-1" />
    </svg>
);

export default AutismSpectrumIcon;
