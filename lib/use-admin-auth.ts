'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, [router]);

  return { isAuthenticated, isLoading };
}
