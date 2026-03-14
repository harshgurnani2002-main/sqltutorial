"use client";

import { useState } from 'react';
import { CheckCircle2, XCircle, Lightbulb, Eye, EyeOff, Play, Table2 } from 'lucide-react';

interface ExercisePanelProps {
  exercise: {
    id: string;
    title: string;
    description: string;
    hint: string;
    solution: string;
    tables?: string[];
  };
  index: number;
  status: 'pass' | 'fail' | null;
  alreadyComplete: boolean;
  onLoadQuery: (sql: string) => void;
}

export default function ExercisePanel({
  exercise,
  index,
  status,
  alreadyComplete,
  onLoadQuery,
}: ExercisePanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const effectiveStatus = alreadyComplete ? 'pass' : status;

  return (
    <div
      className={`rounded-lg border transition-all ${
        effectiveStatus === 'pass'
          ? 'bg-green-950/20 border-green-800/40'
          : effectiveStatus === 'fail'
            ? 'bg-red-950/15 border-red-900/30'
            : 'bg-slate-800/40 border-slate-700/60'
      }`}
    >
      {/* Header — always visible, clickable to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 p-3 text-left"
      >
        <div className="shrink-0">
          {effectiveStatus === 'pass' ? (
            <CheckCircle2 size={16} className="text-brand-primary" />
          ) : effectiveStatus === 'fail' ? (
            <XCircle size={16} className="text-red-400" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-slate-200 font-medium leading-snug">
            <span className="text-slate-500 mr-1.5">{index + 1}.</span>
            {exercise.title}
          </p>
          {!expanded && (
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{exercise.description}</p>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-3 pb-3 pt-0 space-y-3 border-t border-slate-700/30">
          {/* Full description */}
          <p className="text-[12px] text-slate-300 leading-relaxed pt-2">{exercise.description}</p>

          {/* Tables used */}
          {exercise.tables && exercise.tables.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Table2 size={11} className="text-slate-500" />
              {exercise.tables.map((t) => (
                <span key={t} className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{t}</span>
              ))}
            </div>
          )}

          {/* Action buttons row */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1 text-[10px] text-brand-secondary hover:text-sky-300 transition-colors"
            >
              <Lightbulb size={11} /> {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-1 text-[10px] text-amber-400/70 hover:text-amber-300 transition-colors"
            >
              {showSolution ? <EyeOff size={11} /> : <Eye size={11} />}
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>

            <button
              onClick={() => onLoadQuery(exercise.solution)}
              className="flex items-center gap-1 text-[10px] bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-brand-bg px-2 py-1 rounded transition-all font-semibold ml-auto"
            >
              <Play size={10} /> Load into Editor
            </button>
          </div>

          {/* Hint */}
          {showHint && (
            <div className="bg-sky-950/20 border border-sky-900/30 rounded-md px-3 py-2 text-[11px] text-sky-300/80 italic">
              💡 {exercise.hint}
            </div>
          )}

          {/* Solution */}
          {showSolution && (
            <div className="bg-amber-950/15 border border-amber-900/30 rounded-md overflow-hidden">
              <div className="px-3 py-1.5 border-b border-amber-900/20 text-[10px] font-semibold text-amber-400/70 uppercase tracking-widest">
                Solution
              </div>
              <pre className="p-3 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {exercise.solution}
              </pre>
            </div>
          )}

          {/* Feedback */}
          {effectiveStatus === 'pass' && (
            <div className="flex items-center gap-1.5 text-[11px] text-brand-primary font-medium">
              <CheckCircle2 size={13} /> Correct! Well done.
            </div>
          )}
          {effectiveStatus === 'fail' && (
            <div className="text-[11px] text-red-400">
              ✗ Your last query didn't produce the expected result. Check the hint or solution above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
