'use client';

import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

import { Spinner } from './Spinner';

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
};

export const Button = ({
  children,
  className,
  isLoading,
  disabled,
  variant,
  ...props
}: Props) => {
  variant = variant ?? 'primary';
  isLoading = isLoading ?? false;
  disabled = disabled ?? false;

  if (isLoading) {
    disabled = true;
  }

  const variants = {
    primary:
      'bg-blue-600 text-slate-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-slate-200',
    secondary:
      'border-2 border-blue-700 text-blue-600 hover:bg-blue-700 hover:text-slate-300 disabled:border-gray-500 disabled:bg-transparent disabled:text-slate-300 disabled:cursor-not-allowed',
  };

  return (
    <button
      className={`${className} ${variants[variant]} p-3 rounded-md transition-all duration-150 relative disabled:transition-none disabled:duration-0 box-border`}
      disabled={disabled}
      {...props}
    >
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spinner size="md" />
        </div>
      )}
      <div className={isLoading ? 'opacity-0' : 'opacity-100'}>{children}</div>
    </button>
  );
};
