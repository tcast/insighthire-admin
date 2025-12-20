'use client';

import { useEffect, useState } from 'react';

interface ProcessingStep {
  label: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  message?: string;
}

interface ProcessingOverlayProps {
  isOpen: boolean;
  title: string;
  steps: ProcessingStep[];
  onClose?: () => void;
}

export function ProcessingOverlay({ isOpen, title, steps, onClose }: ProcessingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Auto-advance to next step when current completes
    const processingIndex = steps.findIndex(s => s.status === 'processing');
    if (processingIndex !== -1) {
      setCurrentStep(processingIndex);
    }
  }, [steps]);

  if (!isOpen) return null;

  const allComplete = steps.every(s => s.status === 'complete');
  const hasError = steps.some(s => s.status === 'error');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            {allComplete ? (
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-3xl">✅</span>
              </div>
            ) : hasError ? (
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">❌</span>
              </div>
            ) : (
              <div className="w-16 h-16 mx-auto relative">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {allComplete && (
            <p className="text-green-600 mt-2">Processing Complete!</p>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              {/* Step Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {step.status === 'complete' ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : step.status === 'processing' ? (
                  <div className="w-6 h-6 relative">
                    <div className="absolute inset-0 border-2 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                ) : step.status === 'error' ? (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  step.status === 'complete' ? 'text-green-600' :
                  step.status === 'processing' ? 'text-blue-600' :
                  step.status === 'error' ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {step.label}
                </p>
                {step.message && (
                  <p className="text-xs text-gray-500 mt-1">{step.message}</p>
                )}
              </div>

              {/* Step Status Animation */}
              {step.status === 'processing' && (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        {(allComplete || hasError) && onClose && (
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {allComplete ? 'Done' : 'Close'}
            </button>
          </div>
        )}

        {!allComplete && !hasError && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">Please wait while we process your request...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

// Example usage:
// const [processing, setProcessing] = useState(false);
// const [steps, setSteps] = useState<ProcessingStep[]>([
//   { label: 'Analyzing question', status: 'pending' },
//   { label: 'Generating criteria with AI', status: 'pending' },
//   { label: 'Creating weighted rubric', status: 'pending' },
//   { label: 'Saving to database', status: 'pending' },
// ]);
//
// <ProcessingOverlay
//   isOpen={processing}
//   title="Generating AI Scoring"
//   steps={steps}
//   onClose={() => setProcessing(false)}
// />
