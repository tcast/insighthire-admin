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

        return fetch(url, {
          ...options,
          credentials: 'include',
          headers,
        }).then(res => {
          // Handle auth failures - redirect to admin login
          if (res.status === 401 || res.status === 403) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              window.location.href = '/login';
            }
          }

          return res;
        });
      },
    }),
  ],
});
