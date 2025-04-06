import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  icon,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-contrast hover:bg-primary-dark",
    outline: "border border-border bg-transparent hover:bg-background hover:text-text-primary text-text-secondary",
    secondary: "bg-secondary text-secondary-contrast hover:bg-secondary-dark",
    ghost: "hover:bg-primary/10 text-text-secondary hover:text-text-primary",
    link: "underline-offset-4 hover:underline text-primary hover:text-primary-dark bg-transparent"
  };
  
  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-md",
    lg: "text-base px-5 py-2.5 rounded-md"
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}