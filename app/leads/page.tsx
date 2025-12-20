'use client';
export const dynamic = 'force-dynamic';


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import Link from 'next/link';
import { Mail, Phone, Building2, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';

export default function LeadsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!localStorage.getItem('admin_token')) {
    router.push('/login');
    return null;
  }

  const { data: leadsData, isLoading, refetch } = trpc.contact.list.useQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const updateStatus = trpc.contact.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const leads = leadsData?.leads || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contact Leads</h1>
        <p className="text-gray-600 mt-1">Manage incoming sales inquiries</p>
      </div>

      {/* Filter Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            {['all', 'new', 'contacted', 'qualified', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`
                  pb-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize
                  ${statusFilter === status
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {status} {status === 'all' && `(${leads.length})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Leads List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No leads found</p>
          </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead: any) => (
              <div key={lead.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{lead.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${lead.email}`} className="text-blue-600 hover:text-blue-700">
                          {lead.email}
                        </a>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${lead.phone}`} className="text-blue-600 hover:text-blue-700">
                            {lead.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus.mutate({ id: lead.id, status: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-gray-600 mt-1" />
                    <span className="text-sm font-medium text-gray-700">Message:</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap ml-6">{lead.message}</p>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}
