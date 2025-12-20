'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useAdminAuth } from '@/lib/use-admin-auth';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Mail } from 'lucide-react';

export default function PlatformAdminDashboard() {
  const router = useRouter();
  const { isLoading: authLoading } = useAdminAuth();
  const { data: metrics, isLoading } = trpc.platformAdmin.getPlatformMetrics.useQuery(undefined, {
    enabled: !authLoading,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
        <p className="text-gray-600 mt-1">InsightHire System Administration</p>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <Link
          href="/leads"
          className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-center group"
        >
          <Mail className="h-8 w-8 mx-auto mb-3 text-blue-600" />
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Contact Leads</h3>
          <p className="text-sm text-gray-600 mt-1">Sales inquiries</p>
        </Link>

        <Link
          href="/organizations"
          className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all text-center group"
        >
          <BuildingOfficeIcon className="h-8 w-8 mx-auto mb-3 text-purple-600" />
          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">Organizations</h3>
          <p className="text-sm text-gray-600 mt-1">Manage customers</p>
        </Link>

        <Link
          href="/background-jobs"
          className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all text-center group"
        >
          <ClockIcon className="h-8 w-8 mx-auto mb-3 text-green-600" />
          <h3 className="font-semibold text-gray-900 group-hover:text-green-600">Background Jobs</h3>
          <p className="text-sm text-gray-600 mt-1">Queue monitoring & troubleshooting</p>
        </Link>

        <Link
          href="/api-monitoring"
          className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all text-center group"
        >
          <ChartBarIcon className="h-8 w-8 mx-auto mb-3 text-orange-600" />
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">API Monitoring</h3>
          <p className="text-sm text-gray-600 mt-1">System health</p>
        </Link>

        <Link
          href="/audit"
          className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition-all text-center group"
        >
          <ShieldCheckIcon className="h-8 w-8 mx-auto mb-3 text-red-600" />
          <h3 className="font-semibold text-gray-900 group-hover:text-red-600">Audit Logs</h3>
          <p className="text-sm text-gray-600 mt-1">Security tracking</p>
        </Link>
      </div>

      {/* Platform Metrics */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading metrics...</p>
        </div>
      ) : metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Organizations"
            value={metrics.totalOrgs || 0}
            color="blue"
          />
          <MetricCard
            title="Active Customers"
            value={metrics.activeOrgs || 0}
            color="green"
          />
          <MetricCard
            title="Total Users"
            value={metrics.totalUsers || 0}
            color="purple"
          />
          <MetricCard
            title="Trial Organizations"
            value={metrics.trialOrgs || 0}
            color="yellow"
          />
        </div>
      ) : null}
    </div>
  );
}

function MetricCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
