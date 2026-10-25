import { useId } from 'react';
import { safeUrl } from '../../../utils/contentValidation';
import { FileUpload, type UploadDirectory } from './FileUpload';

export type EditorFieldSpec = {
  key: string;
  label: string;
  kind?: 'text' | 'long' | 'number' | 'boolean' | 'image' | 'gif' | 'video' | 'list';
  directory?: UploadDirectory;
  required?: boolean;
};

export const controlClass = 'h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-950 shadow-xs placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 aria-invalid:border-red-500';
export const secondaryButtonClass = 'inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-xs hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50';
export const dangerButtonClass = 'inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-xs hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50';

export const textField = (key: string, label: string): EditorFieldSpec => ({ key, label });
export const longField = (key: string, label: string): EditorFieldSpec => ({ key, label, kind: 'long' });
export const imageField = (key: string, label: string, directory: UploadDirectory): EditorFieldSpec => ({ key, label, kind: 'image', directory });
export const listField = (key: string, label: string): EditorFieldSpec => ({ key, label, kind: 'list' });

export function fieldError(spec: EditorFieldSpec, value: unknown): string | undefined {
  if (spec.required && (typeof value !== 'string' || !value.trim())) return `${spec.label} is required.`;
  if (typeof value === 'string' && value.trim() && (spec.key === 'url' || spec.key.toLowerCase().includes('url')) && !safeUrl(value)) return 'Enter a valid http(s) URL, anchor, email link, or phone link.';
  if (spec.key === 'email' && typeof value === 'string' && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
  if (spec.kind === 'number' && value !== undefined && (typeof value !== 'number' || value < 0 || value > 100)) return 'Enter a value from 0 to 100.';
  return undefined;
}

export function EditorField({ spec, value, onChange, error }: { spec: EditorFieldSpec; value: unknown; onChange: (value: unknown) => void; error?: string }) {
  const inputId = useId();
  const accessibilityProps = {
    id: inputId,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${inputId}-error` : undefined,
  };
  const feedback = error ? <span id={`${inputId}-error`} className="text-xs font-medium text-red-700" role="alert">{error}</span> : null;

  if (spec.kind === 'image' || spec.kind === 'gif' || spec.kind === 'video') {
    return <FileUpload label={spec.label} type={spec.kind === 'gif' ? 'gif' : spec.kind === 'video' ? 'video' : 'image'} directory={spec.directory || 'projects'} value={typeof value === 'string' ? value : undefined} onChange={onChange} />;
  }

  if (spec.kind === 'boolean') {
    return <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">{spec.label}<input {...accessibilityProps} className="size-4 accent-zinc-600" type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.currentTarget.checked)} />{feedback}</label>;
  }

  if (spec.kind === 'long' || spec.kind === 'list') {
    const fieldValue = spec.kind === 'list' ? Array.isArray(value) ? value.join('\n') : '' : typeof value === 'string' ? value : '';
    return <div className="grid max-w-4xl gap-1.5"><label className="text-sm font-medium text-zinc-700" htmlFor={inputId}>{spec.label}</label><textarea {...accessibilityProps} className={`${controlClass} min-h-24 resize-y`} rows={3} value={fieldValue} onChange={(event) => onChange(spec.kind === 'list' ? event.currentTarget.value.split('\n').filter(Boolean) : event.currentTarget.value)} />{feedback}</div>;
  }

  if (spec.kind === 'number') {
    return <div className="grid max-w-4xl gap-1.5"><label className="text-sm font-medium text-zinc-700" htmlFor={inputId}>{spec.label}</label><input {...accessibilityProps} className={controlClass} type="number" min="0" max="100" value={typeof value === 'number' ? value : ''} onChange={(event) => onChange(event.currentTarget.value === '' ? undefined : Number(event.currentTarget.value))} />{feedback}</div>;
  }

  const inputType = spec.key === 'email' ? 'email' : spec.key.toLowerCase().includes('url') || spec.key === 'url' ? 'url' : 'text';
  return <div className="grid max-w-4xl gap-1.5"><label className="text-sm font-medium text-zinc-700" htmlFor={inputId}>{spec.label}</label><input {...accessibilityProps} className={controlClass} type={inputType} value={typeof value === 'string' ? value : ''} onChange={(event) => onChange(event.currentTarget.value)} />{feedback}</div>;
}
