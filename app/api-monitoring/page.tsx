'use client';
export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  RefreshCw, 
  Server, 
  Shield, 
  Zap,
  XCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ApiService {
  id: string;
  name: string;
  displayName: string;
  category: string;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  isCritical: boolean;
  lastCheck?: string;
  responseTime?: number;
  errorCount?: number;
}

interface ServiceMetrics {
  uptime: number;
  avgResponseTime: number;
  errorRate: number;
  totalRequests: number;
  failedRequests: number;
  last24Hours: {
    uptime: number;
    avgResponseTime: number;
    errorCount: number;
    requestCount: number;
  };
  last7Days: {
    uptime: number;
    avgResponseTime: number;
    errorCount: number;
    requestCount: number;
  };
}

interface ApiError {
  id: string;
  service: { displayName: string };
  errorType: string;
  errorMessage: string;
  severity: string;
  occurredAt: string;
  resolved: boolean;
}

interface StatusSummary {
  totalServices: number;
  healthy: number;
  degraded: number;
  down: number;
  critical: Array<{
    name: string;
    status: string;
    lastCheck?: string;
  }>;
  services: ApiService[];
}

export default function ApiMonitoringPage() {
  // Fixed errors array handling and AlertTitle import
  const [statusSummary, setStatusSummary] = useState<StatusSummary | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceMetrics, setServiceMetrics] = useState<ServiceMetrics | null>(null);
  const [recentErrors, setRecentErrors] = useState<ApiError[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(loadMonitoringData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.insighthire.com';
      const token = typeof window !== "undefined" && localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Load status summary
      const statusResponse = await fetch(`${apiUrl}/api/monitoring/status`, { headers });
      if (statusResponse.ok) {
        const data = await statusResponse.json();
        setStatusSummary(data);
      }

      // Load recent errors
      const errorsResponse = await fetch(`${apiUrl}/api/monitoring/errors?limit=20&resolved=false`, { headers });
      if (errorsResponse.ok) {
        const data = await errorsResponse.json();
        // Ensure we always have an array
        setRecentErrors(Array.isArray(data.errors) ? data.errors : []);
      } else {
        setRecentErrors([]);
      }
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadServiceDetails = async (serviceId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.insighthire.com';
      const token = typeof window !== "undefined" && localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${apiUrl}/api/monitoring/services/${serviceId}`, { headers });
      if (response.ok) {
        const data = await response.json();
        setServiceMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Failed to load service details:', error);
    }
  };

  const runHealthCheck = async (serviceId?: string) => {
    setRefreshing(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.insighthire.com';
      const token = typeof window !== "undefined" && localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const body = serviceId ? JSON.stringify({ serviceId }) : '{}';
      await fetch(`${apiUrl}/api/monitoring/health-check`, {
        method: 'POST',
        headers,
        body,
      });

      // Reload data after health check
      await loadMonitoringData();
      if (serviceId) {
        await loadServiceDetails(serviceId);
      }
    } catch (error) {
      console.error('Failed to run health check:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const resolveError = async (errorId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.insighthire.com';
      const token = typeof window !== "undefined" && localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      await fetch(`${apiUrl}/api/monitoring/errors/${errorId}/resolve`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ notes: 'Resolved from monitoring dashboard' }),
      });

      // Reload errors
      await loadMonitoringData();
    } catch (error) {
      console.error('Failed to resolve error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'down':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-700" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai':
        return <Zap className="h-5 w-5" />;
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'auth':
        return <Shield className="h-5 w-5" />;
      case 'infrastructure':
        return <Server className="h-5 w-5" />;
      case 'ats':
        return <Globe className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Monitoring Dashboard</h1>
          <p className="text-gray-800 mt-1">Track the health and performance of external API services</p>
        </div>
        <Button 
          onClick={() => runHealthCheck()} 
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Run Health Check
        </Button>
      </div>

      {/* Critical Alerts */}
      {statusSummary?.critical && statusSummary.critical.length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Critical Services Down</h3>
              <AlertDescription>
            <div className="mt-2 space-y-1">
              {statusSummary.critical.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="font-medium">{service.name}</span>
                  <Badge variant="destructive">{service.status}</Badge>
                </div>
              ))}
            </div>
          </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {/* Service Classification Info */}
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <AlertDescription className="text-gray-700">
              <strong className="text-gray-900">Critical Services</strong> are essential for core application functionality. 
              If these services go down, users will experience significant issues. 
              <strong className="text-gray-900"> Non-Critical Services</strong> are supplementary and won't block core features if unavailable.
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{statusSummary?.totalServices || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Healthy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {statusSummary?.healthy || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Degraded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {statusSummary?.degraded || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Down
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {statusSummary?.down || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="errors">Recent Errors</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {statusSummary?.services.map((service) => (
              <Card 
                key={service.id} 
                className={`bg-white text-gray-900 cursor-pointer transition-all hover:shadow-lg ${
                  selectedService === service.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedService(service.id);
                  loadServiceDetails(service.id);
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(service.category)}
                      <div>
                        <CardTitle className="text-lg text-gray-900">{service.displayName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant={service.isCritical ? 'default' : 'secondary'}>
                            {service.isCritical ? 'Critical Service' : 'Non-Critical'}
                          </Badge>
                          <Badge variant="outline">{service.category}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Status</span>
                      <Badge 
                        variant={
                          service.status === 'healthy' ? 'success' :
                          service.status === 'degraded' ? 'warning' :
                          service.status === 'down' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {service.status}
                      </Badge>
                    </div>
                    {service.responseTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Response Time</span>
                        <span className="font-medium">{service.responseTime}ms</span>
                      </div>
                    )}
                    {service.lastCheck && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Last Check</span>
                        <span className="font-medium">
                          {new Date(service.lastCheck).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    {service.status !== 'healthy' && (service as any).errorMessage && (
                      <div className="mt-2 text-xs text-gray-700">
                        <span className="font-medium">Note:</span> {(service as any).errorMessage}
                      </div>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        runHealthCheck(service.id);
                      }}
                    >
                      Check Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Service Details */}
          {selectedService && serviceMetrics && (
            <Card className="mt-6 bg-white text-gray-900">
              <CardHeader>
                <CardTitle className="text-gray-900">Service Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-700">24h Uptime</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={serviceMetrics.last24Hours.uptime} className="flex-1" />
                      <span className="text-sm font-medium">
                        {serviceMetrics.last24Hours.uptime.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Avg Response Time (24h)</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                      {serviceMetrics.last24Hours.avgResponseTime.toFixed(0)}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Error Count (24h)</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                      {serviceMetrics.last24Hours.errorCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Total Requests (24h)</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                      {serviceMetrics.last24Hours.requestCount}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                  <div>
                    <p className="text-sm text-gray-700">7d Uptime</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={serviceMetrics.last7Days.uptime} className="flex-1" />
                      <span className="text-sm font-medium">
                        {serviceMetrics.last7Days.uptime.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Avg Response Time (7d)</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                      {serviceMetrics.last7Days.avgResponseTime.toFixed(0)}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Error Count (7d)</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                      {serviceMetrics.last7Days.errorCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">Total Requests (7d)</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                      {serviceMetrics.last7Days.requestCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="space-y-4">
          <Card className="bg-white text-gray-900">
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Errors</CardTitle>
              <CardDescription>
                Unresolved errors from the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] overflow-y-auto pr-4">
                <div className="space-y-3">
                  {!recentErrors || recentErrors.length === 0 ? (
                    <div className="text-center py-8 text-gray-700">
                      No recent errors
                    </div>
                  ) : (
                    (recentErrors || []).map((error) => (
                      <Card key={error.id} className="p-4 bg-white text-gray-900">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getSeverityColor(error.severity)}>
                                {error.severity}
                              </Badge>
                              <Badge variant="outline">{error.errorType}</Badge>
                              <span className="text-sm text-gray-800">
                                {error.service.displayName}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {error.errorMessage}
                            </p>
                            <p className="text-xs text-gray-700">
                              {new Date(error.occurredAt).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveError(error.id)}
                          >
                            Resolve
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <Card className="bg-white text-gray-900">
            <CardHeader>
              <CardTitle className="text-gray-900">System Metrics</CardTitle>
              <CardDescription>
                Overall system performance and reliability metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Overall System Health</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">System Uptime</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {statusSummary && statusSummary.totalServices > 0
                          ? ((statusSummary.healthy / statusSummary.totalServices) * 100).toFixed(1)
                          : 0}%
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Critical Services</span>
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {statusSummary?.services.filter(s => s.isCritical).length || 0}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Active Incidents</span>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {statusSummary?.critical.length || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['ai', 'database', 'auth', 'infrastructure'].map((category) => {
                      const categoryServices = statusSummary?.services.filter(
                        s => s.category === category
                      ) || [];
                      const healthyCount = categoryServices.filter(
                        s => s.status === 'healthy'
                      ).length;

                      return (
                        <div key={category} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(category)}
                            <span className="text-sm font-medium capitalize">
                              {category}
                            </span>
                          </div>
                          <div className="text-xl font-bold">
                            {healthyCount}/{categoryServices.length}
                          </div>
                          <div className="text-xs text-gray-700">healthy</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
