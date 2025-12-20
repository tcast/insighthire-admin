'use client';
export const dynamic = 'force-dynamic';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useAdminAuth } from '@/lib/use-admin-auth';
import {
  CpuChipIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function BackgroundJobsPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAdminAuth();
  const [queueFilter, setQueueFilter] = useState<'all' | 'transcription' | 'scoring'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  // Real-time polling (every 10 seconds)
  const { data: queues, refetch: refetchQueues } = trpc.platformAdmin.getJobQueues.useQuery(undefined, {
    refetchInterval: autoRefresh ? 10000 : false,
    retry: false,
  });

  const { data: failedJobs, refetch: refetchFailed } = trpc.platformAdmin.getFailedJobs.useQuery({
    queue: queueFilter,
  }, {
    refetchInterval: autoRefresh ? 30000 : false,
    retry: false,
  });

  const { data: stats } = trpc.platformAdmin.getJobStatistics.useQuery(undefined, {
    refetchInterval: autoRefresh ? 30000 : false,
    retry: false,
  });

  const { data: performance } = trpc.platformAdmin.getJobPerformance.useQuery(undefined, {
    refetchInterval: autoRefresh ? 60000 : false,
    retry: false,
  });

  const { data: alerts } = trpc.platformAdmin.getJobAlerts.useQuery(undefined, {
    refetchInterval: autoRefresh ? 30000 : false,
    retry: false,
  });

  const retryJob = trpc.platformAdmin.retryJob.useMutation({
    onSuccess: () => {
      refetchQueues();
      refetchFailed();
    },
  });

  const bulkRetry = trpc.platformAdmin.bulkRetryJobs.useMutation({
    onSuccess: (data) => {
      alert(`Retried ${data.total} jobs successfully!`);
      refetchQueues();
      refetchFailed();
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleRetry = async (jobId: string, jobType: 'transcription' | 'scoring') => {
    if (!confirm('Retry this job?')) return;

    try {
      await retryJob.mutateAsync({ jobId, jobType });
      alert('Job queued for retry');
    } catch (error: any) {
      alert('Retry failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Background Jobs</h1>
            <p className="text-gray-600">Monitor and manage background processing</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Auto-refresh</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-600">{autoRefresh ? 'Live' : 'Paused'}</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts && alerts.alerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {alerts.alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 border-red-200'
                    : alert.severity === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start">
                  <ExclamationTriangleIcon
                    className={`h-5 w-5 mr-3 flex-shrink-0 ${
                      alert.severity === 'critical'
                        ? 'text-red-600'
                        : alert.severity === 'warning'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}
                  />
                  <div>
                    <p className={`font-medium ${
                      alert.severity === 'critical'
                        ? 'text-red-900'
                        : alert.severity === 'warning'
                        ? 'text-yellow-900'
                        : 'text-blue-900'
                    }`}>
                      {alert.message}
                    </p>
                    <p className={`text-sm mt-1 ${
                      alert.severity === 'critical'
                        ? 'text-red-700'
                        : alert.severity === 'warning'
                        ? 'text-yellow-700'
                        : 'text-blue-700'
                    }`}>
                      Action: {alert.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Queue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {queues?.queues.map((queue) => (
            <div key={queue.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CpuChipIcon className="h-8 w-8 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {queue.name.replace('-', ' ')}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-yellow-900">{queue.waiting}</div>
                  <div className="text-xs text-yellow-700">Waiting</div>
                </div>

                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <ArrowPathIcon className="h-6 w-6 text-blue-600 mx-auto mb-1 animate-spin" />
                  <div className="text-2xl font-bold text-blue-900">{queue.active}</div>
                  <div className="text-xs text-blue-700">Active</div>
                </div>

                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-900">{queue.completed}</div>
                  <div className="text-xs text-green-700">Last 24h</div>
                </div>

                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <XCircleIcon className="h-6 w-6 text-red-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-red-900">{queue.failed}</div>
                  <div className="text-xs text-red-700">Failed</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Failed Jobs */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">Failed Jobs</h2>
                {failedJobs && failedJobs.jobs.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm(`Retry all ${failedJobs.jobs.length} failed jobs?`)) {
                        bulkRetry.mutate({ jobType: queueFilter });
                      }
                    }}
                    disabled={bulkRetry.isLoading}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {bulkRetry.isLoading ? 'Retrying...' : 'Retry All'}
                  </button>
                )}
              </div>
              <select
                value={queueFilter}
                onChange={(e) => setQueueFilter(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm text-gray-900 bg-white"
              >
                <option value="all" className="text-gray-900">All Queues</option>
                <option value="transcription">Transcription Only</option>
                <option value="scoring">Scoring Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Failed At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {failedJobs?.jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {job.id.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {job.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {job.organizationName || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 max-w-xs truncate">
                      {job.error || 'Unknown error'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(job.failedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRetry(job.id, job.type as any)}
                        disabled={retryJob.isLoading}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                        <span>Retry</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {failedJobs?.jobs.length === 0 && (
              <div className="text-center py-12">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">No failed jobs!</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Processing Statistics (24h)</h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.transcription.completed || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.transcription.failed || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.transcription.pending || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.transcription.avg_processing_time
                    ? Math.round(parseFloat(stats.transcription.avg_processing_time))
                    : 0}s
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
