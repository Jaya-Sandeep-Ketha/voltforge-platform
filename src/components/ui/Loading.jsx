import { motion } from 'framer-motion';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-2 border-zinc-700 border-t-red-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function LoadingCard({ className = '' }) {
  return (
    <div className={`rounded-xl border border-zinc-800/60 bg-zinc-900/80 p-5 ${className}`}>
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-zinc-800 rounded w-1/3" />
        <div className="h-8 bg-zinc-800 rounded w-2/3" />
        <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-zinc-500 font-medium tracking-wide">Loading data…</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="h-12 w-12 text-zinc-600 mb-4" />}
      <h3 className="text-lg font-semibold text-zinc-300 mb-1">{title}</h3>
      {description && <p className="text-sm text-zinc-500 max-w-md mb-4">{description}</p>}
      {action}
    </div>
  );
}
