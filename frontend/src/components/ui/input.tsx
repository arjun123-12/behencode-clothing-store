import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-[10px] font-bold text-light-brown uppercase tracking-wider select-none">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border rounded-full text-xs bg-cream focus:outline-none focus:border-rose text-foreground transition-all duration-300 ${
            error ? 'border-red-400 focus:border-red-400' : 'border-border-custom'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-[10px] font-semibold text-red-500 pl-2 animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
