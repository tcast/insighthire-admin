import React, { useState } from 'react';
import { clsx } from 'clsx';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ children, defaultValue, value, onValueChange, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const activeTab = value !== undefined ? value : internalValue;
  const setActiveTab = onValueChange || setInternalValue;

  return (
    <div className={clsx('space-y-4', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Only pass props to TabsList and TabsContent components, not DOM elements
          if (child.type === TabsList || child.type === TabsContent) {
            return React.cloneElement(child as any, { activeTab, setActiveTab });
          }
        }
        return child;
      })}
    </div>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

export function TabsList({ children, className, activeTab, setActiveTab }: TabsListProps) {
  return (
    <div className={clsx('inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Only pass props to TabsTrigger components, not DOM elements
          if (child.type === TabsTrigger) {
            return React.cloneElement(child as any, { activeTab, setActiveTab });
          }
        }
        return child;
      })}
    </div>
  );
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

export function TabsTrigger({ children, value, activeTab, setActiveTab }: TabsTriggerProps) {
  const isActive = activeTab === value;

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
        isActive
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
      )}
      onClick={() => setActiveTab?.(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  activeTab?: string;
}

export function TabsContent({ children, value, className, activeTab }: TabsContentProps) {
  if (activeTab !== value) return null;

  return (
    <div className={clsx('mt-2', className)}>
      {children}
    </div>
  );
}