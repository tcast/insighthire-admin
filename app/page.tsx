'use client';

import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Mail } from 'lucide-react';

export default function PlatformAdminDashboard() {
  const router = useRouter();
  const { data: metrics, isLoading } = trpc.platformAdmin.getPlatformMetrics.useQuery();

  // Check auth but don't redirect
  if (typeof window !== 'undefined' && !localStorage.getItem('admin_token')) {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
              <p className="text-gray-600 mt-1">InsightHire System Administration</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                router.push('/login');
              }}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Organizations"
            value={metrics?.totalOrgs || 0}
            icon={<BuildingOfficeIcon className="h-8 w-8" />}
            color="blue"
          />
          <MetricCard
            title="Active Customers"
            value={metrics?.activeOrgs || 0}
            icon={<ArrowTrendingUpIcon className="h-8 w-8" />}
            color="green"
          />
          <MetricCard
            title="Total Users"
            value={metrics?.totalUsers || 0}
            icon={<UsersIcon className="h-8 w-8" />}
            color="purple"
          />
          <MetricCard
            title="Trial Organizations"
            value={metrics?.trialOrgs || 0}
            icon={<ClockIcon className="h-8 w-8" />}
            color="yellow"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Candidates Processed"
            value={metrics?.totalCandidates || 0}
            icon={<ChartBarIcon className="h-8 w-8" />}
            color="indigo"
            subtitle="Across all organizations"
          />
          <MetricCard
            title="Assessments Run"
            value={metrics?.totalAssessments || 0}
            icon={<ChartBarIcon className="h-8 w-8" />}
            color="pink"
            subtitle="Total platform usage"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${100 - (metrics?.churnRate || 0)}%`}
            icon={<ArrowTrendingUpIcon className="h-8 w-8" />}
            color="emerald"
            subtitle="Trial to paid"
          />
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {metrics?.planDistribution.map((item) => (
              <div key={item.plan} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                <p className="text-sm text-gray-600">{item.plan}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    pink: 'bg-pink-50 text-pink-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors[color as keyof typeof colors]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
