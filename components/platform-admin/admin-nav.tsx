'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Mail, Building2, Activity, BarChart3, Shield, LogOut, AlertTriangle, MapPin } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const navItems = [
  { name: 'Organizations', href: '/organizations', icon: Building2 },
  { name: 'Stuck Candidates', href: '/stuck-candidates', icon: AlertTriangle, hasBadge: true },
  { name: 'Location Anomalies', href: '/anomalies', icon: MapPin, hasAnomalyBadge: true },
  { name: 'Background Jobs', href: '/background-jobs', icon: Activity },
  { name: 'Leads', href: '/leads', icon: Mail },
  { name: 'API Monitoring', href: '/api-monitoring', icon: BarChart3 },
  { name: 'Audit', href: '/audit', icon: Shield },
];

export function PlatformAdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Fetch health summary for badge count
  const { data: healthData } = trpc.platformAdmin.getJourneyHealthSummary.useQuery(
    undefined,
    { refetchInterval: 30000, retry: false }
  );

  const alertCount = healthData?.alerts?.total || 0;
  const anomalyCount = healthData?.metrics?.locationAnomalies || 0;

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
    router.push('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">InsightHire</span>
              <span className="ml-3 text-sm font-medium text-gray-400">Platform Admin</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const Icon = item.icon;
                const showAlertBadge = (item as any).hasBadge && alertCount > 0;
                const showAnomalyBadge = (item as any).hasAnomalyBadge && anomalyCount > 0;
                const badgeCount = showAlertBadge ? alertCount : showAnomalyBadge ? anomalyCount : 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                    `}
                  >
                    <Icon className={`h-4 w-4 mr-2 ${(showAlertBadge || showAnomalyBadge) ? 'text-red-400' : ''}`} />
                    {item.name}
                    {(showAlertBadge || showAnomalyBadge) && (
                      <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${showAnomalyBadge ? 'bg-amber-500' : 'bg-red-500'}`}>
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
