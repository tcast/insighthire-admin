"use client";
import * as React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Slider({ className = '', ...props }: SliderProps) {
  return (
    <input
      type="range"
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
      {...props}
    />
  );
}

