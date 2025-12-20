'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId?: string;
  questionText: string;
  videoUrl?: string;
}

export function VideoModal({ isOpen, onClose, questionId, questionText, videoUrl }: VideoModalProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (videoUrl) {
        // Use provided video URL directly
        setSignedUrl(videoUrl);
        setLoading(false);
      } else if (questionId) {
        // Load signed URL from API
        loadSignedUrl();
      }
    }
  }, [isOpen, questionId, videoUrl]);

  const loadSignedUrl = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/test/video-url/${questionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load video');
      }
      
      const result = await response.json();
      if (result.success) {
        setSignedUrl(result.signedUrl);
      } else {
        setError(result.message || 'Failed to load video');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSignedUrl(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Dialog.Title className="text-lg font-medium text-gray-900">
                AI Video Preview
              </Dialog.Title>
              <p className="text-sm text-gray-600 mt-1">
                {questionText.length > 100 ? `${questionText.substring(0, 100)}...` : questionText}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading video...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">⚠️ {error}</div>
                <button
                  onClick={loadSignedUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {signedUrl && (
              <div className="aspect-video">
                <video
                  controls
                  autoPlay
                  className="w-full h-full rounded-lg"
                  style={{ maxHeight: '500px' }}
                >
                  <source src={signedUrl} type="video/mp4" />
                  <p className="text-gray-600">
                    Your browser doesn't support video playback.
                    <a href={signedUrl} className="text-blue-600 hover:underline ml-1">
                      Download the video instead
                    </a>
                  </p>
                </video>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}