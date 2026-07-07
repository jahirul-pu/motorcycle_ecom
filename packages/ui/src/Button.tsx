import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyle =
    'px-4 py-2.5 rounded-xl font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D71920]';
  const variantStyle =
    variant === 'primary'
      ? 'bg-[#D71920] hover:bg-[#BF141A] text-white shadow-sm'
      : 'bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 shadow-sm';

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};
