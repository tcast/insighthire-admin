import React, { useState } from 'react';
import { clsx } from 'clsx';

interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as unknown, { isOpen, setIsOpen })
          : child
      )}
    </div>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export function DropdownMenuTrigger({ children, asChild, isOpen, setIsOpen }: DropdownMenuTriggerProps) {
  const handleClick = () => {
    setIsOpen?.(!isOpen);
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

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'end';
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export function DropdownMenuContent({ children, align = 'start', isOpen, setIsOpen }: DropdownMenuContentProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-10"
        onClick={() => setIsOpen?.(false)}
      />
      
      {/* Menu */}
      <div className={clsx(
        'absolute top-full mt-1 min-w-[120px] bg-white rounded-md shadow-lg border border-gray-200 z-20',
        align === 'end' ? 'right-0' : 'left-0'
      )}>
        <div className="py-1">
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child as unknown, { setIsOpen })
              : child
          )}
        </div>
      </div>
    </>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  setIsOpen?: (open: boolean) => void;
  onSelect?: (e: Event) => void;
}

export function DropdownMenuItem({ 
  children, 
  onClick, 
  disabled, 
  className, 
  setIsOpen,
  onSelect 
}: DropdownMenuItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      onSelect(e as unknown);
    } else {
      onClick?.();
      setIsOpen?.(false);
    }
  };

  return (
    <button
      className={clsx(
        'w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 flex items-center',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="h-px bg-gray-200 my-1" />;
}