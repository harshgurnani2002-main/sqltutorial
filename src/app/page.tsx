"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/store';
import { getDuckDB, initSampleData, executeQuery, type InitProgress } from '@/lib/duckdb';
import { lessons } from '@/lib/lessons';
import Sidebar from '@/components/Sidebar';
import LessonContent from '@/components/LessonContent';
import ResultTable from '@/components/ResultTable';
import SQLDiagram from '@/components/SQLDiagram';
import DatasetPreview from '@/components/DatasetPreview';
import TryQueryButton from '@/components/TryQueryButton';
import ExercisePanel from '@/components/ExercisePanel';
import { ChevronLeft, ChevronRight, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

// Lazy-load heavy editor
const SQLEditor = dynamic(() => import('@/components/SQLEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e] rounded-lg border border-slate-700 text-slate-500 text-xs">
      Loading editor…
    </div>
  ),
});

/* ================================================================
   Main Page
   ================================================================ */
export default function Home() {
  const {
    activeLessonId, setActiveLessonId,
    lastQueryResult, lastQueryError, setQueryResult,
    dbReady, setDbReady, dbError, setDbError, dbProgress, setDbProgress,
    markExerciseComplete, isExerciseComplete, markLessonComplete,
    addToHistory,
    sandboxMode,
  } = useStore();

  const [query, setQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [exerciseStatuses, setExerciseStatuses] = useState<Record<string, 'pass' | 'fail' | null>>({});
  const [initRetries, setInitRetries] = useState(0);
  const [showExercises, setShowExercises] = useState(true);

  // Ref for scrolling lesson content to top
  const lessonScrollRef = useRef<HTMLDivElement>(null);

  // ── Active lesson ──
  const activeLesson = useMemo(
    () => lessons.find((l) => l.id === activeLessonId) || lessons[0],
    [activeLessonId],
  );

  const lessonIdx = useMemo(() => lessons.findIndex((l) => l.id === activeLesson.id), [activeLesson]);
  const prevLesson = lessonIdx > 0 ? lessons[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < lessons.length - 1 ? lessons[lessonIdx + 1] : null;

  // ── When lesson changes — scroll to top + reset ──
  useEffect(() => {
    if (!sandboxMode) {
      setQuery(activeLesson.defaultQuery);
      setExerciseStatuses({});
      setQueryResult(null, null);
      // Scroll lesson content to top
      if (lessonScrollRef.current) {
        lessonScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [activeLesson, sandboxMode, setQueryResult]);

  // ── DuckDB init with retry ──
  const initDb = useCallback(async () => {
    try {
      setDbError(null);
      setDbProgress('Starting…');
      await getDuckDB((p: InitProgress) => setDbProgress(p.stage));
      await initSampleData((p: InitProgress) => setDbProgress(p.stage));
      setDbReady(true);
      setDbProgress('Ready');
    } catch (err: any) {
      console.error('DuckDB init failed', err);
      setDbError(err.message ?? 'Unknown error');
      setDbProgress('Failed');
    }
  }, [setDbReady, setDbError, setDbProgress]);

  useEffect(() => { initDb(); }, [initDb]);

  // Auto-run default query once DB ready
  useEffect(() => {
    if (dbReady && query) {
      handleExecute(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbReady]);

  // ── Try Query handler — loads SQL into editor and runs it ──
  const handleTryQuery = useCallback((sql: string) => {
    setQuery(sql);
    if (dbReady) {
      setTimeout(() => handleExecute(sql), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbReady]);

  // ── Execute ──
  const handleExecute = useCallback(async (sql?: string) => {
    const toRun = sql ?? query;
    if (!toRun.trim() || !dbReady) return;
    setIsExecuting(true);
    addToHistory(toRun);
    try {
      const res = await executeQuery(toRun);
      setQueryResult(res as any, null);
      if (!sandboxMode) {
        await checkExercises(res as any);
      }
    } catch (err: any) {
      setQueryResult(null, err.message ?? 'Query failed');
    } finally {
      setIsExecuting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, dbReady, sandboxMode]);

  // ── Exercise checker ──
  const checkExercises = async (currentResult: Record<string, unknown>[]) => {
    const newStatuses: Record<string, 'pass' | 'fail' | null> = { ...exerciseStatuses };
    for (const ex of activeLesson.exercises) {
      if (isExerciseComplete(ex.id)) {
        newStatuses[ex.id] = 'pass';
        continue;
      }
      try {
        const expected = await executeQuery(ex.expectedSql);
        const match = JSON.stringify(currentResult) === JSON.stringify(expected);
        newStatuses[ex.id] = match ? 'pass' : 'fail';
        if (match) markExerciseComplete(ex.id);
      } catch {
        // keep null
      }
    }
    setExerciseStatuses(newStatuses);

    const allPassed = activeLesson.exercises.every(
      (ex) => newStatuses[ex.id] === 'pass' || isExerciseComplete(ex.id),
    );
    if (allPassed && activeLesson.exercises.length > 0) {
      markLessonComplete(activeLesson.id);
    }
  };

  const passedCount = activeLesson.exercises.filter(
    (ex) => exerciseStatuses[ex.id] === 'pass' || isExerciseComplete(ex.id),
  ).length;

  // ── Lesson Nav buttons (reusable) ──
  const LessonNav = ({ position }: { position: 'top' | 'bottom' }) => (
    <div className={`flex items-center w-full ${position === 'top' ? 'gap-4' : 'justify-between pt-6 mt-6 border-t border-slate-800'}`}>
      <div className="w-20 shrink-0">
        {prevLesson && (
          <button
            onClick={() => setActiveLessonId(prevLesson.id)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>{position === 'bottom' ? prevLesson.title : 'Prev'}</span>
          </button>
        )}
      </div>

      <div className="flex-1 text-center min-w-0">
        {position === 'top' && (
          <h2 className="font-heading font-semibold text-white text-sm truncate px-2">{activeLesson.title}</h2>
        )}
      </div>

      <div className="w-20 shrink-0 flex justify-end">
        {nextLesson && (
          <button
            onClick={() => setActiveLessonId(nextLesson.id)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors group"
          >
            <span>{position === 'bottom' ? nextLesson.title : 'Next'}</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );

  // ── Loading / Error states ──
  if (!dbReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <Spinner />
          <p className="text-sm text-slate-300 font-mono">{dbProgress}</p>
          {dbError && (
            <div className="mt-2 space-y-3">
              <p className="text-xs text-red-400">{dbError}</p>
              <button
                onClick={() => { setInitRetries((r) => r + 1); initDb(); }}
                className="text-xs bg-brand-primary text-brand-bg font-bold px-4 py-2 rounded-md hover:bg-green-400 transition-colors flex items-center gap-1.5 mx-auto"
              >
                <RotateCcw size={12} /> Retry ({initRetries})
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── SANDBOX MODE ──
  if (sandboxMode) {
    return (
      <div className="flex h-screen w-full bg-brand-bg text-brand-neutral overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-12 border-b border-slate-800 bg-slate-900/50 flex items-center px-5 justify-between shrink-0">
            <h2 className="font-heading font-semibold text-white text-sm">🧪 SQL Sandbox</h2>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">Free Mode — experiment with any SQL</span>
          </header>
          <div className="flex-1 grid grid-cols-2 gap-0 min-h-0">
            <div className="border-r border-slate-800 overflow-y-auto p-6">
              <h3 className="text-sm font-bold text-white mb-3 font-heading">Available Tables</h3>
              <DatasetPreview tables={['employees', 'customers', 'products', 'orders']} maxRows={10} />
            </div>
            <div className="flex flex-col min-h-0">
              <div className="h-[45%] min-h-[180px] p-3 pb-1.5">
                <SQLEditor
                  query={query}
                  setQuery={setQuery}
                  onExecute={() => handleExecute()}
                  isLoading={isExecuting}
                  disabled={!dbReady}
                />
              </div>
              <div className="flex-1 p-3 pt-1.5 min-h-0">
                <ResultTable data={lastQueryResult} error={lastQueryError} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── LESSON MODE (main layout) ──
  return (
    <div className="flex h-screen w-full bg-brand-bg text-brand-neutral overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header with lesson nav */}
        <header className="h-12 border-b border-slate-800 bg-slate-900/50 flex items-center px-5 justify-between shrink-0">
          <LessonNav position="top" />
          <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded ml-3">DuckDB WASM</span>
        </header>

        {/* Body — two columns */}
        <div className="flex-1 grid grid-cols-2 gap-0 min-h-0">
          {/* ── Left: Lesson Content ── */}
          <div className="border-r border-slate-800 flex flex-col min-h-0">
            <div ref={lessonScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* 1. Lesson content with Try Query buttons */}
              <LessonContent raw={activeLesson.content} onTryQuery={handleTryQuery} />

              {/* 2. Concept diagram */}
              {activeLesson.diagram && <SQLDiagram type={activeLesson.diagram} />}

              {/* 3. Dataset preview */}
              <DatasetPreview tables={activeLesson.tables} />

              {/* 4. Interactive examples */}
              {activeLesson.examples.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-white mb-3 font-heading mt-6">Interactive Examples</h3>
                  {activeLesson.examples.map((ex, i) => (
                    <TryQueryButton
                      key={i}
                      title={ex.title}
                      description={ex.description}
                      sql={ex.sql}
                      onTryQuery={handleTryQuery}
                    />
                  ))}
                </div>
              )}

              {/* 5. Bottom lesson navigation */}
              <LessonNav position="bottom" />
            </div>

            {/* 6. Exercises panel — collapsible */}
            <div className="border-t border-slate-800 bg-slate-900/30 shrink-0">
              {/* Toggle header */}
              <button
                onClick={() => setShowExercises(!showExercises)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Practice Exercises</h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {passedCount} / {activeLesson.exercises.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passedCount === activeLesson.exercises.length && activeLesson.exercises.length > 0 && (
                    <span className="text-[10px] font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">Complete ✓</span>
                  )}
                  {showExercises ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
                </div>
              </button>

              {/* Exercise list */}
              {showExercises && (
                <div className="max-h-[40vh] overflow-y-auto border-t border-slate-800/60">
                  <div className="p-4 space-y-2">
                    {activeLesson.exercises.map((ex, i) => (
                      <ExercisePanel
                        key={ex.id}
                        exercise={ex}
                        index={i}
                        status={exerciseStatuses[ex.id] ?? null}
                        alreadyComplete={isExerciseComplete(ex.id)}
                        onLoadQuery={handleTryQuery}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: SQL Playground ── */}
          <div className="flex flex-col min-h-0">
            <div className="h-[45%] min-h-[180px] p-3 pb-1.5">
              <SQLEditor
                query={query}
                setQuery={setQuery}
                onExecute={() => handleExecute()}
                isLoading={isExecuting}
                disabled={!dbReady}
              />
            </div>
            <div className="flex-1 p-3 pt-1.5 min-h-0">
              <ResultTable data={lastQueryResult} error={lastQueryError} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Loading spinner ── */
function Spinner() {
  return (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-2 border-transparent border-t-brand-primary rounded-full animate-spin" />
      <div className="absolute inset-1.5 border-2 border-transparent border-r-brand-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
    </div>
  );
}
