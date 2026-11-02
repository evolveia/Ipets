import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  inverted = false,
}) => {
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className="flex items-center gap-2">
        <img
          src="/brand/ipet-logo.png"
          alt="iPet Logo"
          className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-200 hover:scale-105 ${
            inverted ? 'drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]' : 'drop-shadow-sm'
          }`}
          onError={(e) => {
            // Fallback para caso o path precise do caminho alternativo
            (e.target as HTMLImageElement).src = '/assets/aistudio/IMG_20261102_101903_a34d4025.png';
          }}
        />
      </div>
      {showTagline && (
        <span
          className={`text-[11px] font-semibold tracking-wide uppercase mt-0.5 ${
            inverted ? 'text-teal-100' : 'text-[#6B7A83]'
          }`}
        >
          Super App Pet 24/7
        </span>
      )}
    </div>
  );
};
