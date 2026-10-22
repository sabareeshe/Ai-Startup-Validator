// ============================================================
// components/ui/Input.jsx — Form Input Component
// ============================================================

import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            ref={ref}
            className={`input-field resize-none ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''} ${className}`}
            rows={4}
            {...props}
          />
        ) : type === 'select' ? (
          <select
            ref={ref}
            className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''} ${className}`}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={type}
            className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''} ${className}`}
            {...props}
          />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
