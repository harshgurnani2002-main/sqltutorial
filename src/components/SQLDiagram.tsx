"use client";

/**
 * Pure SVG / CSS concept diagrams for SQL lessons.
 * Includes animated JoinVisualization for the JOIN lesson.
 */

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const JoinVisualization = dynamic(() => import('./JoinVisualization'), { ssr: false });

export type DiagramType = 'filter-pipeline' | 'join-venn' | 'join-animated' | 'groupby-buckets' | 'window-partition' | 'index-lookup';

export default function SQLDiagram({ type }: { type?: DiagramType }) {
  if (!type) return null;

  // join-animated gets the full interactive component
  if (type === 'join-animated') return <JoinVisualization />;

  return (
    <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-6 overflow-hidden">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-semibold">Concept Diagram</p>
      {type === 'filter-pipeline' && <FilterPipeline />}
      {type === 'join-venn' && <JoinVenn />}
      {type === 'groupby-buckets' && <GroupByBuckets />}
      {type === 'window-partition' && <WindowPartition />}
      {type === 'index-lookup' && <IndexLookup />}
    </div>
  );
}

/* ── Filter Pipeline ──────────────────────────────────────── */
function FilterPipeline() {
  const steps = [
    { label: 'All Rows', color: '#334155', count: 10 },
    { label: 'WHERE filter', color: '#22c55e', count: 4 },
    { label: 'SELECT cols', color: '#38bdf8', count: 4 },
    { label: 'Result', color: '#22c55e', count: 4 },
  ];
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="flex flex-col items-center gap-1">
            <div
              className="rounded-lg px-4 py-3 text-xs font-bold text-white border"
              style={{ borderColor: s.color, background: s.color + '20' }}
            >
              {s.label}
            </div>
            <span className="text-[10px] font-mono text-slate-500">{s.count} rows</span>
          </div>
          {i < steps.length - 1 && (
            <svg width="24" height="16" className="shrink-0 text-slate-600">
              <path d="M2 8 L18 8 M14 3 L20 8 L14 13" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ── JOIN Venn Diagram ────────────────────────────────────── */
function JoinVenn() {
  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 300 160" className="w-full max-w-sm">
        <motion.circle cx="110" cy="80" r="60" fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeWidth="2"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} />
        <motion.circle cx="190" cy="80" r="60" fill="#38bdf8" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="2"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.15 }} />
        <motion.text x="75" y="84" fill="#22c55e" fontSize="12" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>Table A</motion.text>
        <motion.text x="200" y="84" fill="#38bdf8" fontSize="12" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>Table B</motion.text>
        <motion.text x="133" y="84" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>INNER</motion.text>
      </svg>
      <div className="flex gap-6 text-[11px] text-slate-400">
        <span><span className="inline-block w-2 h-2 rounded-full bg-brand-primary mr-1" />LEFT = A + overlap</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-brand-secondary mr-1" />RIGHT = B + overlap</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-white mr-1" />INNER = overlap only</span>
      </div>
    </div>
  );
}

/* ── GROUP BY Buckets ─────────────────────────────────────── */
function GroupByBuckets() {
  const groups = [
    { name: 'Engineering', items: ['Alice', 'Bob', 'Fiona', 'Hannah'], color: '#22c55e' },
    { name: 'Sales', items: ['Charlie', 'Evan', 'Ian'], color: '#38bdf8' },
    { name: 'Marketing', items: ['Diana', 'George'], color: '#f59e0b' },
    { name: 'HR', items: ['Julia'], color: '#a78bfa' },
  ];
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {groups.map((g, gi) => (
        <motion.div
          key={g.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.1 }}
          className="shrink-0 rounded-lg border p-3 min-w-[120px]"
          style={{ borderColor: g.color, background: g.color + '10' }}
        >
          <p className="text-[11px] font-bold mb-2" style={{ color: g.color }}>{g.name}</p>
          {g.items.map((item) => (
            <div key={item} className="text-[11px] text-slate-400 leading-relaxed">{item}</div>
          ))}
          <div className="mt-2 pt-2 border-t text-[10px] font-mono" style={{ borderColor: g.color + '40', color: g.color }}>
            COUNT = {g.items.length}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Window Partition ─────────────────────────────────────── */
function WindowPartition() {
  const partitions = [
    { dept: 'Engineering', rows: [{ name: 'Fiona', rank: 1 }, { name: 'Alice', rank: 2 }, { name: 'Bob', rank: 3 }] },
    { dept: 'Sales', rows: [{ name: 'Charlie', rank: 1 }, { name: 'Evan', rank: 2 }] },
  ];
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {partitions.map((p, pi) => (
        <motion.div
          key={p.dept}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: pi * 0.12 }}
          className="shrink-0 rounded-lg border border-brand-secondary/30 bg-brand-secondary/5 min-w-[160px]"
        >
          <div className="px-3 py-2 border-b border-brand-secondary/20 text-[11px] font-bold text-brand-secondary">
            PARTITION: {p.dept}
          </div>
          <div className="p-3 space-y-1">
            {p.rows.map((r) => (
              <div key={r.name} className="flex justify-between text-[11px]">
                <span className="text-slate-300">{r.name}</span>
                <span className="font-mono text-brand-primary">#{r.rank}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Index Lookup ─────────────────────────────────────────── */
function IndexLookup() {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-2">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="shrink-0 text-center">
        <p className="text-[10px] text-slate-500 mb-2 font-semibold">WITHOUT INDEX</p>
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1, backgroundColor: ['#334155', '#ef4444', '#334155'] }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="w-24 h-4 rounded-sm bg-slate-700"
            />
          ))}
        </div>
        <p className="text-[10px] mt-2 font-mono text-red-400">O(n) scan</p>
      </motion.div>

      <svg width="32" height="16" className="shrink-0 text-slate-600">
        <text x="8" y="12" fill="currentColor" fontSize="14" fontWeight="bold">vs</text>
      </svg>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="shrink-0 text-center">
        <p className="text-[10px] text-slate-500 mb-2 font-semibold">WITH INDEX</p>
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`w-24 h-4 rounded-sm ${i === 2 ? 'bg-brand-primary' : 'bg-slate-800'}`} />
          ))}
        </div>
        <p className="text-[10px] mt-2 font-mono text-brand-primary">O(log n) lookup</p>
      </motion.div>
    </div>
  );
}
