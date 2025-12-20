'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '../../../../../lib/trpc';
import { ArrowLeftIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function OrganizationAssessmentsPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.id as string;

  const { data, isLoading } = trpc.platformAdmin.getOrganizationAssessments.useQuery({
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
              <h1 className="text-2xl font-bold">Assessments</h1>
              <p className="text-gray-600">{orgData?.organization?.name || 'Organization'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold">All Assessments ({data?.assessments.length || 0})</h2>
            <button
              onClick={() => {
                // Impersonate org admin to create assessment
                alert('Impersonate an admin from this org to create assessments');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Assessment
            </button>
          </div>

          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.assessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{assessment.title}</div>
                      {assessment.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{assessment.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{assessment.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      assessment.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {assessment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{assessment._count.assessment_questions}</td>
                  <td className="px-6 py-4 text-sm">{assessment._count.assessment_responses}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data?.assessments.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No assessments created yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
