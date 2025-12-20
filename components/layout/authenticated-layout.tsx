'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PlatformAdminNav } from '../platform-admin/admin-nav';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Don't check auth on login page
    if (pathname === '/login') {
      return;
    }

    // Check authentication
    const token = localStorage.getItem('admin_token');

    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // Prevent hydration mismatch - don't render until mounted
  if (!isMounted) {
    return <>{children}</>;
  }

  // Don't show nav on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Only show nav when authenticated
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformAdminNav />
      {children}
    </div>
  );
}
