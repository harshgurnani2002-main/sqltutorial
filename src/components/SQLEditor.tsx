"use client";

import { useCallback, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Play, History } from 'lucide-react';
import { useStore } from '@/store';

interface SQLEditorProps {
  query: string;
  setQuery: (val: string) => void;
  onExecute: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const SQL_KEYWORDS = [
  'SELECT','FROM','WHERE','AND','OR','NOT','IN','BETWEEN','LIKE','IS','NULL',
  'ORDER','BY','ASC','DESC','LIMIT','OFFSET','GROUP','HAVING','JOIN','INNER',
  'LEFT','RIGHT','FULL','OUTER','ON','AS','DISTINCT','INSERT','INTO','VALUES',
  'UPDATE','SET','DELETE','CREATE','TABLE','INDEX','DROP','ALTER','ADD',
  'COUNT','SUM','AVG','MIN','MAX','CASE','WHEN','THEN','ELSE','END',
  'EXISTS','UNION','ALL','ROW_NUMBER','RANK','DENSE_RANK','OVER','PARTITION',
  'EXPLAIN','WITH',
];

const TABLE_NAMES = ['employees','customers','orders','products'];
const COLUMN_NAMES = [
  'id','name','department','salary','manager_id','hire_date',
  'customer_id','email','country','created_at',
  'product_id','category','price','stock',
  'order_id','quantity','amount','order_date',
];

export default function SQLEditor({ query, setQuery, onExecute, isLoading, disabled }: SQLEditorProps) {
  const { queryHistory } = useStore();
  const editorRef = useRef<any>(null);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    // Ctrl/Cmd + Enter shortcut
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => onExecute(),
    );

    // Register SQL autocomplete provider
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const kwSuggestions = SQL_KEYWORDS.map((kw) => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          range,
        }));

        const tableSuggestions = TABLE_NAMES.map((t) => ({
          label: t,
          kind: monaco.languages.CompletionItemKind.Struct,
          insertText: t,
          range,
          detail: 'table',
        }));

        const colSuggestions = COLUMN_NAMES.map((c) => ({
          label: c,
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: c,
          range,
          detail: 'column',
        }));

        return { suggestions: [...kwSuggestions, ...tableSuggestions, ...colSuggestions] };
      },
    });
  }, [onExecute]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-slate-700">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="text-xs font-medium text-slate-300 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          query.sql
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExecute}
            disabled={isLoading || !query.trim() || disabled}
            className="flex items-center gap-1.5 bg-brand-primary hover:bg-green-400 text-brand-bg px-3 py-1.5 rounded-md text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play size={13} />
            {isLoading ? 'Running…' : 'Run'}
            <kbd className="text-[10px] opacity-60 ml-0.5 font-mono">⌘↵</kbd>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={query}
          onChange={(val) => setQuery(val || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: '"JetBrains Mono", monospace',
            padding: { top: 12 },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            tabSize: 2,
          }}
          onMount={handleMount}
        />
      </div>
    </div>
  );
}
