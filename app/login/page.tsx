'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

/**
 * Platform Admin Login
 * Separate from customer WorkOS auth - uses password authentication
 *
 * Default credentials:
 * Email: admin@insighthire.com
 * Password: Admin@2024!
 */
export default function PlatformAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

      // Direct POST to tRPC mutation
      const response = await fetch(`${apiUrl}/trpc/auth.login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          rememberMe: false,
        }),
      });

      const result = await response.json();

      // Handle tRPC error format
      if (result.error) {
        throw new Error(result.error.message || 'Invalid credentials');
      }

      const data = result.result?.data || result;

      // Verify this is a platform admin
      if (!data.user?.isPlatformAdmin || data.user.organizationId !== 'platform_00000000000000000') {
        throw new Error('Not a platform administrator');
      }

      // Store admin token
      localStorage.setItem('admin_token', data.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      document.cookie = `admin_token=${data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;

      console.log('✅ Platform admin logged in:', data.user.email);

      // Redirect to admin dashboard
      router.push('/platform-admin/organizations');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <ShieldCheckIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Platform Admin
          </h1>
          <p className="text-gray-400">
            InsightHire System Administration
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@insighthire.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              🔒 Secure admin-only access
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 bg-yellow-900 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg text-sm">
          <strong>⚠️ Security Notice:</strong> This portal is for InsightHire platform administrators only.
          All actions are logged and monitored.
        </div>
      </div>
    </div>
  );
}
