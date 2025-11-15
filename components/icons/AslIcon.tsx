import React from 'react';

const AslIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M14.5 18L12 22l-2.5-4" />
        <path d="M12 18V6" />
        <path d="M12 6H9c-.8 0-1.6.3-2.1.9C6.3 7.4 6 8.2 6 9c0 1.1.4 2.1 1.2 2.8L12 16" />
        <path d="M12 6h3c.8 0 1.6.3 2.1.9.6.5 1 1.3 1 2.1 0 1.1-.4 2.1-1.2 2.8L12 16" />
    </svg>
);

export default AslIcon;
