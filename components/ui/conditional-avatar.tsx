'use client';

import { useAppearance } from '@/contexts/appearance-context';
import Image from 'next/image';

interface ConditionalAvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8', 
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export function ConditionalAvatar({ 
  src, 
  alt, 
  size = 'md', 
  fallback, 
  className = '' 
}: ConditionalAvatarProps) {
  const { appearance } = useAppearance();

  // Don't render avatar if showAvatars is disabled
  if (!appearance.showAvatars) {
    return null;
  }

  const sizeClass = sizeClasses[size];
  const combinedClassName = `${sizeClass} rounded-full bg-gray-200 dark:bg-gray-700 object-cover ${className}`;

  // If no src provided, show fallback initials
  if (!src) {
    const initials = fallback || alt.slice(0, 2).toUpperCase();
    return (
      <div className={`${combinedClassName} flex items-center justify-center text-gray-600 dark:text-gray-400 font-medium text-sm`}>
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
      height={size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
      className={combinedClassName}
    />
  );
}

// Hook to check if avatars should be shown
export function useShowAvatars() {
  const { appearance } = useAppearance();
  return appearance.showAvatars;
}