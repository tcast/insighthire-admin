import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';

// Create tRPC React hooks
export const trpc = createTRPCReact<any>();

// Create tRPC client
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/trpc`
        : 'http://localhost:4000/trpc',
      fetch(url, options) {
        // Admin app always uses admin_token
        const token = typeof window !== 'undefined'
          ? localStorage.getItem('admin_token')
          : null;

        const headers = {
          ...options?.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        console.log('🔷 Admin tRPC Request:', {
          url,
          method: options?.method || 'GET',
          hasToken: !!token,
        });

        return fetch(url, {
          ...options,
          credentials: 'include',
          headers,
        }).then(res => {
          console.log('🔶 Admin tRPC Response:', {
            url,
            status: res.status,
            ok: res.ok
          });

          // Handle auth failures - redirect to admin login
          if (res.status === 401 || res.status === 403) {
            console.log('🔐 Admin auth failed - redirecting to login');
            if (typeof window !== 'undefined') {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              window.location.href = '/login';
            }
          }

          return res;
        }).catch(err => {
          console.error('🔴 Admin tRPC Error:', {
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
