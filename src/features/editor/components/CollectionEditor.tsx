import { useState } from 'react';
import type { MediaItem, NavigationItem } from '../../../types/content';
import { EditorField, controlClass, dangerButtonClass, fieldError, secondaryButtonClass, type EditorFieldSpec } from './EditorField';
import { FileUpload } from './FileUpload';

type IdentifiedItem = { id: string };

export function CollectionEditor<T extends IdentifiedItem>({ title, items, fields, create, onChange, withMedia = false }: {
  title: string;
  items: T[];
  fields: EditorFieldSpec[];
  create: () => T;
  onChange: (items: T[]) => void;
  withMedia?: boolean;
}) {
  function changeItem(index: number, key: string, value: unknown) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } as T : item));
  }

  function move(index: number, delta: number) {
    const destination = index + delta;
    if (destination < 0 || destination >= items.length) return;
    const next = [...items];
    [next[index], next[destination]] = [next[destination], next[index]];
    onChange(next);
  }

  return <section className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"><h2 className="m-0 text-lg font-bold">{title}</h2>{items.map((item, index) => {
    const record = item as T & Record<string, unknown>;
    const duplicateId = !item.id.trim() || items.some((candidate, candidateIndex) => candidateIndex !== index && candidate.id === item.id);
    const itemTitle = String(record.title || record.name || record.platform || record.clientName || record.company || title.replace(/s$/, ''));
    const itemId = `${title.toLowerCase().replace(/\s+/g, '-')}-item-${index}-id`;
    const errorId = `${itemId}-error`;

    return <details className="overflow-hidden rounded-lg border border-zinc-200" key={`${item.id}-${index}`}><summary className="cursor-pointer bg-zinc-50 px-4 py-3 font-semibold">{itemTitle} <span className="text-sm font-normal text-zinc-500">({item.id || 'missing ID'})</span></summary><div className="grid gap-4 p-4"><div className="grid max-w-4xl gap-1.5"><label className="text-sm font-medium text-zinc-700" htmlFor={itemId}>ID</label><input className={controlClass} id={itemId} aria-invalid={duplicateId} aria-describedby={duplicateId ? errorId : undefined} value={item.id} onChange={(event) => changeItem(index, 'id', event.currentTarget.value)} />{duplicateId && <span id={errorId} className="text-xs font-medium text-red-700" role="alert">IDs must be present and unique.</span>}</div>{fields.map((spec) => <EditorField key={spec.key} spec={spec} value={record[spec.key]} error={fieldError(spec, record[spec.key])} onChange={(value) => changeItem(index, spec.key, value)} />)}{withMedia && <MediaList items={(Array.isArray(record.media) ? record.media : []) as MediaItem[]} onChange={(media) => changeItem(index, 'media', media)} />}<div className="flex flex-wrap gap-2"><button className={secondaryButtonClass} type="button" onClick={() => move(index, -1)} disabled={index === 0}>Move up</button><button className={secondaryButtonClass} type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1}>Move down</button><button type="button" className={dangerButtonClass} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>Delete {title.replace(/s$/, '')}</button></div></div></details>;
  })}{!items.length && <p className="m-0 text-sm text-zinc-500">No {title.toLowerCase()} yet.</p>}<button type="button" className={`${secondaryButtonClass} justify-self-start`} onClick={() => onChange([...items, create()])}>Add {title.replace(/s$/, '')}</button></section>;
}

