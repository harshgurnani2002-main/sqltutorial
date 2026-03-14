"use client";

/**
 * Renders lesson markdown-like content as styled React output.
 * Handles headings, bold, inline code, code blocks with "Try Query" buttons, tables, and lists.
 */

interface LessonContentProps {
  raw: string;
  onTryQuery?: (sql: string) => void;
}

export default function LessonContent({ raw, onTryQuery }: LessonContentProps) {
  const blocks = parse(raw);

  return (
    <div className="lesson-content text-sm leading-relaxed text-slate-300 space-y-1">
      {blocks.map((block, i) => (
        <Block key={i} block={block} onTryQuery={onTryQuery} />
      ))}
    </div>
  );
}

/* ── Types ─────────────────────────────────────────────────── */

type ParsedBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'codeblock'; lang: string; code: string }
  | { type: 'table'; header: string[]; rows: string[][] }
  | { type: 'listItem'; text: string }
  | { type: 'paragraph'; text: string };

/* ── Parser ────────────────────────────────────────────────── */

function parse(md: string): ParsedBlock[] {
  const lines = md.split('\n');
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: 'codeblock', lang, code: codeLines.join('\n').trim() });
      continue;
    }

    // Table (starts with |)
    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const parseCells = (r: string) => r.split('|').filter(Boolean).map(c => c.trim());
        const header = parseCells(tableLines[0]);
        // skip separator row (row 1)
        const dataRows = tableLines.slice(2).map(parseCells);
        blocks.push({ type: 'table', header, rows: dataRows });
      }
      continue;
    }

    // Headings
    if (line.startsWith('### ')) { blocks.push({ type: 'heading', level: 3, text: line.slice(4) }); i++; continue; }
    if (line.startsWith('## ')) { blocks.push({ type: 'heading', level: 2, text: line.slice(3) }); i++; continue; }
    if (line.startsWith('# ')) { blocks.push({ type: 'heading', level: 1, text: line.slice(2) }); i++; continue; }

    // List items
    if (line.startsWith('- ')) { blocks.push({ type: 'listItem', text: line.slice(2) }); i++; continue; }

    // Numbered list items
    if (/^\d+\.\s/.test(line)) { blocks.push({ type: 'listItem', text: line.replace(/^\d+\.\s/, '') }); i++; continue; }

    // Empty line — skip
    if (line.trim() === '') { i++; continue; }

    // Paragraph — collect consecutive non-special lines
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('```') && !lines[i].startsWith('|') && !lines[i].startsWith('- ') && !/^\d+\.\s/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join(' ') });
    }
  }

  return blocks;
}

/* ── Block Renderer ────────────────────────────────────────── */

function Block({ block, onTryQuery }: { block: ParsedBlock; onTryQuery?: (sql: string) => void }) {
  switch (block.type) {
    case 'heading':
      if (block.level === 1) return <h1 className="text-xl font-bold text-white mt-6 mb-3 font-heading">{block.text}</h1>;
      if (block.level === 2) return <h2 className="text-lg font-bold text-white mt-6 mb-2 font-heading">{block.text}</h2>;
      return <h3 className="text-base font-bold text-white mt-5 mb-2 font-heading">{block.text}</h3>;

    case 'codeblock':
      return (
        <div className="my-3 group relative">
          <pre className="bg-slate-950 border border-slate-800 rounded-md p-4 overflow-x-auto font-mono text-xs text-emerald-400 leading-relaxed">
            {block.code}
          </pre>
          {onTryQuery && block.lang === 'sql' && block.code && !block.code.startsWith('--') && (
            <button
              onClick={() => onTryQuery(block.code)}
              className="absolute top-2 right-2 flex items-center gap-1 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-brand-bg px-2 py-1 rounded text-[10px] font-bold transition-all opacity-0 group-hover:opacity-100"
            >
              ▶ Try This Query
            </button>
          )}
        </div>
      );

    case 'table':
      return (
        <div className="overflow-x-auto my-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr>
                {block.header.map((h, i) => (
                  <th key={i} className="px-3 py-2 border-b border-slate-700 text-slate-300 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-1.5 border-b border-slate-800 text-slate-400">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'listItem':
      return <li className="ml-4 list-disc text-slate-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFormat(block.text) }} />;

    case 'paragraph':
      return <p className="my-2 text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFormat(block.text) }} />;

    default:
      return null;
  }
}

/* ── Inline formatting ─────────────────────────────────────── */

function inlineFormat(text: string): string {
  let out = text;
  // Bold
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  // Italic
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Inline code
  out = out.replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-sky-400 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
  // Links (rare in content, but handle)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-secondary underline">$1</a>');
  return out;
}
