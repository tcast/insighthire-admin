import React from 'react';
import { clsx } from 'clsx';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={clsx(
        'text-sm font-medium leading-none text-gray-900',
        className
      )}
      {...props}
    />
  );
}