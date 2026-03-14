"use client";

import { useState, useMemo } from 'react';
import { QueryResult } from '@/store';
import { DatabaseZap, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface ResultTableProps {
  data: QueryResult | null;
  error: string | null;
}

export default function ResultTable({ data, error }: ResultTableProps) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const columns = useMemo(() => (data && data.length > 0 ? Object.keys(data[0]) : []), [data]);

  const sorted = useMemo(() => {
    if (!data || !sortCol) return data;
    return [...data].sort((a, b) => {
      const va = a[sortCol];
      const vb = b[sortCol];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number')
        return sortDir === 'asc' ? va - vb : vb - va;
      return sortDir === 'asc'
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [data, sortCol, sortDir]);

  const toggleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  if (error) {
    return (
      <div className="h-full w-full flex items-start p-5 bg-red-950/20 text-red-400 border border-red-900/50 rounded-lg overflow-auto">
        <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">{error}</pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 border border-slate-800 rounded-lg border-dashed">
        <DatabaseZap size={28} className="mb-2 opacity-20" />
        <p className="text-xs">Run a query to see results</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-400 border border-slate-800 rounded-lg bg-slate-900/50">
        <p className="text-sm">Query returned 0 rows.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto bg-slate-900 rounded-lg border border-slate-700 flex flex-col">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="sticky top-0 bg-slate-800 z-10">
            <tr>
              <th className="px-3 py-2 border-b border-slate-700 w-10 text-center text-slate-500 font-mono text-[11px]">#</th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-[11px] font-semibold text-slate-300 border-b border-slate-700 font-mono cursor-pointer hover:text-white select-none"
                  onClick={() => toggleSort(col)}
                >
                  <span className="flex items-center gap-1">
                    {col}
                    {sortCol === col ? (
                      sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
                    ) : (
                      <ArrowUpDown size={11} className="opacity-30" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(sorted ?? []).map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-3 py-1.5 border-b border-slate-800/60 text-slate-500 font-mono text-[11px] text-center">
                  {i + 1}
                </td>
                {columns.map((col) => {
                  const val = row[col];
                  let display: React.ReactNode;
                  if (val === null || val === undefined) display = <span className="text-slate-600 italic">null</span>;
                  else if (typeof val === 'object') display = JSON.stringify(val);
                  else display = String(val);
                  return (
                    <td key={col} className="px-3 py-1.5 text-[13px] text-slate-300 border-b border-slate-800/60">
                      {display}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-800 border-t border-slate-700 px-3 py-1 text-[11px] text-slate-400 flex justify-between shrink-0">
        <span>{columns.length} col{columns.length !== 1 ? 's' : ''}</span>
        <span>{data.length} row{data.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
