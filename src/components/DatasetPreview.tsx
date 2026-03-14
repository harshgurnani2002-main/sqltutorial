"use client";

import { useEffect, useState } from 'react';
import { executeQuery } from '@/lib/duckdb';
import { Table2 } from 'lucide-react';

interface DatasetPreviewProps {
  tables: string[];
  maxRows?: number;
}

type TableData = {
  name: string;
  columns: string[];
  rows: Record<string, unknown>[];
};

export default function DatasetPreview({ tables, maxRows = 5 }: DatasetPreviewProps) {
  const [data, setData] = useState<TableData[]>([]);
  const [activeTable, setActiveTable] = useState(tables[0] ?? '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const results: TableData[] = [];
      for (const t of tables) {
        try {
          const rows = await executeQuery(`SELECT * FROM ${t} LIMIT ${maxRows};`);
          const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
          results.push({ name: t, columns, rows });
        } catch {
          results.push({ name: t, columns: [], rows: [] });
        }
      }
      if (!cancelled) {
        setData(results);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [tables, maxRows]);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 my-4">
        <p className="text-xs text-slate-500 animate-pulse">Loading dataset…</p>
      </div>
    );
  }

  const active = data.find((d) => d.name === activeTable);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden my-4">
      {/* Table tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-900/80">
        <div className="px-3 py-2 flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest shrink-0">
          <Table2 size={12} />
          Dataset
        </div>
        {data.map((t) => (
          <button
            key={t.name}
            onClick={() => setActiveTable(t.name)}
            className={`px-3 py-2 text-xs font-mono transition-colors border-b-2 ${
              activeTable === t.name
                ? 'text-brand-primary border-brand-primary bg-brand-primary/5'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Table data */}
      {active && active.rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr>
                {active.columns.map((col) => (
                  <th key={col} className="px-3 py-2 text-[11px] font-semibold text-slate-300 border-b border-slate-800 font-mono bg-slate-800/40">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {active.rows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  {active.columns.map((col) => {
                    const val = row[col];
                    return (
                      <td key={col} className="px-3 py-1.5 text-[12px] text-slate-400 border-b border-slate-800/50 font-mono">
                        {val === null || val === undefined ? (
                          <span className="text-slate-600 italic">null</span>
                        ) : (
                          String(val)
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-3 py-1.5 text-[10px] text-slate-500 bg-slate-800/30 border-t border-slate-800">
        Showing first {maxRows} rows • {active?.columns.length ?? 0} columns
      </div>
    </div>
  );
}
