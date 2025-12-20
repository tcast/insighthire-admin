'use client';

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
