
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#84A98C"/>
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="Lora, serif" fontSize="22" fontWeight="bold" fill="white">
      N
    </text>
  </svg>
);