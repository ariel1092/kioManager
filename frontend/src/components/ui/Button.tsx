import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500':
            variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500':
            variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500':
            variant === 'danger',
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500':
            variant === 'outline',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Cargando...' : children}
    </button>
  );
}



