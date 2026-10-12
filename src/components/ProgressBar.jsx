import { motion } from 'framer-motion';

export default function ProgressBar({ value, max, label }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
      <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--accent)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>{value} of {max} topics done ({pct}%)</p>
    </div>
  );
}
