import { motion } from 'framer-motion';

export function KpiCard({ label, value, change, changeType = 'neutral', icon: Icon, unit = '', delay = 0 }) {
  const changeColors = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-zinc-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative rounded-xl border border-zinc-800/60 bg-zinc-900/80 p-5 group hover:border-zinc-700/60 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-zinc-100 tabular-nums">{value}</span>
            {unit && <span className="text-sm text-zinc-500">{unit}</span>}
          </div>
          {change !== undefined && (
            <p className={`text-xs font-medium ${changeColors[changeType]}`}>
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→'} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-zinc-800/50 text-zinc-500 group-hover:text-red-400/70 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
