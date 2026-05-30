import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'rose' | 'mid' | 'white';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'rose' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const colors = {
    rose: 'border-b-rose',
    mid: 'border-b-mid',
    white: 'border-b-white',
  };

  return (
    <div className="flex items-center justify-center py-4">
      <div className={`animate-spin rounded-full border-transparent border-t-border-custom ${sizes[size]} ${colors[color]}`} />
    </div>
  );
};

export default Spinner;
