import React, { useState } from 'react';
import { clsx } from 'clsx';

interface AlertDialogProps {
  children: React.ReactNode;
}

export function AlertDialog({ children }: AlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as unknown, { isOpen, setIsOpen })
          : child
      )}
    </>
  );
}

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export function AlertDialogTrigger({ children, asChild, isOpen, setIsOpen }: AlertDialogTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as unknown, { 
      onClick: () => setIsOpen?.(true)
    });
  }

  return (
    <button onClick={() => setIsOpen?.(true)}>
      {children}
    </button>
  );
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export function AlertDialogContent({ children, isOpen, setIsOpen }: AlertDialogContentProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => setIsOpen?.(false)}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as unknown, { setIsOpen })
            : child
        )}
      </div>
    </div>
  );
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
}

export function AlertDialogHeader({ children }: AlertDialogHeaderProps) {
  return (
    <div className="p-6 pb-0">
      {children}
    </div>
  );
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
}

export function AlertDialogTitle({ children }: AlertDialogTitleProps) {
  return (
    <h2 className="text-lg font-semibold">
      {children}
    </h2>
  );
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
}

export function AlertDialogDescription({ children }: AlertDialogDescriptionProps) {
  return (
    <p className="text-sm text-gray-600 mt-2">
      {children}
    </p>
  );
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
}

export function AlertDialogFooter({ children }: AlertDialogFooterProps) {
  return (
    <div className="flex justify-end space-x-2 p-6 pt-4">
      {children}
    </div>
  );
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  setIsOpen?: (open: boolean) => void;
}

export function AlertDialogCancel({ children, setIsOpen }: AlertDialogCancelProps) {
  return (
    <button
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      onClick={() => setIsOpen?.(false)}
    >
      {children}
    </button>
  );
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  setIsOpen?: (open: boolean) => void;
}

export function AlertDialogAction({ 
  children, 
  onClick, 
  disabled, 
  className,
  setIsOpen 
}: AlertDialogActionProps) {
  const handleClick = () => {
    onClick?.();
    setIsOpen?.(false);
  };

  return (
    <button
      className={clsx(
        'px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}