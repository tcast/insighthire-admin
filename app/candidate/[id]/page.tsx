'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { useAdminAuth } from '@/lib/use-admin-auth';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlayIcon,
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading: authLoading } = useAdminAuth();
  const candidateId = params.id as string;
  const [retrying, setRetrying] = useState(false);

  // Fetch pipeline status
  const { data: pipelineData, isLoading: loadingPipeline, refetch } = trpc.platformAdmin.getProcessingPipelineStatus.useQuery(
    { candidateId },
    { enabled: !authLoading && !!candidateId }
  );

  // Fetch candidate's journey session info
  const { data: stuckData } = trpc.platformAdmin.getStuckCandidates.useQuery(
    { stuckType: 'all', limit: 200 },
    { enabled: !authLoading }
  );

  // Find this candidate in stuck data for extra info
  const candidateInfo = stuckData?.candidates?.find((c: any) => c.candidateId === candidateId);

  // Retry mutation
  const retryMutation = trpc.platformAdmin.retryStuckCandidate.useMutation();

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await retryMutation.mutateAsync({ candidateId, retryType: 'all' });
      await refetch();
      alert('Retry initiated successfully!');
    } catch (error) {
      alert('Retry failed: ' + (error as Error).message);
    } finally {
      setRetrying(false);
    }
  };

  if (authLoading || loadingPipeline) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  const summary = pipelineData?.summary || { total: 0, completed: 0, failed: 0, inProgress: 0, pending: 0 };
  const hasFailed = summary.failed > 0;

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {candidateInfo?.candidateName || 'Candidate Details'}
                  </h1>
                  <p className="text-gray-600">Processing Pipeline & Journey Progress</p>
                </div>
              </div>
              {hasFailed && (
                <button
                  onClick={handleRetry}
                  disabled={retrying}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    retrying ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  <ArrowPathIcon className={`h-5 w-5 ${retrying ? 'animate-spin' : ''}`} />
                  <span>{retrying ? 'Retrying...' : 'Retry Failed Jobs'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Candidate Info Card */}
          {candidateInfo && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Candidate</p>
                    <p className="font-medium text-gray-900">{candidateInfo.candidateName}</p>
                  </div>
                </div>
                {candidateInfo.candidateEmail && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900 truncate">{candidateInfo.candidateEmail}</p>
                    </div>
                  </div>
                )}
                {candidateInfo.organizationName && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Organization</p>
                      <p className="font-medium text-gray-900">{candidateInfo.organizationName}</p>
                    </div>
                  </div>
                )}
                {candidateInfo.journeyName && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <PlayIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Journey</p>
                      <p className="font-medium text-gray-900">{candidateInfo.journeyName}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Journey Progress</span>
                  <span className="text-sm font-bold text-gray-900">{candidateInfo.completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${candidateInfo.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
              <p className="text-sm text-gray-500">Total Responses</p>
            </div>
            <div className="bg-green-50 border-green-200 rounded-lg shadow-sm border p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className={`rounded-lg shadow-sm border p-4 text-center ${summary.failed > 0 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${summary.failed > 0 ? 'text-red-600' : 'text-gray-900'}`}>{summary.failed}</p>
              <p className="text-sm text-gray-500">Failed</p>
            </div>
            <div className={`rounded-lg shadow-sm border p-4 text-center ${summary.inProgress > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${summary.inProgress > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>{summary.inProgress}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{summary.pending}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>

          {/* Processing Pipeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Processing Pipeline</h2>
              <p className="text-sm text-gray-500">Video → Transcription → AI Evaluation → Score</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              {pipelineData?.responses && pipelineData.responses.length > 0 ? (
                pipelineData.responses.map((response: any) => (
                  <div key={response.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            response.type === 'interview' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {response.type === 'interview' ? 'Interview' : 'Assessment'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            response.overallStatus === 'completed' ? 'bg-green-100 text-green-800' :
                            response.overallStatus === 'failed' ? 'bg-red-100 text-red-800' :
                            response.overallStatus === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {response.overallStatus}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium">{response.questionText}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(response.createdAt).toLocaleString()}
                          {response.processedAt && ` • Processed: ${new Date(response.processedAt).toLocaleString()}`}
                        </p>
                      </div>
                    </div>

                    {/* Pipeline Steps */}
                    <div className="flex items-center space-x-4">
                      {/* Video */}
                      <div className={`flex-1 p-3 rounded-lg ${
                        response.videoUploaded ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {response.videoUploaded ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                          )}
                          <span className={`text-sm font-medium ${response.videoUploaded ? 'text-green-800' : 'text-gray-500'}`}>
                            Video Uploaded
                          </span>
                        </div>
                      </div>

                      <div className="text-gray-300">→</div>

                      {/* Transcription */}
                      <div className={`flex-1 p-3 rounded-lg ${
                        response.transcriptionCompleted ? 'bg-green-50 border border-green-200' :
                        response.transcriptionError ? 'bg-red-50 border border-red-200' :
                        'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {response.transcriptionCompleted ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          ) : response.transcriptionError ? (
                            <XCircleIcon className="h-5 w-5 text-red-600" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                          )}
                          <span className={`text-sm font-medium ${
                            response.transcriptionCompleted ? 'text-green-800' :
                            response.transcriptionError ? 'text-red-800' : 'text-gray-500'
                          }`}>
                            Transcription
                          </span>
                        </div>
                        {response.transcriptionError && (
                          <p className="text-xs text-red-600 mt-1 truncate">{response.transcriptionError}</p>
                        )}
                      </div>

                      <div className="text-gray-300">→</div>

                      {/* AI Evaluation */}
                      <div className={`flex-1 p-3 rounded-lg ${
                        response.aiEvaluationCompleted ? 'bg-green-50 border border-green-200' :
                        response.aiEvaluationError ? 'bg-red-50 border border-red-200' :
                        'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {response.aiEvaluationCompleted ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          ) : response.aiEvaluationError ? (
                            <XCircleIcon className="h-5 w-5 text-red-600" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                          )}
                          <span className={`text-sm font-medium ${
                            response.aiEvaluationCompleted ? 'text-green-800' :
                            response.aiEvaluationError ? 'text-red-800' : 'text-gray-500'
                          }`}>
                            AI Evaluation
                          </span>
                        </div>
                        {response.aiEvaluationError && (
                          <p className="text-xs text-red-600 mt-1 truncate">{response.aiEvaluationError}</p>
                        )}
                      </div>

                      <div className="text-gray-300">→</div>

                      {/* Score */}
                      <div className={`flex-1 p-3 rounded-lg ${
                        response.scoreGenerated ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {response.scoreGenerated ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          ) : (
                            <ClockIcon className="h-5 w-5 text-gray-400" />
                          )}
                          <span className={`text-sm font-medium ${response.scoreGenerated ? 'text-green-800' : 'text-gray-500'}`}>
                            Score Generated
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500">No responses found for this candidate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
