/**
 * Asset Detail Page Component
 * 
 * Comprehensive asset monitoring and management interface for individual energy assets.
 * This page displays detailed information about a specific asset including real-time
 * telemetry, component health, incident history, and maintenance recommendations.
 * 
 * Features provided:
 * - Asset overview with key performance indicators
 * - Real-time telemetry charts for temperature, voltage, and current
 * - Component-level health monitoring
 * - Active incident tracking and management
 * - Service history and maintenance records
 * - Recommended actions based on asset health status
 * - Integration with 3D viewer for detailed inspection
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Battery,
  Thermometer,
  Zap,
  Clock,
  Cpu,
  AlertTriangle,
  Rotate3d,
  Activity,
  Wrench,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, KpiCard, LoadingPage, Badge, StatusDot } from '@/components/ui';
import { assetService, siteService, telemetryService, incidentService, qcService } from '@/services/api';
import { healthBg, severityBg, formatDate, formatDateTime, statusColor } from '@/utils/formatters';

/**
 * Custom tooltip component for telemetry charts
 * Displays formatted values with units when hovering over chart points
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether tooltip is active
 * @param {Array} props.payload - Chart data payload
 * @returns {JSX.Element|null} Tooltip component or null
 */
const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-200 font-medium">{payload[0].value} {payload[0].payload?.unit || ''}</p>
    </div>
  );
};

/**
 * Mini chart component for displaying telemetry data in compact format
 * Shows the last 60 data points in a 24-hour view with responsive sizing
 * @param {Object} props - Component props
 * @param {Object} props.data - Telemetry data object with points array
 * @param {string} props.color - Chart line color (default: red)
 * @param {string} props.unit - Unit label for tooltip display
 * @returns {JSX.Element} Mini chart component
 */
function MiniChart({ data, color = '#ef4444', unit = '' }) {
  // Process data points for chart display
  const chartData = data.points.slice(-60).map((p, i) => ({ i, value: p.value, unit }));
  return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
          <Tooltip content={<ChartTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Main Asset Detail Component
 * 
 * Loads and displays comprehensive information about a specific energy asset.
 * Fetches asset details, site information, telemetry data, incidents, and QC runs.
 * Provides a complete monitoring interface for asset management.
 * 
 * @returns {JSX.Element} Asset detail page component
 */
export function AssetDetail() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  
  // State management for asset data
  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState(null);
  const [site, setSite] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [qcRuns, setQcRuns] = useState([]);

  /**
   * Load all asset data on component mount
   * Fetches asset details, site info, telemetry, incidents, and QC runs in parallel
   */
  useEffect(() => {
    async function load() {
      const a = await assetService.getById(assetId);
      if (!a) { setLoading(false); return; }
      
      // Parallel data fetching for better performance
      const [s, t, inc, qc] = await Promise.all([
        siteService.getById(a.siteId),
        telemetryService.getForAsset(assetId),
        incidentService.getByAsset(assetId),
        qcService.getByAsset(assetId),
      ]);
      
      setAsset(a);
      setSite(s);
      setTelemetry(t);
      setIncidents(inc);
      setQcRuns(qc);
      setLoading(false);
    }
    load();
  }, [assetId]);

  // Loading state handling
  if (loading) return <LoadingPage />;
  
  // Asset not found state
  if (!asset) return (
    <div className="text-center py-20">
      <p className="text-zinc-500">Asset not found</p>
      <button onClick={() => navigate('/assets')} className="mt-4 text-sm text-red-400 hover:underline">Back to inventory</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/assets')} className="p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-zinc-100 font-mono">{asset.id}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${healthBg(asset.health)}`}>
              {asset.health}
            </span>
          </div>
          <p className="text-sm text-zinc-500">{asset.type} · {site?.name || asset.siteId} · S/N: {asset.serialNumber}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => navigate(`/viewer/${asset.id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 transition-colors text-sm font-medium"
          >
            <Rotate3d className="h-4 w-4" />
            Open 3D Viewer
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard label="Temperature" value={asset.temperature} unit="°C" icon={Thermometer} delay={0} />
        <KpiCard label="Voltage" value={asset.voltage} unit="V" icon={Zap} delay={0.05} />
        <KpiCard label="Uptime" value={`${asset.uptime}%`} icon={Clock} delay={0.1} />
        <KpiCard label="Cycle Count" value={asset.cycleCount.toLocaleString()} icon={Activity} delay={0.15} />
        <KpiCard label="Firmware" value={asset.firmware} icon={Cpu} delay={0.2} />
      </div>

      {/* Telemetry Charts Section */}
      {telemetry && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'temperature', label: 'Temperature', color: '#f87171' },
            { key: 'voltage', label: 'Voltage', color: '#60a5fa' },
            { key: 'current', label: 'Current', color: '#34d399' },
          ].map((m) => (
            <Card key={m.key} hover={false}>
              <CardHeader>
                <CardTitle>{m.label} ({telemetry[m.key].unit})</CardTitle>
              </CardHeader>
              <CardContent>
                <MiniChart data={telemetry[m.key]} color={m.color} unit={telemetry[m.key].unit} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Component Health and Active Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Component Summary */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Component Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800/40">
              {asset.components.map((comp, idx) => (
                <div key={idx} className="px-5 py-3 flex items-center justify-between hover:bg-zinc-800/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <Cpu className="h-4 w-4 text-zinc-600" />
                    <span className="text-sm text-zinc-300">{comp.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 font-mono">{comp.temp}°C</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${healthBg(comp.health)}`}>
                      {comp.health}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Incidents */}
        <Card hover={false}>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Active Incidents</CardTitle>
            {incidents.length > 0 && <Badge variant="danger">{incidents.length}</Badge>}
          </CardHeader>
          <CardContent className="p-0">
            {incidents.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-zinc-600">No active incidents</div>
            ) : (
              <div className="divide-y divide-zinc-800/40 max-h-64 overflow-y-auto">
                {incidents.slice(0, 8).map((inc) => (
                  <div key={inc.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">{inc.type}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${severityBg(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] text-zinc-600">{inc.id}</span>
                      <span className={`text-[10px] capitalize ${statusColor(inc.status)}`}>{inc.status}</span>
                      <span className="text-[10px] text-zinc-600">{formatDateTime(inc.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service History and Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Service History Timeline */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Service History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-zinc-800" />
              {[
                { date: asset.lastServiceDate, event: 'Preventive maintenance — thermal system flush', tech: 'J. Martinez' },
                { date: asset.installDate, event: 'Initial deployment and commissioning', tech: 'A. Kumar' },
              ].map((entry, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-700 border-2 border-zinc-900" />
                  <p className="text-sm text-zinc-300">{entry.event}</p>
                  <p className="text-[10px] text-zinc-600">{formatDate(entry.date)} · {entry.tech}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Actions Based on Health Status */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {asset.health === 'critical' || asset.health === 'warning' ? (
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-zinc-300">Schedule immediate diagnostic inspection</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">Asset health below acceptable threshold. Run full QC validation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <Wrench className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-zinc-300">Review thermal management system</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">Temperature readings trending above baseline. Consider coolant flush.</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <Battery className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-zinc-300">No immediate actions required</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">Asset operating within normal parameters. Next scheduled maintenance: 30 days.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
