export function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatNumber(value, decimals = 0) {
  if (value == null) return '—';
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value, decimals = 1) {
  if (value == null) return '—';
  return `${Number(value).toFixed(decimals)}%`;
}

export function truncate(str, len = 40) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const healthColor = (health) => {
  const map = {
    healthy: 'text-emerald-400',
    warning: 'text-amber-400',
    critical: 'text-red-400',
    offline: 'text-zinc-500',
    maintenance: 'text-blue-400',
  };
  return map[health] || 'text-zinc-400';
};

export const healthBg = (health) => {
  const map = {
    healthy: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    warning: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    critical: 'bg-red-400/10 text-red-400 border-red-400/20',
    offline: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    maintenance: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  };
  return map[health] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
};

export const severityColor = (severity) => {
  const map = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-amber-400',
    low: 'text-zinc-400',
    warning: 'text-amber-400',
    info: 'text-blue-400',
  };
  return map[severity] || 'text-zinc-400';
};

export const severityBg = (severity) => {
  const map = {
    critical: 'bg-red-400/10 text-red-400 border-red-400/20',
    high: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    medium: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    low: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    Critical: 'bg-red-400/10 text-red-400 border-red-400/20',
    High: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    Medium: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    Low: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    warning: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    info: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  };
  return map[severity] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
};

export const statusColor = (status) => {
  const map = {
    passed: 'text-emerald-400',
    failed: 'text-red-400',
    running: 'text-blue-400',
    completed: 'text-emerald-400',
    success: 'text-emerald-400',
    active: 'text-red-400',
    acknowledged: 'text-amber-400',
    investigating: 'text-blue-400',
    resolved: 'text-emerald-400',
    closed: 'text-zinc-500',
    operational: 'text-emerald-400',
    degraded: 'text-amber-400',
    'in-service': 'text-emerald-400',
    'pending-repair': 'text-amber-400',
    'under-maintenance': 'text-blue-400',
    decommissioned: 'text-zinc-500',
    'newly-deployed': 'text-cyan-400',
  };
  return map[status] || 'text-zinc-400';
};
