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
  const baseStyle = 'px-4 py-2 rounded font-medium transition-colors focus:outline-none';
  const variantStyle =
    variant === 'primary'
      ? 'bg-amber-500 hover:bg-amber-600 text-black'
      : 'bg-zinc-800 hover:bg-zinc-700 text-white';

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};
