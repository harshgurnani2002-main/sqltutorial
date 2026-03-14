"use client";

import { useStore } from '@/store';
import { lessons } from '@/lib/lessons';
import { Database, ChevronRight, CheckCircle2, BarChart3, Terminal } from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar() {
  const {
    isSidebarOpen,
    activeLessonId,
    setActiveLessonId,
    isLessonComplete,
    completedLessons,
    dbReady,
    sandboxMode,
    setSandboxMode,
  } = useStore();

  if (!isSidebarOpen) return null;

  const pct = lessons.length > 0
    ? Math.round((completedLessons.length / lessons.length) * 100)
    : 0;

  return (
    <aside className="w-64 bg-brand-bg border-r border-slate-800 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
          <Database size={16} className="text-brand-bg" />
        </div>
        <h1 className="font-heading font-bold text-lg text-white tracking-tight">SQL Quest</h1>
      </div>

      {/* Progress */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5"><BarChart3 size={12} /> Progress</span>
          <span className="font-mono">{pct}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Lesson list */}
      <nav className="flex-1 overflow-y-auto py-2">
        <h2 className="px-5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Lessons</h2>
        <ul>
          {lessons.map((lesson) => {
            const done = isLessonComplete(lesson.id);
            const active = activeLessonId === lesson.id && !sandboxMode;
            return (
              <li key={lesson.id}>
                <button
                  onClick={() => { setActiveLessonId(lesson.id); setSandboxMode(false); }}
                  className={clsx(
                    'w-full flex items-center gap-2 px-5 py-2.5 text-[13px] transition-colors text-left',
                    active
                      ? 'bg-slate-800/60 text-brand-primary border-r-2 border-brand-primary'
                      : 'text-slate-400 hover:bg-slate-800/30 hover:text-white',
                  )}
                >
                  {done ? (
                    <CheckCircle2 size={14} className="text-brand-primary shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                  )}
                  <span className="flex-1 leading-snug">{lesson.title}</span>
                  {active && <ChevronRight size={14} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sandbox mode button */}
      <div className="px-4 pb-2">
        <button
          onClick={() => setSandboxMode(!sandboxMode)}
          className={clsx(
            'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all',
            sandboxMode
              ? 'bg-brand-primary text-brand-bg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          )}
        >
          <Terminal size={14} />
          Sandbox Mode
        </button>
      </div>

      {/* DB status */}
      <div className="p-4 pt-2 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg px-3 py-2.5 flex items-center gap-2">
          <span className={clsx(
            'w-2 h-2 rounded-full shrink-0',
            dbReady ? 'bg-brand-primary' : 'bg-amber-500 animate-pulse'
          )} />
          <span className="text-xs text-slate-300">
            {dbReady ? 'DuckDB Ready' : 'Connecting…'}
          </span>
        </div>
      </div>
    </aside>
  );
}
