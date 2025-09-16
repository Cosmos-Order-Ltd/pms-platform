import { NextRequest, NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  build: {
    version: string;
    timestamp: string;
    environment: string;
  };
  dependencies: {
    api: 'connected' | 'disconnected' | 'error';
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';

  // Check API connectivity
  let apiStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      apiStatus = 'connected';
    } else {
      apiStatus = 'error';
      overallStatus = 'degraded';
    }
  } catch (error) {
    apiStatus = 'error';
    overallStatus = 'degraded';
    console.error('API health check failed:', error);
  }

  const healthStatus: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    service: 'pms-marketplace',
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor(process.uptime()),
    build: {
      version: process.env.npm_package_version || '1.0.0',
      timestamp: process.env.BUILD_TIME || new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
    dependencies: {
      api: apiStatus,
    },
  };

  const responseTime = Date.now() - startTime;
  const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

  return NextResponse.json(
    {
      ...healthStatus,
      responseTime: `${responseTime}ms`,
    },
    { status: statusCode }
  );
}

// Liveness probe
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}