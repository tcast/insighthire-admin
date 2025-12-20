import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';

// Create tRPC React hooks (untyped in web build to avoid cross-package type coupling)
export const trpc = createTRPCReact<any>();

// Create tRPC client
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/trpc`
        : 'http://localhost:4000/trpc',
      fetch(url, options) {
        // Check if this is a platform admin request
        const isPlatformAdminRequest = url.includes('/platformAdmin.');

        // Use admin_token for platform admin requests, auth_token for regular requests
        const token = typeof window !== 'undefined'
          ? (isPlatformAdminRequest
              ? localStorage.getItem('admin_token')
              : localStorage.getItem('auth_token'))
          : null;

        // Make sure to include the auth header in the request
        const headers = {
          ...options?.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        console.log('🔷 tRPC Client Request:', {
          url,
          method: options?.method || 'GET',
          hasToken: !!token,
          tokenPreview: token ? token.substring(0, 20) + '...' : 'no token',
          headers: headers,  // Log the ACTUAL headers being sent
          authHeader: headers.Authorization // Explicitly log auth header
        });

        return fetch(url, {
          ...options,
          credentials: 'include',
          headers,
        }).then(res => {
          console.log('🔶 tRPC Client Response:', {
            url,
            status: res.status,
            statusText: res.statusText,
            ok: res.ok
          });

          // Handle auth failures for platform admin
          if ((res.status === 401 || res.status === 403) && url.includes('/platformAdmin.')) {
            console.log('🔐 Platform admin auth failed - redirecting to login');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/platform-admin/login';
          }

          // DON'T auto-redirect to login - let components handle auth state
          // The homepage should be able to load without auth
          // Only protected routes (like /dashboard) should redirect via middleware

          return res;
        }).catch(err => {
          console.error('🔴 tRPC Client Error:', {
            url,
            error: err,
            message: err.message
          });
          throw err;
        });
      },
    }),
  ],
});
