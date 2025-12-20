'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PlatformAdminNav } from '../platform-admin/admin-nav';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Don't check auth on login page
    if (pathname === '/login') {
      setIsLoading(false);
      return;
    }

    // Check authentication
    const token = localStorage.getItem('admin_token');

    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, [pathname, router]);

  // Don't show nav on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Show loading during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Only show nav when authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformAdminNav />
      {children}
    </div>
  );
}
