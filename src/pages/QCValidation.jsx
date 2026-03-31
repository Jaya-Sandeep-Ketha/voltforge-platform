import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  BarChart3,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Badge, LoadingPage, StatusDot } from '@/components/ui';
import { qcService } from '@/services/api';
import { formatDateTime } from '@/utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}%</p>
      ))}
    </div>
  );
};

function LogViewer({ logs }) {
  const levelColors = {
    INFO: 'text-zinc-500',
    PASS: 'text-emerald-400',
    WARN: 'text-amber-400',
    FAIL: 'text-red-400',
    ERROR: 'text-red-400',
  };

  return (
    <div className="font-mono text-[11px] bg-zinc-950 rounded-lg border border-zinc-800/60 p-3 max-h-60 overflow-y-auto space-y-0.5">
      {logs.map((log, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.03 }}
          className="flex gap-3"
        >
          <span className="text-zinc-700 w-20 flex-shrink-0">{log.ts}</span>
          <span className={`w-10 flex-shrink-0 font-semibold ${levelColors[log.level] || 'text-zinc-500'}`}>
            {log.level}
          </span>
          <span className="text-zinc-400">{log.message}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ValidationCard({ result, delay = 0 }) {
  const passed = result.passed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`rounded-xl border p-4 transition-all ${
        passed
          ? 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30'
          : 'border-red-500/20 bg-red-500/5 hover:border-red-500/30'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {passed ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <XCircle className="h-5 w-5 text-red-400" />
          )}
          <h4 className="text-sm font-semibold text-zinc-200">{result.label}</h4>
        </div>
        <Badge variant={passed ? 'success' : 'danger'}>
          {passed ? 'PASS' : 'FAIL'}
        </Badge>
      </div>

      <p className="text-xs text-zinc-500 mb-3">{result.description}</p>

      {/* Score vs Baseline */}
      <div className="flex items-center gap-4 mb-2">
        <div>
          <p className="text-[10px] text-zinc-600 uppercase">Score</p>
          <p className={`text-lg font-bold tabular-nums ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
            {result.score}%
          </p>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ delay: delay + 0.2, duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${passed ? 'bg-emerald-500' : 'bg-red-500'}`}
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-600 uppercase">Baseline</p>
          <p className="text-sm font-mono text-zinc-400">{result.baseline}%</p>
        </div>
      </div>

      <p className="text-[11px] text-zinc-500 mt-2">{result.details}</p>
    </motion.div>
  );
}

export function QCValidation() {
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await qcService.getAll();
      setRuns(data);
      setSelectedRun(data[0] || null);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingPage />;

  const passCount = runs.filter((r) => r.status === 'passed').length;
  const failCount = runs.filter((r) => r.status === 'failed').length;

  // Comparison chart data
  const comparisonData = selectedRun
    ? selectedRun.results.map((r) => ({
        name: r.label.split(' ').slice(0, 2).join(' '),
        current: r.score,
        baseline: r.baseline,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        <Card hover={false}>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-zinc-800/50">
              <BarChart3 className="h-6 w-6 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Runs</p>
              <p className="text-2xl font-bold text-zinc-100">{runs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card hover={false}>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Passed</p>
              <p className="text-2xl font-bold text-emerald-400">{passCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card hover={false}>
          <CardContent className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-500/10">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Failed</p>
              <p className="text-2xl font-bold text-red-400">{failCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Run List */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-1">Validation Runs</h3>
          <div className="space-y-1 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
            {runs.map((run) => (
              <button
                key={run.id}
                onClick={() => { setSelectedRun(run); setShowLogs(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  selectedRun?.id === run.id
                    ? 'bg-zinc-800/60 border-zinc-700'
                    : 'bg-zinc-900/40 border-zinc-800/40 hover:bg-zinc-800/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-zinc-300">{run.id}</span>
                  <StatusDot status={run.status === 'passed' ? 'healthy' : 'critical'} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-zinc-600">{run.assetId}</span>
                  <span className="text-[10px] text-zinc-700">·</span>
                  <span className="text-[10px] text-zinc-600">{formatDateTime(run.runDate)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        {selectedRun && (
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-100 font-mono">{selectedRun.id}</h3>
                <p className="text-xs text-zinc-500">{selectedRun.assetId} · {formatDateTime(selectedRun.runDate)}</p>
              </div>
              <Badge variant={selectedRun.status === 'passed' ? 'success' : 'danger'}>
                {selectedRun.status.toUpperCase()}
              </Badge>
            </div>

            {/* Validation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedRun.results.map((result, idx) => (
                <ValidationCard key={result.category} result={result} delay={idx * 0.05} />
              ))}
            </div>

            {/* Score Comparison Chart */}
            <Card hover={false}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Current vs Baseline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} barGap={4}>
                      <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11, color: '#a1a1aa' }} />
                      <Bar dataKey="current" name="Current" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey="baseline" name="Baseline" fill="#3f3f46" radius={[4, 4, 0, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Corrective Actions */}
            {selectedRun.correctiveActions.length > 0 && (
              <Card hover={false}>
                <CardHeader>
                  <CardTitle>Recommended Corrective Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedRun.correctiveActions.map((ca, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                      <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-zinc-300">{ca.category}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{ca.action}</p>
                        <Badge variant="warning" className="mt-2">{ca.priority} priority</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Validation Logs */}
            <Card hover={false}>
              <CardHeader>
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="flex items-center gap-2 w-full"
                >
                  <CardTitle>Validation Logs</CardTitle>
                  <motion.div animate={{ rotate: showLogs ? 90 : 0 }}>
                    <ChevronRight className="h-4 w-4 text-zinc-600" />
                  </motion.div>
                </button>
              </CardHeader>
              <AnimatePresence>
                {showLogs && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <CardContent>
                      <LogViewer logs={selectedRun.logs} />
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
