export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export function StatusDot({ status, className = '' }) {
  const colors = {
    healthy: 'bg-emerald-400',
    operational: 'bg-emerald-400',
    active: 'bg-red-400',
    warning: 'bg-amber-400',
    degraded: 'bg-amber-400',
    critical: 'bg-red-400',
    offline: 'bg-zinc-500',
    maintenance: 'bg-blue-400',
    'in-service': 'bg-emerald-400',
    'pending-repair': 'bg-amber-400',
    'under-maintenance': 'bg-blue-400',
    running: 'bg-blue-400',
    success: 'bg-emerald-400',
    failed: 'bg-red-400',
    completed: 'bg-emerald-400',
  };

  return (
    <span className={`relative flex h-2 w-2 ${className}`}>
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${colors[status] || 'bg-zinc-500'}`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[status] || 'bg-zinc-500'}`} />
    </span>
  );
}
