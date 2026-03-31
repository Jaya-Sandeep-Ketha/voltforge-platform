/**
 * Platform Health Monitoring Page
 * 
 * Comprehensive system health monitoring interface for the VoltForge platform.
 * This page provides real-time monitoring of API performance, queue status,
 * background jobs, CI/CD builds, and system logs for operational visibility.
 * 
 * Monitoring capabilities:
 * - API latency tracking with SLA monitoring
 * - Message queue health and throughput metrics
 * - Background job execution status and failure tracking
 * - CI/CD pipeline build status and deployment metrics
 * - Real-time log streaming from all platform services
 * - System performance KPIs and trend analysis
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Server,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Gauge,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, KpiCard, LoadingPage, Badge, StatusDot } from '@/components/ui';
import { platformHealthService } from '@/services/api';

/**
 * Custom tooltip component for latency charts
 * Displays formatted latency values in milliseconds
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether tooltip is active
 * @param {Array} props.payload - Chart data payload
 * @returns {JSX.Element|null} Tooltip component or null
 */
const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-200 font-medium">{payload[0].value} ms</p>
    </div>
  );
};

/**
 * Log line component for displaying individual log entries
 * Provides color-coded log levels and animated entry effects
 * @param {Object} props - Component props
 * @param {Object} props.log - Log entry object with timestamp, level, service, and message
 * @param {number} props.delay - Animation delay for staggered entry effect
 * @returns {JSX.Element} Formatted log line component
 */
function LogLine({ log, delay }) {
  // Color mapping for different log levels
  const levelColors = {
    INFO: 'text-blue-400',
    WARN: 'text-amber-400',
    ERROR: 'text-red-400',
  };

  // Background color mapping for log level badges
  const levelBg = {
    INFO: 'bg-blue-400/10',
    WARN: 'bg-amber-400/10',
    ERROR: 'bg-red-400/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-start gap-2 py-1.5 font-mono text-[11px]"
    >
      <span className="text-zinc-700 w-16 flex-shrink-0">{log.ts}</span>
      <span className={`px-1.5 py-0 rounded text-[10px] font-semibold flex-shrink-0 ${levelColors[log.level]} ${levelBg[log.level]}`}>
        {log.level}
      </span>
      <span className="text-zinc-600 w-28 flex-shrink-0 truncate">{log.service}</span>
      <span className="text-zinc-400 flex-1">{log.message}</span>
    </motion.div>
  );
}

/**
 * Platform Health Monitoring Component
 * 
 * Loads and displays comprehensive platform health metrics including API performance,
 * queue status, job execution, CI/CD builds, and real-time log streaming. Provides
 * operational visibility for system administrators and DevOps teams.
 * 
 * @returns {JSX.Element} Platform health monitoring page component
 */
