'use client';

import { useParams, useRouter } from 'next/navigation';
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
  ChevronDownIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoading: authLoading } = useAdminAuth();
  const candidateId = params.id as string;
  const [retrying, setRetrying] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Fetch journey breakdown
  const { data: journeyData, isLoading: loadingJourney, refetch } = trpc.platformAdmin.getCandidateJourneyBreakdown.useQuery(
    { candidateId },
    { enabled: !authLoading && !!candidateId }
  );

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

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'start': return '🚀';
      case 'end': return '🏁';
      case 'assessment': return '📝';
      case 'interview': 
      case 'video-interview': 
      case 'video_question': return '🎥';
      case 'scoring_gate':
      case 'scoring-gate': return '⚖️';
      case 'decision': return '🔀';
      case 'email':
      case 'send-email': return '📧';
      case 'delay': return '⏳';
      default: return '📌';
    }
  };

  const getStatusColor = (status: string, hasFailed: boolean) => {
    if (hasFailed) return 'bg-red-100 border-red-300 text-red-800';
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-300 text-green-800';
      case 'current':
      case 'in_progress': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'pending': return 'bg-gray-100 border-gray-300 text-gray-600';
      case 'skipped': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getStatusBadge = (status: string, hasFailed: boolean) => {
    if (hasFailed) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Failed</span>;
    }
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Completed</span>;
      case 'current':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 animate-pulse">Current</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">In Progress</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Pending</span>;
      case 'skipped':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">Skipped</span>;
      default:
        return null;
    }
  };

  if (authLoading || loadingJourney) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!journeyData || journeyData.status === 'NOT_FOUND') {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Candidate Not Found</h2>
            <p className="text-gray-500 mt-2">No journey session found for this candidate</p>
            <button onClick={() => router.back()} className="mt-4 text-blue-600 hover:underline">
              Go Back
            </button>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  const summary = journeyData.summary;
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
                  <h1 className="text-2xl font-bold text-gray-900">{journeyData.candidateName}</h1>
                  <p className="text-gray-600">{journeyData.journeyName} • {journeyData.organizationName}</p>
                </div>
              </div>
              {hasFailed && (
                <button
                  onClick={handleRetry}
                  disabled={retrying}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    retrying ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Candidate</p>
                  <p className="font-medium text-gray-900">{journeyData.candidateName}</p>
                </div>
              </div>
              {journeyData.candidateEmail && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 truncate text-sm">{journeyData.candidateEmail}</p>
                  </div>
                </div>
              )}
              {journeyData.organizationName && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Organization</p>
                    <p className="font-medium text-gray-900">{journeyData.organizationName}</p>
                  </div>
                </div>
              )}
              {journeyData.positionTitle && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <PlayIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Position</p>
                    <p className="font-medium text-gray-900">{journeyData.positionTitle}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Journey Progress</span>
                <span className="text-sm font-bold text-gray-900">{journeyData.completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${hasFailed ? 'bg-red-500' : 'bg-blue-600'}`}
                  style={{ width: `${journeyData.completionPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Started: {new Date(journeyData.startedAt).toLocaleString()}</span>
                {journeyData.lastActivityAt && (
                  <span>Last Activity: {new Date(journeyData.lastActivityAt).toLocaleString()}</span>
                )}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
              <p className="text-xs text-gray-500">Total Steps</p>
            </div>
            <div className="bg-green-50 border-green-200 rounded-lg shadow-sm border p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className={`rounded-lg shadow-sm border p-4 text-center ${summary.inProgress > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${summary.inProgress > 0 ? 'text-blue-600' : 'text-gray-900'}`}>{summary.inProgress}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{summary.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className={`rounded-lg shadow-sm border p-4 text-center ${summary.failed > 0 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
              <p className={`text-2xl font-bold ${summary.failed > 0 ? 'text-red-600' : 'text-gray-900'}`}>{summary.failed}</p>
              <p className="text-xs text-gray-500">Failed</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
              <p className="text-2xl font-bold text-gray-400">{summary.skipped}</p>
              <p className="text-xs text-gray-500">Skipped</p>
            </div>
          </div>

          {/* Journey Nodes Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Journey Breakdown</h2>
              <p className="text-sm text-gray-500">Step-by-step progress through the journey</p>
            </div>

            <div className="divide-y divide-gray-100">
              {journeyData.nodes.map((node: any, index: number) => {
                const isExpanded = expandedNodes.has(node.id);
                const hasPipeline = node.processingPipeline && node.processingPipeline.length > 0;
                
                return (
                  <div key={node.id} className={`${node.isCurrent ? 'bg-blue-50' : ''}`}>
                    {/* Node Header */}
                    <div 
                      className={`px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                        node.isCurrent ? 'hover:bg-blue-100' : ''
                      }`}
                      onClick={() => hasPipeline && toggleNode(node.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-lg">
                          {getNodeIcon(node.type)}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-400 font-mono">#{index + 1}</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{node.label}</span>
                              {node.isActionable && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-100 text-blue-700">
                                  ACTION
                                </span>
                              )}
                            </div>
                            {node.description && (
                              <p className="text-xs text-gray-500 mt-0.5">{node.description}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">Type: {node.type}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {node.hasFailed && (
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                        )}
                        {getStatusBadge(node.status, node.hasFailed)}
                        {hasPipeline && (
                          <div className="text-gray-400">
                            {isExpanded ? (
                              <ChevronDownIcon className="h-5 w-5" />
                            ) : (
                              <ChevronRightIcon className="h-5 w-5" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Processing Pipeline */}
                    {isExpanded && hasPipeline && (
                      <div className="px-6 pb-4 bg-gray-50">
                        <div className="ml-12 space-y-3">
                          {node.processingPipeline.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-lg border p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    item.type === 'interview' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {item.type}
                                  </span>
                                  <p className="text-sm text-gray-700 mt-1">{item.questionText}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  item.processingStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                  item.processingStatus === 'FAILED' ? 'bg-red-100 text-red-700' :
                                  item.processingStatus === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {item.processingStatus}
                                </span>
                              </div>

                              {/* Pipeline Steps */}
                              <div className="flex items-center space-x-2 text-xs">
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded ${
                                  item.videoUploaded ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {item.videoUploaded ? <CheckCircleIcon className="h-4 w-4" /> : <ClockIcon className="h-4 w-4" />}
                                  <span>Video</span>
                                </div>
                                <span className="text-gray-300">→</span>
                                
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded ${
                                  item.transcriptionCompleted ? 'bg-green-100 text-green-800' :
                                  item.transcriptionError ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-500'
                                }`}>
                                  {item.transcriptionCompleted ? <CheckCircleIcon className="h-4 w-4" /> :
                                   item.transcriptionError ? <XCircleIcon className="h-4 w-4" /> :
                                   <ClockIcon className="h-4 w-4" />}
                                  <span>Transcription</span>
                                </div>
                                <span className="text-gray-300">→</span>
                                
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded ${
                                  item.aiEvaluationCompleted ? 'bg-green-100 text-green-800' :
                                  item.aiEvaluationError ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-500'
                                }`}>
                                  {item.aiEvaluationCompleted ? <CheckCircleIcon className="h-4 w-4" /> :
                                   item.aiEvaluationError ? <XCircleIcon className="h-4 w-4" /> :
                                   <ClockIcon className="h-4 w-4" />}
                                  <span>AI Eval</span>
                                </div>
                                <span className="text-gray-300">→</span>
                                
                                <div className={`flex items-center space-x-1 px-2 py-1 rounded ${
                                  item.scoreGenerated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {item.scoreGenerated ? <CheckCircleIcon className="h-4 w-4" /> : <ClockIcon className="h-4 w-4" />}
                                  <span>Score</span>
                                </div>
                              </div>

                              {/* Error display */}
                              {(item.transcriptionError || item.aiEvaluationError) && (
                                <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                                  <strong>Error:</strong> {item.transcriptionError || item.aiEvaluationError}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
