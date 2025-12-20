import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { PlatformAdminNav } from '@/components/platform-admin/admin-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InsightHire Platform Admin',
  description: 'Platform administration dashboard for InsightHire',
  robots: 'noindex, nofollow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <PlatformAdminNav />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
