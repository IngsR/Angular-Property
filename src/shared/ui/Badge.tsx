import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline' | 'verified';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  id,
}) => {
  const baseClasses =
    'inline-flex items-center font-medium rounded-full whitespace-nowrap select-none transition-colors';

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-800 border border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    outline: 'bg-transparent text-slate-700 border border-slate-300',
    verified: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  };

  return (
    <span
      id={id}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
