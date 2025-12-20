'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { ArrowLeftIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export default function OrganizationInterviewsPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.id as string;

  const { data, isLoading } = trpc.platformAdmin.getOrganizationInterviews.useQuery({
    organizationId: orgId,
  });

  const { data: orgData } = trpc.platformAdmin.getOrganization.useQuery({ id: orgId });

  if (typeof window !== 'undefined' && !localStorage.getItem('admin_token')) {
    router.push('/platform-admin/login');
    return null;
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href={`/platform-admin/organizations/${orgId}`} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Interview Templates</h1>
              <p className="text-gray-600">{orgData?.organization?.name || 'Organization'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold">Interview Templates ({data?.interviews.length || 0})</h2>
          </div>

          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Times Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.interviews.map((interview) => (
                <tr key={interview.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{interview.title}</div>
                    {interview.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">{interview.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{interview.category}</td>
                  <td className="px-6 py-4 text-sm">Level {interview.difficulty}</td>
                  <td className="px-6 py-4 text-sm">{interview._count.interview_template_questions}</td>
                  <td className="px-6 py-4 text-sm">{interview.usageCount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      interview.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {interview.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data?.interviews.length === 0 && (
            <div className="text-center py-12">
              <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No interview templates created yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
