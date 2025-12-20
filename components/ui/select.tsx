'use client';

import * as React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={clsx(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4 text-gray-700" />
    </button>
  );
}

export function SelectValue({ placeholder, children }: { placeholder?: string; children?: React.ReactNode }) {
  const { value } = React.useContext(SelectContext);
  
  // If children are provided and there's a value, render the children
  if (children && value) {
    return <span className="block truncate text-gray-900">{children}</span>;
  }
  
  // Otherwise, fall back to the value or placeholder
  return <span className="block truncate text-gray-900">{value || placeholder}</span>;
}

export function SelectContent({ children, align = 'start' }: { children: React.ReactNode; align?: 'start' | 'end' }) {
  const { open, setOpen } = React.useContext(SelectContext);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        onClick={() => setOpen(false)}
      />
      <div
        className={clsx(
          'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
          align === 'end' ? 'right-0' : 'left-0'
        )}
      >
        {children}
      </div>
    </>
  );
}

export function SelectItem({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: selectedValue, onValueChange, setOpen } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange?.(value);
        setOpen(false);
      }}
      className={clsx(
        'relative w-full cursor-pointer select-none py-2 pl-3 pr-9 text-left text-gray-900',
        'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
        isSelected && 'bg-gray-50 font-medium',
        className
      )}
    >
      {children}
    </button>
  );
}