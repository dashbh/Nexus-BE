#!/usr/bin/env node

/**
 * Health Check Script for Gateway Service
 * Used by Docker health checks and monitoring systems
 */

import * as http from 'http';

const HEALTH_CHECK_URL =
  process.env.HEALTH_CHECK_URL || 'http://localhost:3000/health';
const TIMEOUT = parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000');

interface HealthCheckResult {
  status: 'healthy';
  statusCode: number;
  data?: unknown;
}

interface HealthCheckError extends Error {
  status: 'unhealthy';
  statusCode?: number;
  error: string;
}

/**
 * Perform health check
 */
function performHealthCheck(): Promise<HealthCheckResult> {
  return new Promise((resolve, reject) => {
    const url = new URL(HEALTH_CHECK_URL);

    const options: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: 'GET',
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'HealthCheck/1.0',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const healthData: unknown = JSON.parse(data);
            resolve({
              status: 'healthy',
              statusCode: res.statusCode,
              data: healthData,
            });
          } catch (parseError) {
            // JSON parsing failed, but health check still passed with 200 status
            resolve({
              status: 'healthy',
              statusCode: res.statusCode,
              data: {
                message: 'Health check passed',
                warning: `Response parsing failed: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
              },
            });
          }
        } else {
          const errorResult = new Error(
            `HTTP ${res.statusCode}: ${data}`,
          ) as HealthCheckError;
          errorResult.status = 'unhealthy';
          errorResult.statusCode = res.statusCode;
          errorResult.error = `HTTP ${res.statusCode}: ${data}`;
          reject(errorResult);
        }
      });
    });

    req.on('error', (error: Error) => {
      const errorResult = new Error(
        `Connection error: ${error.message}`,
      ) as HealthCheckError;
      errorResult.status = 'unhealthy';
      errorResult.error = `Connection error: ${error.message}`;
      reject(errorResult);
    });

    req.on('timeout', () => {
      req.destroy();
      const errorResult = new Error(
        `Health check timeout after ${TIMEOUT}ms`,
      ) as HealthCheckError;
      errorResult.status = 'unhealthy';
      errorResult.error = `Health check timeout after ${TIMEOUT}ms`;
      reject(errorResult);
    });

    req.end();
  });
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  try {
    const result = await performHealthCheck();

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Health Check Passed');
      console.log(`Status: ${result.status}`);
      console.log(`HTTP Status: ${result.statusCode}`);
      if (result.data) {
        console.log('Response:', JSON.stringify(result.data, null, 2));
      }
    }

    process.exit(0);
  } catch (error) {
    const healthError = error as HealthCheckError;

    if (process.env.NODE_ENV !== 'production') {
      console.error('❌ Health Check Failed');
      console.error(`Status: ${healthError.status}`);
      if (healthError.statusCode) {
        console.error(`HTTP Status: ${healthError.statusCode}`);
      }
      console.error(`Error: ${healthError.error}`);
    }

    process.exit(1);
  }
}

// Handle process signals
process.on('SIGTERM', () => {
  console.log('Health check interrupted by SIGTERM');
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('Health check interrupted by SIGINT');
  process.exit(1);
});

// Run health check
void main();