function MediaList({ items, onChange }: { items: MediaItem[]; onChange: (items: MediaItem[]) => void }) {
  function update(index: number, url: string | undefined) {
    onChange(url ? items.map((item, itemIndex) => itemIndex === index ? { ...item, url } : item) : items.filter((_, itemIndex) => itemIndex !== index));
  }

  return <fieldset className="grid min-w-0 gap-3 rounded-lg border border-zinc-200 p-4"><legend className="px-1 text-sm font-semibold text-zinc-700">Additional project media</legend>{items.map((item, index) => <div className="grid gap-2 rounded-lg bg-zinc-50 p-3" key={`${item.url}-${index}`}><p className="m-0 text-xs font-semibold uppercase tracking-wide text-zinc-600">{item.type}</p><FileUpload label={`Media ${index + 1}`} type={item.type} directory="projects" value={item.url} onChange={(url) => update(index, url)} /></div>)}<MediaAdder onAdd={(item) => onChange([...items, item])} /></fieldset>;
}

function MediaAdder({ onAdd }: { onAdd: (item: MediaItem) => void }) {
  const [type, setType] = useState<MediaItem['type']>('image');
  const [url, setUrl] = useState<string>();

  return <div className="grid gap-3 rounded-lg border border-dashed border-zinc-300 p-3"><label className="grid max-w-4xl gap-1.5 text-sm font-medium text-zinc-700">New media type<select className={controlClass} value={type} onChange={(event) => { setType(event.currentTarget.value as MediaItem['type']); setUrl(undefined); }}><option value="image">Image</option><option value="gif">GIF</option><option value="video">Video</option></select></label><FileUpload label="New project media" type={type} directory="projects" value={url} onChange={setUrl} /><button className={`${secondaryButtonClass} justify-self-start`} type="button" disabled={!url} onClick={() => { if (url) { onAdd({ type, url }); setUrl(undefined); } }}>Add media</button></div>;
}

export function NavigationEditor({ title, items, onChange }: { title: string; items: NavigationItem[]; onChange: (items: NavigationItem[]) => void }) {
  return <fieldset className="grid min-w-0 gap-3 rounded-lg border border-zinc-200 p-4"><legend className="px-1 text-sm font-semibold text-zinc-700">{title}</legend>{items.map((item, index) => <div className="grid items-end gap-3 rounded-lg bg-zinc-50 p-3 md:grid-cols-[1fr_1.4fr_auto]" key={item.id}><EditorField spec={{ key: 'label', label: 'Label', required: true }} value={item.label} error={fieldError({ key: 'label', label: 'Label', required: true }, item.label)} onChange={(value) => onChange(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, label: String(value) } : entry))} /><EditorField spec={{ key: 'url', label: 'URL', required: true }} value={item.url} error={fieldError({ key: 'url', label: 'URL', required: true }, item.url)} onChange={(value) => onChange(items.map((entry, itemIndex) => itemIndex === index ? { ...entry, url: String(value) } : entry))} /><button type="button" className={dangerButtonClass} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>Remove link</button></div>)}<button type="button" className={`${secondaryButtonClass} justify-self-start`} onClick={() => onChange([...items, { id: crypto.randomUUID(), label: '', url: '' }])}>Add link</button></fieldset>;
}

export function ActionFields({ title, value, onChange }: { title: string; value?: { label: string; url: string }; onChange: (value: { label: string; url: string } | undefined) => void }) {
  const action = value || { label: '', url: '' };
  const active = Boolean(action.label.trim() || action.url.trim());

  return <fieldset className="grid min-w-0 gap-3 rounded-lg border border-zinc-200 p-4"><legend className="px-1 text-sm font-semibold text-zinc-700">{title}</legend><EditorField spec={{ key: 'label', label: 'Label', required: active }} value={action.label} error={active ? fieldError({ key: 'label', label: 'Label', required: true }, action.label) : undefined} onChange={(label) => onChange({ ...action, label: String(label) })} /><EditorField spec={{ key: 'url', label: 'URL', required: active }} value={action.url} error={active ? fieldError({ key: 'url', label: 'URL', required: true }, action.url) : undefined} onChange={(url) => onChange({ ...action, url: String(url) })} /><button type="button" className={`${dangerButtonClass} justify-self-start`} onClick={() => onChange(undefined)}>Remove action</button></fieldset>;
}

export function createEditorId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

