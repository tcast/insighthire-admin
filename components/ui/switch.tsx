"use client";
import * as React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Switch({ label, className = '', ...props }: SwitchProps) {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <input type="checkbox" className="sr-only peer" {...props} />
      <div className="w-10 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors relative">
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
      </div>
      {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
    </label>
  );
}

