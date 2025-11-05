import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

export default function Alert({ variant = 'info', title, children, className, onClose }: AlertProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[variant];

  return (
    <div
      className={clsx(
        'p-4 rounded-lg border',
        {
          'bg-green-50 border-green-200 text-green-800': variant === 'success',
          'bg-red-50 border-red-200 text-red-800': variant === 'error',
          'bg-yellow-50 border-yellow-200 text-yellow-800': variant === 'warning',
          'bg-blue-50 border-blue-200 text-blue-800': variant === 'info',
        },
        className
      )}
    >
      <div className="flex items-start">
        <Icon className={clsx('h-5 w-5 mt-0.5 mr-3', {
          'text-green-600': variant === 'success',
          'text-red-600': variant === 'error',
          'text-yellow-600': variant === 'warning',
          'text-blue-600': variant === 'info',
        })} />
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div>{children}</div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}




