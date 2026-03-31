import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function DataTable({ columns, data, onRowClick, rowKey = 'id' }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (col) => {
    if (sortCol === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col.key);
      setSortDir('asc');
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortCol) return 0;
    const av = a[sortCol];
    const bv = b[sortCol];
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800/60 bg-zinc-900/80">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800/60">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col)}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 ${
                  col.sortable !== false ? 'cursor-pointer hover:text-zinc-300 select-none' : ''
                } ${col.className || ''}`}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {sortCol === col.key && (
                    sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => (
            <motion.tr
              key={row[rowKey]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.02, duration: 0.2 }}
              onClick={() => onRowClick?.(row)}
              className={`
                border-b border-zinc-800/30 transition-colors
                ${onRowClick ? 'cursor-pointer hover:bg-zinc-800/40' : ''}
              `}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-zinc-300 ${col.className || ''}`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="py-12 text-center text-sm text-zinc-600">No records found</div>
      )}
    </div>
  );
}
