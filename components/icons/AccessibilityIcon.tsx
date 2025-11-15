
import React from 'react';

const AccessibilityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
    <path d="M12 3v2"></path>
    <path d="M12 19v2"></path>
    <path d="M3 12h2"></path>
    <path d="M19 12h2"></path>
  </svg>
);

export default AccessibilityIcon;
