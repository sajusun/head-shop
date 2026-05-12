import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ 
  label, 
  error, 
  className, 
  id, 
  ...props 
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        id={id}
        className={twMerge(
          'w-full rounded-button border border-gray-300 bg-white px-4 py-2.5 text-text transition-all duration-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:bg-gray-50 disabled:text-gray-500',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
