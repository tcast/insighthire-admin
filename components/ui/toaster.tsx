'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toastWithId = { ...newToast, id };
    
    setToasts(prev => [...prev, toastWithId]);

    // Auto dismiss after duration
    const duration = newToast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 sm:p-6">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}

interface ToastComponentProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastComponent({ toast, onDismiss }: ToastComponentProps) {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={clsx(
        'flex w-full max-w-sm items-start gap-3 rounded-lg p-4 shadow-lg ring-1 ring-black ring-opacity-5',
        'animate-slide-up',
        {
          'bg-white': toast.type === 'info',
          'bg-green-50': toast.type === 'success',
          'bg-red-50': toast.type === 'error',
          'bg-yellow-50': toast.type === 'warning',
        }
      )}
    >
      <Icon
        className={clsx('h-5 w-5 flex-shrink-0', {
          'text-blue-400': toast.type === 'info',
          'text-green-400': toast.type === 'success',
          'text-red-400': toast.type === 'error',
          'text-yellow-400': toast.type === 'warning',
        })}
      />
      
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p
            className={clsx('text-sm font-medium', {
              'text-gray-900': toast.type === 'info',
              'text-green-800': toast.type === 'success',
              'text-red-800': toast.type === 'error',
              'text-yellow-800': toast.type === 'warning',
            })}
          >
            {toast.title}
          </p>
        )}
        
        {toast.description && (
          <p
            className={clsx('text-sm', {
              'text-gray-500': toast.type === 'info',
              'text-green-700': toast.type === 'success',
              'text-red-700': toast.type === 'error',
              'text-yellow-700': toast.type === 'warning',
            })}
          >
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className={clsx(
          'flex-shrink-0 rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2',
          {
            'text-gray-400 focus:ring-gray-500': toast.type === 'info',
            'text-green-500 focus:ring-green-500': toast.type === 'success',
            'text-red-500 focus:ring-red-500': toast.type === 'error',
            'text-yellow-500 focus:ring-yellow-500': toast.type === 'warning',
          }
        )}
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
