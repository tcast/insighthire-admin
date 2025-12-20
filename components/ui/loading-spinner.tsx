'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorClasses = {
  primary: 'border-blue-600',
  secondary: 'border-purple-600',
  white: 'border-white',
  gray: 'border-gray-400',
};

export function LoadingSpinner({ size = 'md', color = 'primary', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingState({ message = 'Loading...', size = 'lg', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size={size} />
      <p className="mt-3 text-gray-600 text-sm font-medium">{message}</p>
    </div>
  );
}

export default LoadingSpinner;