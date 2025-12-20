'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useAdminAuth } from '@/lib/use-admin-auth';
import { ShieldCheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AuditLogsPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  const { data, isLoading } = trpc.platformAdmin.getAuditLogs.useQuery({
    page,
    action: actionFilter || undefined,
  }, {
    enabled: !authLoading, // Only query after auth check
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-gray-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
              <p className="text-sm text-gray-600">Track all platform admin actions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center space-x-4">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by action..."
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading audit logs...</p>
            </div>
          ) : data?.logs && data.logs.length > 0 ? (
            <div className="divide-y">
              {data.logs.map((log: any) => (
                <div key={log.id} className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-gray-600">{log.details}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        By: {log.adminEmail} • {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p>No audit logs found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.total && data.total > 20 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {Math.ceil(data.total / 20)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(data.total / 20)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
