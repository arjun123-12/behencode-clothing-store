'use client';

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25';
      case 'info':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/25';
      case 'warning':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/25';
      case 'danger':
        return 'bg-rose/10 text-rose border-rose/25';
      case 'secondary':
        return 'bg-cream text-mid border-border-custom/30';
      default:
        return 'bg-rose text-white border-rose';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider select-none ${getStyles()} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
