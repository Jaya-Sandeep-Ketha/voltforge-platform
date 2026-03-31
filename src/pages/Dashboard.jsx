/**
 * Dashboard Page Component
 * 
 * Main dashboard providing an overview of the VoltForge energy management system.
 * This page displays key performance indicators, system health metrics, recent alerts,
 * and operational status across all monitored assets and infrastructure.
 * 
 * Dashboard features:
 * - Fleet-wide KPI cards with trend indicators
 * - Asset health distribution visualization
 * - Real-time ingestion pipeline monitoring
 * - Recent alerts and incident tracking
 * - Quality control failure analysis
 * - System status and operational health
 * - Recent activity timeline and events
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Battery,
  Box,
  CheckCircle2,
  Clock,
  Server,
  Zap,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, KpiCard, LoadingPage } from '@/components/ui';
import { Badge, StatusDot } from '@/components/ui';
import { assetService, alertService, incidentService, qcService } from '@/services/api';
import { healthColor, healthBg, severityBg, formatDateTime, severityColor, statusColor } from '@/utils/formatters';

/**
 * Custom tooltip component for dashboard charts
 * Displays formatted data with proper labels and values
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether tooltip is active
 * @param {Array} props.payload - Chart data payload
 * @param {string} props.label - Chart label for the data point
 * @returns {JSX.Element|null} Tooltip component or null
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-zinc-200 font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

/**
 * Main Dashboard Component
 * 
 * Loads and displays comprehensive system overview data including asset statistics,
 * health metrics, alerts, incidents, and quality control information. Provides
 * real-time monitoring capabilities and navigation to detailed views.
 * 
 * @returns {JSX.Element} Dashboard page component
 */
