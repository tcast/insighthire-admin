'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PlatformAdminNav } from '../platform-admin/admin-nav';
import { AlertBanner } from './alert-banner';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    // Don't check auth on login page
    if (pathname === '/login') {
      return;
    }

    // Check authentication
    const token = localStorage.getItem('admin_token');

    if (!token) {
      router.push('/login');
    } else {
      setShowNav(true);
    }
  }, [pathname, router]);

  // Don't show nav on login page - check pathname which is available on server
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Always render same structure to prevent hydration errors
  // Nav visibility controlled by CSS until state updates
  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ display: showNav ? 'block' : 'none' }} suppressHydrationWarning>
        <AlertBanner />
        <PlatformAdminNav />
      </div>
      {children}
    </div>
  );
}
