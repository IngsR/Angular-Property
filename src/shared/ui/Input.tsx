import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, prefix, suffix, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 select-none">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          {prefix && (
            <span className="absolute left-3.5 text-sm font-medium text-slate-500 pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:bg-slate-100 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : prefix ? 'pl-11' : 'pl-3.5'
            } ${rightIcon ? 'pr-9' : suffix ? 'pr-12' : 'pr-3.5'} ${
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 hover:border-slate-400'
            } ${className}`}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3.5 text-xs font-medium text-slate-500 pointer-events-none">
              {suffix}
            </span>
          )}
          {rightIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
