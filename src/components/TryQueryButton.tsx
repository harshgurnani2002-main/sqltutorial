"use client";

import { Play } from 'lucide-react';

interface TryQueryButtonProps {
  sql: string;
  title?: string;
  description?: string;
  onTryQuery: (sql: string) => void;
}

export default function TryQueryButton({ sql, title, description, onTryQuery }: TryQueryButtonProps) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-lg p-4 my-3 group hover:border-brand-primary/40 transition-colors">
      {title && (
        <p className="text-xs font-semibold text-white mb-1">{title}</p>
      )}
      {description && (
        <p className="text-[11px] text-slate-400 mb-2">{description}</p>
      )}
      <div className="flex items-center gap-3">
        <pre className="flex-1 bg-slate-950 rounded px-3 py-2 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {sql}
        </pre>
        <button
          onClick={() => onTryQuery(sql)}
          className="shrink-0 flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-brand-bg px-3 py-2 rounded-md text-xs font-bold transition-all"
        >
          <Play size={12} />
          Try This Query
        </button>
      </div>
    </div>
  );
}
