import React, { useState } from 'react';
import { clsx } from 'clsx';

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({ children, open, onOpenChange }: DialogProps) {
  // Use controlled state - rely on external open prop entirely
  const isOpen = open || false;

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange?.(newOpen);
  };

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as unknown, { open: isOpen, onOpenChange: handleOpenChange })
          : child
      )}
    </div>
  );
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialogTrigger({ children, asChild, onOpenChange }: DialogTriggerProps) {
  const handleClick = () => {
    onOpenChange?.(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as unknown, { onClick: handleClick });
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialogContent({ children, className, open, onOpenChange }: DialogContentProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange?.(false)}
      />
      
      {/* Dialog */}
      <div className={clsx(
        'relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 p-6',
        className
      )}>
        {children}
      </div>
    </div>
  );
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <div className={clsx('flex flex-col space-y-3 text-center sm:text-left pb-4', className)}>
      {children}
    </div>
  );
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={clsx('text-lg font-semibold leading-none tracking-tight text-gray-900', className)}>
      {children}
    </h2>
  );
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p className={clsx('text-sm text-gray-600 leading-relaxed', className)}>
      {children}
    </p>
  );
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={clsx('flex justify-end space-x-2 pt-4', className)}>
      {children}
    </div>
  );
}