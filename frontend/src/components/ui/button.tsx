import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 select-none cursor-pointer tracking-wider text-xs uppercase';
  
  const variants = {
    primary: 'bg-rose text-white hover:bg-mid shadow-sm',
    secondary: 'bg-blush text-mid hover:bg-rose hover:text-white',
    outline: 'border border-border-custom text-foreground bg-transparent hover:border-rose hover:text-rose',
    ghost: 'text-foreground bg-transparent hover:bg-cream hover:text-rose',
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-[10px]',
    md: 'px-6 py-3.5',
    lg: 'px-8 py-4.5 text-sm',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin mr-2" />}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
