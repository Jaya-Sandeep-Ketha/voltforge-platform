/**
 * Telemetry Monitoring Page
 * 
 * Advanced telemetry data visualization and analysis interface for the VoltForge platform.
 * This page provides real-time monitoring of energy asset performance metrics with
 * anomaly detection, time-range filtering, and comprehensive data analysis capabilities.
 * 
 * Telemetry features:
 * - Real-time monitoring of temperature, voltage, current, and power metrics
 * - Anomaly detection and highlighting for unusual patterns
 * - Time-range filtering (6h, 12h, 24h, 48h) for trend analysis
 * - Asset and site-based filtering for targeted monitoring
 * - Statistical analysis with min/max/average calculations
 * - Interactive charts with detailed tooltips and reference lines
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Zap,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  Filter,
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
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, KpiCard, LoadingPage, Badge } from '@/components/ui';
import { assetService, telemetryService } from '@/services/api';
import { sites } from '@/data/sites';

/**
 * Custom tooltip component for telemetry charts
 * Displays timestamp, value, unit, and anomaly indicators
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether tooltip is active
 * @param {Array} props.payload - Chart data payload
 * @param {string} props.label - Chart label
 * @returns {JSX.Element|null} Tooltip component or null
 */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1">{new Date(d.timestamp).toLocaleTimeString()}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.value}{d.unit ? ` ${d.unit}` : ''}
          {d.isAnomaly && <span className="text-red-400 ml-1">(anomaly)</span>}
        </p>
      ))}
    </div>
  );
};

/**
 * Telemetry chart component for displaying individual metric series
 * Provides comprehensive visualization with statistics and anomaly detection
 * @param {Object} props - Component props
 * @param {Object} props.series - Telemetry series data with points array
 * @param {string} props.color - Chart color for the metric
 * @param {string} props.title - Chart title and metric name
 * @param {React.Component} props.icon - Icon component for the metric
 * @param {number} props.delay - Animation delay for staggered entry
 * @returns {JSX.Element|null} Telemetry chart component
 */
