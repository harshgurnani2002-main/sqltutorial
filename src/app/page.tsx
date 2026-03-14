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
import { clsx } from 'clsx';

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

  // ── Mobile View State ──
  const [mobileView, setMobileView] = useState<'learn' | 'query' | 'results'>('learn');
  const { isSidebarOpen, toggleSidebar } = useStore();

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
        <div className="flex flex-col items-center gap-4 max-w-sm text-center px-6">
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

  // ── Mobile Bottom Nav ──
  const MobileBottomNav = () => (
    <div className="lg:hidden flex border-t border-slate-800 bg-[#0b0e14] shrink-0">
      <button
        onClick={() => setMobileView('learn')}
        className={clsx(
          "flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors",
          mobileView === 'learn' ? "text-brand-primary" : "text-slate-500"
        )}
      >
        <div className={clsx("p-1 rounded-md transition-colors", mobileView === 'learn' ? "bg-brand-primary/10" : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">Learn</span>
      </button>
      <button
        onClick={() => setMobileView('query')}
        className={clsx(
          "flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors",
          mobileView === 'query' ? "text-brand-primary" : "text-slate-500"
        )}
      >
        <div className={clsx("p-1 rounded-md transition-colors", mobileView === 'query' ? "bg-brand-primary/10" : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">Query</span>
      </button>
      <button
        onClick={() => setMobileView('results')}
        className={clsx(
          "flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors",
          mobileView === 'results' ? "text-brand-primary" : "text-slate-500"
        )}
      >
        <div className={clsx("p-1 rounded-md transition-colors", mobileView === 'results' ? "bg-brand-primary/10" : "")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">Results</span>
      </button>
    </div>
  );

  // ── SANDBOX MODE ──
  if (sandboxMode) {
    return (
      <div className="flex h-screen w-full bg-brand-bg text-brand-neutral overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-[#0b0e14]">
          <header className="h-14 lg:h-12 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 lg:px-5 justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white"
              >
                <div className="w-5 h-0.5 bg-current mb-1" />
                <div className="w-5 h-0.5 bg-current mb-1" />
                <div className="w-5 h-0.5 bg-current" />
              </button>
              <h2 className="font-heading font-semibold text-white text-sm">🧪 SQL Sandbox</h2>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">Free Mode — experiment with any SQL</span>
          </header>
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0 overflow-hidden">
            <div className={clsx("border-r border-slate-800 overflow-y-auto p-4 lg:p-6", mobileView !== 'learn' && "hidden lg:block")}>
              <h3 className="text-sm font-bold text-white mb-3 font-heading">Available Tables</h3>
              <DatasetPreview tables={['employees', 'customers', 'products', 'orders']} maxRows={10} />
            </div>
            <div className={clsx("flex flex-col min-h-0", mobileView === 'learn' && "hidden lg:flex")}>
              <div className={clsx("h-[45%] min-h-[180px] p-3 pb-1.5", mobileView === 'results' && "hidden lg:block")}>
                <SQLEditor
                  query={query}
                  setQuery={setQuery}
                  onExecute={() => { handleExecute(); if (window.innerWidth < 1024) setMobileView('results'); }}
                  isLoading={isExecuting}
                  disabled={!dbReady}
                />
              </div>
              <div className={clsx("flex-1 p-3 pt-1.5 min-h-0", mobileView === 'query' && "hidden lg:block")}>
                <ResultTable data={lastQueryResult} error={lastQueryError} />
              </div>
            </div>
          </div>
          <MobileBottomNav />
        </main>
      </div>
    );
  }

  // ── LESSON MODE (main layout) ──
  return (
    <div className="flex h-screen w-full bg-brand-bg text-brand-neutral overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0b0e14]">
        {/* Header with lesson nav */}
        <header className="h-14 lg:h-12 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 lg:px-5 justify-between shrink-0">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white shrink-0"
              aria-label="Toggle Sidebar"
            >
              <div className="w-5 h-0.5 bg-current mb-1" />
              <div className="w-5 h-0.5 bg-current mb-0.5" />
              <div className="w-5 h-0.5 bg-current" />
            </button>
            <LessonNav position="top" />
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded ml-3 shrink-0">DuckDB WASM</span>
        </header>

        {/* Body — responsive columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-0 overflow-hidden">
          {/* ── Left: Lesson Content / Learn View ── */}
          <div className={clsx(
            "border-r border-slate-800 flex flex-col min-h-0 overflow-hidden",
            mobileView !== 'learn' && "hidden lg:flex"
          )}>
            <div ref={lessonScrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
              {/* 1. Lesson content with Try Query buttons */}
              <LessonContent raw={activeLesson.content} onTryQuery={(sql) => { handleTryQuery(sql); if (window.innerWidth < 1024) setMobileView('query'); }} />

              {/* 2. Concept diagram */}
              {activeLesson.diagram && (
                <div className="py-2">
                  <SQLDiagram type={activeLesson.diagram} />
                </div>
              )}

              {/* 3. Dataset preview */}
              <DatasetPreview tables={activeLesson.tables} />

              {/* 4. Interactive examples */}
              {activeLesson.examples.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white font-heading mt-6">Interactive Examples</h3>
                  {activeLesson.examples.map((ex, i) => (
                    <TryQueryButton
                      key={i}
                      title={ex.title}
                      description={ex.description}
                      sql={ex.sql}
                      onTryQuery={(sql) => { handleTryQuery(sql); if (window.innerWidth < 1024) setMobileView('query'); }}
                    />
                  ))}
                </div>
              )}

              {/* 5. Bottom lesson navigation */}
              <LessonNav position="bottom" />
              
              {/* Spacer for bottom nav on mobile */}
              <div className="h-8 lg:hidden" />
            </div>

            {/* 6. Exercises panel — collapsible (Desktop only or in Learn view) */}
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
                <div className="max-h-[30vh] lg:max-h-[40vh] overflow-y-auto border-t border-slate-800/60 font-sans">
                  <div className="p-3 lg:p-4 space-y-2">
                    {activeLesson.exercises.map((ex, i) => (
                      <ExercisePanel
                        key={ex.id}
                        exercise={ex}
                        index={i}
                        status={exerciseStatuses[ex.id] ?? null}
                        alreadyComplete={isExerciseComplete(ex.id)}
                        onLoadQuery={(sql) => { handleTryQuery(sql); if (window.innerWidth < 1024) setMobileView('query'); }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: SQL Playground (Query/Results Views) ── */}
          <div className={clsx(
            "flex flex-col min-h-0 h-full overflow-hidden",
            mobileView === 'learn' && "hidden lg:flex"
          )}>
            <div className={clsx(
              "h-full lg:h-[45%] min-h-[200px] p-3 pb-1.5 flex flex-col",
              mobileView === 'results' && "hidden lg:flex"
            )}>
              <div className="flex-1">
                <SQLEditor
                  query={query}
                  setQuery={setQuery}
                  onExecute={() => { handleExecute(); if (window.innerWidth < 1024) setMobileView('results'); }}
                  isLoading={isExecuting}
                  disabled={!dbReady}
                />
              </div>
            </div>
            <div className={clsx(
              "flex-1 p-3 pt-1.5 min-h-0 flex flex-col",
              mobileView === 'query' && "hidden lg:flex"
            )}>
              <ResultTable data={lastQueryResult} error={lastQueryError} />
            </div>
          </div>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
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
