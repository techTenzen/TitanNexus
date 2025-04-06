import React from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function GradientButton({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  ...props
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-8 py-3 text-lg',
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#FF3370] to-[#7928CA] shadow-lg hover:shadow-xl hover:shadow-[#FF3370]/20 text-white',
    secondary: 'bg-background-secondary border border-gray-700 hover:border-[#00EAFF] text-white',
  };
  
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
