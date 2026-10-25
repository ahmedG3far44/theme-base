import { useEffect, useRef, useState } from 'react';
import type { PortfolioContent } from '../../../types/content';
import { migrateContent, validateContent } from '../../../utils/contentValidation';

function ActionIcon({ name }: { name: 'save' | 'export' | 'import' }) {
  const paths = {
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>,
    export: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
    import: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5M12 3v12" /></>,
  };
  return <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function ContentJsonActions({ content, onImport, onSaved }: { content: PortfolioContent; onImport: (content: PortfolioContent) => void; onSaved: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const savedSnapshot = useRef(JSON.stringify(content));
  const previousContent = useRef(JSON.stringify(content));
  const [status, setStatus] = useState<{ kind: 'idle' | 'saving' | 'importing' | 'success' | 'error'; message: string }>({ kind: 'idle', message: '' });
  const isDirty = savedSnapshot.current !== JSON.stringify(content);
  useEffect(() => {
    const snapshot = JSON.stringify(content);
    if (snapshot !== previousContent.current) {
      previousContent.current = snapshot;
      setStatus((current) => current.kind === 'success' && (current.message.startsWith('Saved') || current.message.startsWith('Downloaded')) ? { kind: 'idle', message: '' } : current);
    }
  }, [content]);
  function exportContent() {
    const validation = validateContent(content);
    if (!validation.valid) { setStatus({ kind: 'error', message: validation.errors.join(' ') }); return; }
    const blob = new Blob([`${JSON.stringify(content, null, 2)}\n`], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'content.json'; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); setStatus({ kind: 'success', message: 'Downloaded content.json.' });
  }
  async function save() {
    const validation = validateContent(content); if (!validation.valid) { setStatus({ kind: 'error', message: validation.errors.join(' ') }); return; }
    setStatus({ kind: 'saving', message: 'Saving content…' });
    try { const snapshot = JSON.stringify(content); const response = await fetch('/__cms/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: snapshot }); const result = await response.json() as { error?: string }; if (!response.ok) throw new Error(result.error || 'Save failed.'); savedSnapshot.current = snapshot; onSaved(); setStatus({ kind: 'success', message: 'Saved to src/content/content.json.' }); }
    catch (error) { setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Save failed.' }); }
  }
  async function importFile(file?: File) {
    if (!file) return;
    setStatus({ kind: 'importing', message: `Reading ${file.name}…` });
    try { const parsed: unknown = migrateContent(JSON.parse(await file.text())); const validation = validateContent(parsed); if (!validation.valid) throw new Error(validation.errors.join(' ')); onImport(parsed as PortfolioContent); setStatus({ kind: 'success', message: `Imported ${file.name}. Save to persist changes.` }); }
    catch (error) { setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Invalid JSON file.' }); }
    finally { if (inputRef.current) inputRef.current.value = ''; }
  }
  const busy = status.kind === 'saving' || status.kind === 'importing';
  return <div className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-start gap-2 xl:w-auto xl:max-w-2xl xl:justify-end" aria-busy={busy}><span className={`mr-1 inline-flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs font-medium ${busy ? 'border-zinc-200 bg-white text-zinc-600' : isDirty ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-zinc-200 bg-white text-zinc-600'}`} role="status"><span className={`size-2 rounded-full ${busy ? 'bg-zinc-400' : isDirty ? 'bg-amber-500' : 'bg-emerald-500'}`} />{status.kind === 'saving' ? 'Saving changes' : status.kind === 'importing' ? 'Importing file' : isDirty ? 'Unsaved changes' : 'All changes saved'}</span><button className="inline-flex min-h-9 items-center gap-2 rounded-md border border-zinc-950 bg-zinc-950 px-3 py-2 text-sm font-medium text-white shadow-xs hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60" type="button" onClick={() => void save()} disabled={busy}><ActionIcon name="save" />{status.kind === 'saving' ? 'Saving…' : 'Save changes'}</button><button className="inline-flex min-h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-xs hover:bg-zinc-100 disabled:opacity-50" type="button" onClick={exportContent} disabled={busy}><ActionIcon name="export" />Export</button><button className="inline-flex min-h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-xs hover:bg-zinc-100 disabled:opacity-50" type="button" onClick={() => inputRef.current?.click()} disabled={busy}><ActionIcon name="import" />{status.kind === 'importing' ? 'Importing…' : 'Import'}</button><input ref={inputRef} type="file" accept="application/json,.json" hidden onChange={(event) => void importFile(event.currentTarget.files?.[0])} />{status.message && <p className={`m-0 w-full rounded-md border p-3 text-sm ${status.kind === 'error' ? 'border-red-200 bg-red-50 text-red-800' : status.kind === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-zinc-200 bg-white text-zinc-700'}`} role={status.kind === 'error' ? 'alert' : 'status'} aria-live="polite">{status.message}</p>}</div>;
}
