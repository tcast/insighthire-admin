import * as React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Avatar({ className = '', children, ...props }: AvatarProps) {
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AvatarFallback({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`inline-flex items-center justify-center w-full h-full text-xs font-medium ${className}`} {...props}>
      {children}
    </div>
  );
}

