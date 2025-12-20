'use client';

import { cn } from '../../lib/utils';

interface Step {
  id: string;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center space-x-4 mb-8">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium',
                  index < currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : index === currentStep
                    ? 'border-blue-600 bg-white text-blue-600'
                    : 'border-gray-300 bg-white text-gray-500'
                )}
              >
                {index < currentStep ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'ml-2 text-sm font-medium hidden sm:block',
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'ml-4 h-0.5 w-8 sm:w-12',
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}