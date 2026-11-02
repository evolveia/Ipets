import React from 'react';
import { motion } from 'motion/react';

interface PawLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PawLoader: React.FC<PawLoaderProps> = ({
  message = 'Buscando no micro-hub mais próximo...',
  size = 'md',
}) => {
  const pawSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="flex items-center gap-2 mb-3">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.2, scale: 0.8, y: 0 }}
            animate={{
              opacity: [0.2, 1, 0.4],
              scale: [0.8, 1.25, 1],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.22,
              ease: 'easeInOut',
            }}
            className={`${pawSizes[size]} text-[#00A896]`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full drop-shadow-sm"
            >
              {/* Main pad */}
              <ellipse cx="12" cy="15" rx="5" ry="4" />
              {/* 4 toe pads */}
              <circle cx="6.5" cy="9.5" r="2.2" />
              <circle cx="10" cy="6.5" r="2.2" />
              <circle cx="14" cy="6.5" r="2.2" />
              <circle cx="17.5" cy="9.5" r="2.2" />
            </svg>
          </motion.div>
        ))}
      </div>
      {message && (
        <p className="text-xs font-semibold text-[#6B7A83] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
