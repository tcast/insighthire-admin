import React from 'react';
import { clsx } from 'clsx';

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

export function Alert({ children, className }: AlertProps) {
  return (
    <div className={clsx('rounded-lg border border-gray-200 p-4', className)}>
      {children}
    </div>
  );
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertDescription({ children, className }: AlertDescriptionProps) {
  return (
    <div className={clsx('text-sm text-gray-600', className)}>
      {children}
    </div>
  );
}