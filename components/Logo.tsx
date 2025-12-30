import React from 'react';

interface LogoProps {
  className?: string;
  classNamePath?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Roof */}
      <path d="M16 3L3 14H6V28H26V14H29L16 3Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Door/Entrance */}
      <path d="M13 28V19H19V28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Orange Accent Dot (Window/Status) */}
      <circle cx="16" cy="11" r="2.5" fill="#FF8A3D" />
    </svg>
  );
};

export default Logo;