function TelemetryChart({ series, color, title, icon: Icon, delay = 0 }) {
  if (!series) return null;

  // Transform series data for chart visualization
  const chartData = series.points.map((p, i) => ({
    idx: i,
    value: p.value,
    timestamp: p.timestamp,
    isAnomaly: p.isAnomaly,
    unit: series.unit,
  }));

  // Calculate statistics for the metric
  const anomalyCount = series.points.filter((p) => p.isAnomaly).length;
  const avg = (series.points.reduce((s, p) => s + p.value, 0) / series.points.length).toFixed(1);
  const max = Math.max(...series.points.map((p) => p.value)).toFixed(1);
  const min = Math.min(...series.points.map((p) => p.value)).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card hover={false}>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" style={{ color }} />}
            <CardTitle>{title} ({series.unit})</CardTitle>
          </div>
          {anomalyCount > 0 && (
            <Badge variant="danger">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {anomalyCount} anomalies
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {/* Statistics Summary Row */}
          <div className="flex gap-6 mb-3">
            <div>
              <p className="text-[10px] text-zinc-600 uppercase">Avg</p>
              <p className="text-sm font-mono text-zinc-300">{avg}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-600 uppercase">Min</p>
              <p className="text-sm font-mono text-zinc-300">{min}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-600 uppercase">Max</p>
              <p className="text-sm font-mono text-zinc-300">{max}</p>
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="idx" hide />
                <YAxis tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={1.5}
                  fill={`url(#grad-${title})`}
                  dot={(props) => {
                    // Highlight anomaly points with special markers
                    if (props.payload.isAnomaly) {
                      return (
                        <circle
                          key={props.index}
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill="#ef4444"
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeOpacity={0.3}
                        />
                      );
                    }
                    return null;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * Telemetry Monitoring Component
 * 
 * Main telemetry page component providing comprehensive monitoring and analysis
 * of energy asset performance metrics with filtering, anomaly detection, and
 * statistical analysis capabilities.
 * 
 * @returns {JSX.Element} Telemetry monitoring page component
 */
export function Telemetry() {
  // State management for telemetry data and filters
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('VF-00001');
  const [selectedSite, setSelectedSite] = useState('');
  const [timeRange, setTimeRange] = useState(24);
  const [telemetry, setTelemetry] = useState(null);

  /**
   * Load all assets on component mount for asset selection
   */
  useEffect(() => {
    assetService.getAll().then((a) => {
      setAssets(a);
    });
  }, []);

  /**
   * Load telemetry data when asset or time range changes
   * Shows loading state during data fetch
   */
  useEffect(() => {
    setLoading(true);
    telemetryService.getForAsset(selectedAsset, timeRange).then((t) => {
      setTelemetry(t);
      setLoading(false);
    });
  }, [selectedAsset, timeRange]);

  /**
   * Memoized filtered assets based on site selection
   * Limits display to 30 assets for performance
   */
  const filteredAssets = useMemo(() => {
    if (!selectedSite) return assets.slice(0, 30);
    return assets.filter((a) => a.siteId === selectedSite).slice(0, 30);
  }, [assets, selectedSite]);

  /**
   * Calculate total anomalies across all telemetry metrics
   */
  const totalAnomalies = telemetry
    ? Object.values(telemetry).reduce((sum, s) => sum + s.points.filter((p) => p.isAnomaly).length, 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3"
      >
        <Filter className="h-4 w-4 text-zinc-500" />

        {/* Site Filter Dropdown */}
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          className="px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50"
        >
          <option value="">All Sites</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Asset Selection Dropdown */}
        <select
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
          className="px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50"
        >
          {filteredAssets.map((a) => (
            <option key={a.id} value={a.id}>{a.id} — {a.type}</option>
          ))}
        </select>

        {/* Time Range Selection Buttons */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          {[6, 12, 24, 48].map((h) => (
            <button
              key={h}
              onClick={() => setTimeRange(h)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeRange === h
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {h}h
            </button>
          ))}
        </div>

        {/* Time Range Indicator */}
        <div className="ml-auto flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-zinc-600" />
          <span className="text-xs text-zinc-600">Last {timeRange} hours</span>
        </div>
      </motion.div>

      {/* KPI Summary Cards */}
      {!loading && telemetry && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            label="Avg Temperature"
            value={(telemetry.temperature.points.reduce((s, p) => s + p.value, 0) / telemetry.temperature.points.length).toFixed(1)}
            unit="°C"
            icon={Thermometer}
            delay={0}
          />
          <KpiCard
            label="Avg Voltage"
            value={(telemetry.voltage.points.reduce((s, p) => s + p.value, 0) / telemetry.voltage.points.length).toFixed(1)}
            unit="V"
            icon={Zap}
            delay={0.05}
          />
          <KpiCard
            label="Avg Power Output"
            value={(telemetry.powerOutput.points.reduce((s, p) => s + p.value, 0) / telemetry.powerOutput.points.length).toFixed(0)}
            unit="kW"
            icon={TrendingUp}
            delay={0.1}
          />
          <KpiCard
            label="Anomalies Detected"
            value={totalAnomalies}
            change={totalAnomalies > 5 ? 'Above threshold' : 'Within limits'}
            changeType={totalAnomalies > 5 ? 'negative' : 'positive'}
            icon={AlertTriangle}
            delay={0.15}
          />
        </div>
      )}

      {/* Telemetry Charts Grid */}
      {loading ? (
        <LoadingPage />
      ) : telemetry ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TelemetryChart series={telemetry.temperature} color="#f87171" title="Temperature" icon={Thermometer} delay={0} />
          <TelemetryChart series={telemetry.voltage} color="#60a5fa" title="Voltage" icon={Zap} delay={0.05} />
          <TelemetryChart series={telemetry.current} color="#34d399" title="Current" icon={Activity} delay={0.1} />
          <TelemetryChart series={telemetry.powerOutput} color="#fbbf24" title="Power Output" icon={TrendingUp} delay={0.15} />
          <TelemetryChart series={telemetry.soc} color="#a78bfa" title="State of Charge" icon={Activity} delay={0.2} />
          <TelemetryChart series={telemetry.faultCount} color="#ef4444" title="Fault Events" icon={AlertTriangle} delay={0.25} />
        </div>
      ) : null}
    </div>
  );
}
