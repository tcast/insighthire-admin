// Force all platform-admin pages to be dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { PlatformAdminNav } from '../../components/admin-nav';

export default function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformAdminNav />
      {children}
    </div>
  );
}
