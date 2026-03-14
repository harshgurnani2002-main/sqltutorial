import { create } from 'zustand';

export type QueryResult = Record<string, unknown>[];

/* ── Progress storage (localStorage) ─────────────────────── */

const STORAGE_KEY = 'sqlquest_progress';

interface ProgressData {
  completedExercises: string[];   // exercise IDs
  completedLessons: string[];     // lesson IDs
}

function loadProgress(): ProgressData {
  if (typeof window === 'undefined') return { completedExercises: [], completedLessons: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProgressData;
  } catch { /* ignore */ }
  return { completedExercises: [], completedLessons: [] };
}

function saveProgress(p: ProgressData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

/* ── Store ────────────────────────────────────────────────── */

interface AppState {
  /* DB readiness */
  dbReady: boolean;
  dbError: string | null;
  dbProgress: string;
  setDbReady: (ready: boolean) => void;
  setDbError: (err: string | null) => void;
  setDbProgress: (msg: string) => void;

  /* Sidebar */
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  /* Active lesson */
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;

  /* Query */
  queryHistory: string[];
  addToHistory: (query: string) => void;
  lastQueryResult: QueryResult | null;
  lastQueryError: string | null;
  setQueryResult: (result: QueryResult | null, error: string | null) => void;

  /* Sandbox mode */
  sandboxMode: boolean;
  setSandboxMode: (v: boolean) => void;

  /* Progress tracking */
  completedExercises: string[];
  completedLessons: string[];
  markExerciseComplete: (exId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  isExerciseComplete: (exId: string) => boolean;
  isLessonComplete: (lessonId: string) => boolean;
  progressPercent: (totalLessons: number) => number;
  resetProgress: () => void;
}

const initial = loadProgress();

export const useStore = create<AppState>((set, get) => ({
  dbReady: false,
  dbError: null,
  dbProgress: 'Waiting…',
  setDbReady: (ready) => set({ dbReady: ready }),
  setDbError: (err) => set({ dbError: err }),
  setDbProgress: (msg) => set({ dbProgress: msg }),

  isSidebarOpen: true,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

  activeLessonId: 'introduction',
  setActiveLessonId: (id) => set({ activeLessonId: id }),

  queryHistory: [],
  addToHistory: (query) =>
    set((s) => ({ queryHistory: [query, ...s.queryHistory].slice(0, 50) })),

  lastQueryResult: null,
  lastQueryError: null,
  setQueryResult: (result, error) =>
    set({ lastQueryResult: result, lastQueryError: error }),

  sandboxMode: false,
  setSandboxMode: (v) => set({ sandboxMode: v }),

  completedExercises: initial.completedExercises,
  completedLessons: initial.completedLessons,

  markExerciseComplete: (exId) => {
    const s = get();
    if (s.completedExercises.includes(exId)) return;
    const next = [...s.completedExercises, exId];
    set({ completedExercises: next });
    saveProgress({ completedExercises: next, completedLessons: s.completedLessons });
  },

  markLessonComplete: (lessonId) => {
    const s = get();
    if (s.completedLessons.includes(lessonId)) return;
    const next = [...s.completedLessons, lessonId];
    set({ completedLessons: next });
    saveProgress({ completedExercises: s.completedExercises, completedLessons: next });
  },

  isExerciseComplete: (exId) => get().completedExercises.includes(exId),
  isLessonComplete: (lessonId) => get().completedLessons.includes(lessonId),
  progressPercent: (total) => {
    if (total === 0) return 0;
    return Math.round((get().completedLessons.length / total) * 100);
  },
  resetProgress: () => {
    set({ completedExercises: [], completedLessons: [] });
    saveProgress({ completedExercises: [], completedLessons: [] });
  },
}));
