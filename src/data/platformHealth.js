/**
 * Platform Health Monitoring Data
 *
 * Generates and manages platform health monitoring data for the VoltForge system.
 * This module creates realistic metrics for API performance, queue status,
 * job execution, CI/CD builds, and system logs for operational monitoring.
 *
 * Monitoring categories:
 * - API Latency: Response time metrics for API endpoints
 * - Ingestion Queues: Message queue health and throughput
 * - Background Jobs: Scheduled task execution status
 * - CI/CD Builds: Build pipeline status and deployment metrics
 * - System Logs: Real-time log stream from all services
 *
 * @author VoltForge Team
 * @version 1.0.0
 */

/**
 * Seeded random number generator for consistent platform health data
 * @param {number} seed - Seed value for reproducible random sequences
 * @returns {Function} Random number generator function
 */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Initialize random generator for consistent platform health data
const rand = seededRandom(1234);

/**
 * Generates realistic API latency time-series data
 * Creates response time metrics with occasional spikes to simulate real load patterns
 *
 * @param {number} points - Number of data points to generate (default: 60)
 * @returns {Array} Array of latency data points with timestamps
 */
export function generateApiLatencyData(points = 60) {
  const data = [];
  const now = Date.now();

  for (let i = 0; i < points; i++) {
    // Generate timestamp for each minute over the last hour
    const ts = now - (points - i) * 60000;
    // Base latency with random variation (45-75ms)
    const base = 45 + rand() * 30;
    // Occasional latency spikes (8% probability)
    const spike = rand() < 0.08 ? rand() * 200 : 0;

    data.push({
      timestamp: new Date(ts).toISOString(),
      latency: parseFloat((base + spike).toFixed(1)),
      endpoint: rand() > 0.5 ? "/api/telemetry" : "/api/assets",
    });
  }
  return data;
}

/**
 * Message queue health metrics for data ingestion pipelines
 * Each queue represents a different data processing pipeline
 */
export const ingestionQueues = [
  {
    name: "telemetry-ingest",
    depth: Math.floor(rand() * 500),
    throughput: `${(12000 + rand() * 5000).toFixed(0)} msg/s`,
    status: "healthy",
    lag: `${(rand() * 2).toFixed(1)}s`,
  },
  {
    name: "alert-processor",
    depth: Math.floor(rand() * 100),
    throughput: `${(800 + rand() * 400).toFixed(0)} msg/s`,
    status: "healthy",
    lag: `${(rand() * 1).toFixed(1)}s`,
  },
  {
    name: "qc-validation-worker",
    depth: Math.floor(rand() * 50),
    throughput: `${(200 + rand() * 100).toFixed(0)} msg/s`,
    status: rand() > 0.3 ? "healthy" : "degraded",
    lag: `${(rand() * 5).toFixed(1)}s`,
  },
  {
    name: "firmware-sync",
    depth: Math.floor(rand() * 20),
    throughput: `${(50 + rand() * 30).toFixed(0)} msg/s`,
    status: "healthy",
    lag: `${(rand() * 3).toFixed(1)}s`,
  },
];

/**
 * Background job execution status and metrics
 * Represents scheduled tasks for data processing and maintenance
 */
export const recentJobs = [
  {
    id: "JOB-8001",
    name: "Nightly Telemetry Aggregation",
    status: "completed",
    duration: "4m 23s",
    completedAt: "2025-11-14T03:04:23Z",
  },
  {
    id: "JOB-8002",
    name: "QC Baseline Recalculation",
    status: "completed",
    duration: "12m 08s",
    completedAt: "2025-11-14T02:15:00Z",
  },
  {
    id: "JOB-8003",
    name: "Asset Health Score Refresh",
    status: "failed",
    duration: "1m 47s",
    completedAt: "2025-11-14T01:47:00Z",
    error: "Timeout: upstream telemetry service unreachable",
  },
  {
    id: "JOB-8004",
    name: "Firmware Compatibility Matrix Build",
    status: "completed",
    duration: "2m 11s",
    completedAt: "2025-11-13T22:00:00Z",
  },
  {
    id: "JOB-8005",
    name: "Incident Auto-Triage",
    status: "running",
    duration: "—",
    completedAt: null,
  },
  {
    id: "JOB-8006",
    name: "Site Capacity Forecasting",
    status: "completed",
    duration: "8m 54s",
    completedAt: "2025-11-13T18:30:00Z",
  },
];

/**
 * CI/CD pipeline build status and deployment metrics
 * Tracks build success rates, duration, and deployment frequency
 */
export const cicdBuilds = [
  {
    id: "BLD-450",
    branch: "main",
    status: "success",
    commit: "a3f8c2d",
    author: "R. Chen",
    duration: "3m 12s",
    timestamp: "2025-11-14T10:30:00Z",
  },
  {
    id: "BLD-449",
    branch: "feat/qc-v2",
    status: "success",
    commit: "b7e1f09",
    author: "A. Kumar",
    duration: "3m 45s",
    timestamp: "2025-11-14T09:15:00Z",
  },
  {
    id: "BLD-448",
    branch: "fix/thermal-alert",
    status: "failed",
    commit: "c2d4e6f",
    author: "J. Martinez",
    duration: "2m 01s",
    timestamp: "2025-11-14T08:00:00Z",
  },
  {
    id: "BLD-447",
    branch: "main",
    status: "success",
    commit: "d9a0b3c",
    author: "S. Okafor",
    duration: "3m 08s",
    timestamp: "2025-11-13T22:45:00Z",
  },
];

/**
 * Real-time system log stream from all platform services
 * Provides operational insights and debugging information
 */
export const logStream = [
  {
    ts: "10:32:14",
    level: "INFO",
    service: "telemetry-ingest",
    message: "Batch processed: 12,847 events in 1.2s",
  },
  {
    ts: "10:32:12",
    level: "WARN",
    service: "alert-processor",
    message:
      "Alert dedup rate high: 34% — possible sensor flapping on site-004",
  },
  {
    ts: "10:31:58",
    level: "INFO",
    service: "api-gateway",
    message: "Health check OK — all downstream services responsive",
  },
  {
    ts: "10:31:45",
    level: "ERROR",
    service: "qc-worker",
    message: "Job QC-1024 timeout after 120s — retrying (attempt 2/3)",
  },
  {
    ts: "10:31:30",
    level: "INFO",
    service: "firmware-sync",
    message: "Firmware v5.0.0-rc2 propagated to 18/24 assets at site-004",
  },
  {
    ts: "10:31:15",
    level: "INFO",
    service: "asset-registry",
    message: "Asset VF-00042 health score updated: 87.2 → 84.1",
  },
  {
    ts: "10:30:58",
    level: "WARN",
    service: "telemetry-ingest",
    message:
      "Partition rebalance triggered on kafka topic voltforge.telemetry.raw",
  },
  {
    ts: "10:30:42",
    level: "INFO",
    service: "api-gateway",
    message:
      "Rate limit applied: 429 returned to client 10.0.3.47 (exceeded 1000 req/min)",
  },
];