export function PlatformHealth() {
  // State management for platform health data
  const [loading, setLoading] = useState(true);
  const [latencyData, setLatencyData] = useState([]);
  const [queues, setQueues] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [logs, setLogs] = useState([]);

  /**
   * Load all platform health metrics on component mount
   * Fetches data in parallel for optimal performance
   */
  useEffect(() => {
    async function load() {
      const [lat, q, j, b, l] = await Promise.all([
        platformHealthService.getLatency(),
        platformHealthService.getQueues(),
        platformHealthService.getJobs(),
        platformHealthService.getBuilds(),
        platformHealthService.getLogs(),
      ]);
      setLatencyData(lat);
      setQueues(q);
      setJobs(j);
      setBuilds(b);
      setLogs(l);
      setLoading(false);
    }
    load();
  }, []);

  // Loading state handling
  if (loading) return <LoadingPage />;

  // Calculate performance metrics
  const avgLatency = (latencyData.reduce((s, d) => s + d.latency, 0) / latencyData.length).toFixed(1);
  const p99Latency = [...latencyData].sort((a, b) => b.latency - a.latency)[Math.floor(latencyData.length * 0.01)]?.latency?.toFixed(1) || '—';
  const failedJobs = jobs.filter((j) => j.status === 'failed').length;
  const runningJobs = jobs.filter((j) => j.status === 'running').length;

  // Transform latency data for chart visualization
  const chartData = latencyData.map((d, i) => ({
    idx: i,
    latency: d.latency,
    endpoint: d.endpoint,
  }));

  return (
    <div className="space-y-6">
      {/* Performance KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Avg API Latency" value={avgLatency} unit="ms" icon={Gauge} delay={0} />
        <KpiCard 
          label="P99 Latency" 
          value={p99Latency} 
          unit="ms" 
          icon={Activity} 
          delay={0.05} 
          changeType={parseFloat(p99Latency) > 150 ? 'negative' : 'positive'} 
          change={parseFloat(p99Latency) > 150 ? 'Above SLA' : 'Within SLA'} 
        />
        <KpiCard 
          label="Failed Jobs (24h)" 
          value={failedJobs} 
          icon={XCircle} 
          delay={0.1} 
          changeType={failedJobs > 0 ? 'negative' : 'positive'} 
          change={failedJobs > 0 ? 'Needs investigation' : 'All clear'} 
        />
        <KpiCard label="Active Jobs" value={runningJobs} icon={Server} delay={0.15} />
      </div>

      {/* API Latency Chart and Queue Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* API Latency Time Series Chart */}
        <Card hover={false} className="lg:col-span-2">
          <CardHeader>
            <CardTitle>API Latency (Last 60 min)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e22" />
                  <XAxis dataKey="idx" hide />
                  <YAxis tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={150} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'SLA 150ms', fill: '#ef4444', fontSize: 10, position: 'right' }} />
                  <Area type="monotone" dataKey="latency" stroke="#ef4444" strokeWidth={1.5} fill="url(#latGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Message Queue Status */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Ingestion Queues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {queues.map((q) => (
              <div key={q.name} className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-zinc-300">{q.name}</span>
                  <StatusDot status={q.status === 'healthy' ? 'healthy' : 'warning'} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <p className="text-zinc-600 uppercase">Depth</p>
                    <p className="text-zinc-400 font-mono">{q.depth}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 uppercase">Throughput</p>
                    <p className="text-zinc-400 font-mono">{q.throughput}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 uppercase">Lag</p>
                    <p className="text-zinc-400 font-mono">{q.lag}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Background Jobs and CI/CD Builds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Background Jobs */}
        <Card hover={false}>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Jobs</CardTitle>
            <Badge variant="default">{jobs.length} total</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/40">
              {jobs.map((job) => {
                // Status icon mapping with animation for running jobs
                const statusIcon = {
                  completed: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
                  failed: <XCircle className="h-4 w-4 text-red-400" />,
                  running: <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}><Clock className="h-4 w-4 text-blue-400" /></motion.div>,
                };

                return (
                  <div key={job.id} className="px-5 py-3 hover:bg-zinc-800/20 transition-colors">
                    <div className="flex items-center gap-3">
                      {statusIcon[job.status] || statusIcon.completed}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-300 truncate">{job.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-zinc-600">{job.id}</span>
                          <span className="text-[10px] text-zinc-700">·</span>
                          <span className="text-[10px] text-zinc-600">{job.duration}</span>
                        </div>
                      </div>
                      {job.status === 'failed' && job.error && (
                        <span className="text-[10px] text-red-400/70 max-w-[200px] truncate">{job.error}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CI/CD Build Pipeline Status */}
        <Card hover={false}>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>CI/CD Builds</CardTitle>
            <div className="flex items-center gap-1">
              <GitBranch className="h-3.5 w-3.5 text-zinc-600" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/40">
              {builds.map((build) => (
                <div key={build.id} className="px-5 py-3 hover:bg-zinc-800/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {build.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-zinc-300">{build.id}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 font-mono">{build.branch}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-zinc-600">{build.author}</span>
                          <span className="text-[10px] text-zinc-700">·</span>
                          <span className="font-mono text-[10px] text-zinc-600">{build.commit}</span>
                          <span className="text-[10px] text-zinc-700">·</span>
                          <span className="text-[10px] text-zinc-600">{build.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={build.status === 'success' ? 'success' : 'danger'}>
                      {build.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Log Stream */}
      <Card hover={false}>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-zinc-500" />
            <CardTitle>Live Log Stream</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="healthy" />
            <span className="text-xs text-emerald-400 font-medium">Streaming</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-zinc-950 rounded-lg border border-zinc-800/60 p-4 max-h-64 overflow-y-auto">
            {logs.map((log, idx) => (
              <LogLine key={idx} log={log} delay={idx * 0.04} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