export function Dashboard() {
  const navigate = useNavigate();
  
  // State management for dashboard data
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [qcRuns, setQcRuns] = useState([]);

  /**
   * Load dashboard data on component mount
   * Fetches all necessary data in parallel for optimal performance
   */
  useEffect(() => {
    async function load() {
      const [a, al, inc, qc] = await Promise.all([
        assetService.getAll(),
        alertService.getRecent(8),
        incidentService.getActive(),
        qcService.getAll(),
      ]);
      setAssets(a);
      setRecentAlerts(al);
      setActiveIncidents(inc);
      setQcRuns(qc);
      setLoading(false);
    }
    load();
  }, []);

  // Loading state handling
  if (loading) return <LoadingPage />;

  // Calculate asset health distribution for visualization
  const healthCounts = assets.reduce((acc, a) => {
    acc[a.health] = (acc[a.health] || 0) + 1;
    return acc;
  }, {});

  // Transform health counts into chart data format
  const healthData = Object.entries(healthCounts).map(([key, val]) => ({ name: key, count: val }));
  
  // Color mapping for health status bars
  const healthBarColors = {
    healthy: '#34d399',
    warning: '#fbbf24',
    critical: '#f87171',
    offline: '#71717a',
    maintenance: '#60a5fa',
  };

  // Calculate quality control pass rate
  const qcPassRate = qcRuns.length
    ? ((qcRuns.filter((r) => r.status === 'passed').length / qcRuns.length) * 100).toFixed(1)
    : 0;

  // Get recent QC failures for display
  const recentQcFailures = qcRuns.filter((r) => r.status === 'failed').slice(0, 5);

  // Simulated ingestion pipeline throughput data
  const ingestData = Array.from({ length: 20 }, (_, i) => ({
    t: `${i}m`,
    throughput: 10000 + Math.sin(i * 0.5) * 3000 + Math.random() * 1000,
  }));

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total Assets"
          value={assets.length}
          change="+12 this month"
          changeType="positive"
          icon={Box}
          delay={0}
        />
        <KpiCard
          label="Active Incidents"
          value={activeIncidents.length}
          change={`${activeIncidents.filter((i) => i.severity === 'critical').length} critical`}
          changeType="negative"
          icon={AlertTriangle}
          delay={0.05}
        />
        <KpiCard
          label="QC Pass Rate"
          value={`${qcPassRate}%`}
          change="vs 94.2% baseline"
          changeType={parseFloat(qcPassRate) >= 94.2 ? 'positive' : 'negative'}
          icon={CheckCircle2}
          delay={0.1}
        />
        <KpiCard
          label="Fleet Uptime"
          value="97.8%"
          change="+0.3% vs last week"
          changeType="positive"
          icon={TrendingUp}
          delay={0.15}
        />
      </div>

      {/* Health Distribution and Ingestion Pipeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Asset Health Distribution Chart */}
        <Card hover={false} className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Assets by Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthData} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} width={85} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                    {healthData.map((entry) => (
                      <Cell key={entry.name} fill={healthBarColors[entry.name] || '#71717a'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Ingestion Pipeline Throughput */}
        <Card hover={false} className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Ingestion Pipeline Throughput</CardTitle>
            <div className="flex items-center gap-2">
              <StatusDot status="healthy" />
              <span className="text-xs text-emerald-400 font-medium">Healthy</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ingestData}>
                  <defs>
                    <linearGradient id="ingestGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="throughput"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#ingestGradient)"
                    name="msg/s"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts and QC Failures Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Alerts List */}
        <Card hover={false}>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Alerts</CardTitle>
            <Badge variant="danger">{recentAlerts.length}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/40 max-h-72 overflow-y-auto">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="px-5 py-3 hover:bg-zinc-800/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className={`h-4 w-4 mt-0.5 flex-shrink-0 ${severityColor(alert.severity)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 truncate">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-zinc-600">{alert.assetId}</span>
                        <span className="text-[10px] text-zinc-600">{formatDateTime(alert.timestamp)}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${severityBg(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent QC Failures */}
        <Card hover={false}>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent QC Failures</CardTitle>
            <Badge variant="warning">{recentQcFailures.length} failed</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/40 max-h-72 overflow-y-auto">
              {recentQcFailures.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-zinc-600">No recent failures</div>
              ) : (
                recentQcFailures.map((run) => (
                  <div key={run.id} className="px-5 py-3 hover:bg-zinc-800/20 transition-colors cursor-pointer" onClick={() => navigate('/qc')}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-mono text-zinc-300">{run.id}</span>
                        <span className="mx-2 text-zinc-700">·</span>
                        <span className="text-xs text-zinc-500">{run.assetId}</span>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-400/10 text-red-400 border border-red-400/20">FAIL</span>
                    </div>
                    <div className="flex gap-2 mt-1.5">
                      {run.results.filter((r) => !r.passed).map((r) => (
                        <span key={r.category} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                          {r.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status and Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* System Status Overview */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Telemetry Ingest', status: 'operational' },
              { name: 'Alert Processor', status: 'operational' },
              { name: 'QC Validation Engine', status: 'degraded' },
              { name: 'Asset Registry', status: 'operational' },
              { name: 'Firmware Sync', status: 'operational' },
              { name: 'API Gateway', status: 'operational' },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">{s.name}</span>
                <div className="flex items-center gap-2">
                  <StatusDot status={s.status} />
                  <span className={`text-xs font-medium capitalize ${statusColor(s.status)}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity Timeline */}
        <Card hover={false} className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/40 max-h-64 overflow-y-auto">
              {[
                { icon: Zap, text: 'Firmware v5.0.0-rc2 deployed to site-004 (18 assets)', time: '12 min ago', color: 'text-cyan-400' },
                { icon: AlertTriangle, text: 'Thermal runaway warning on VF-00023 auto-escalated', time: '28 min ago', color: 'text-amber-400' },
                { icon: CheckCircle2, text: 'QC run QC-1024 completed — 4/5 checks passed', time: '45 min ago', color: 'text-emerald-400' },
                { icon: Server, text: 'Nightly telemetry aggregation completed (4m 23s)', time: '2 hours ago', color: 'text-zinc-400' },
                { icon: Battery, text: 'Asset VF-00089 health score dropped below threshold', time: '3 hours ago', color: 'text-red-400' },
                { icon: Clock, text: 'Scheduled maintenance window opens for site-006', time: '5 hours ago', color: 'text-blue-400' },
              ].map((item, idx) => (
                <div key={idx} className="px-5 py-3 flex items-start gap-3">
                  <item.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${item.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300">{item.text}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
