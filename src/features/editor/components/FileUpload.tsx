import { useState } from 'react';
import type { MediaType } from '../../../types/content';

const accepts: Record<MediaType, string> = {
  image: '.png,.jpg,.jpeg,image/png,image/jpeg',
  gif: '.gif,image/gif',
  video: '.mp4,.webm,video/mp4,video/webm',
};
const extensions: Record<MediaType, string[]> = { image: ['png', 'jpg', 'jpeg'], gif: ['gif'], video: ['mp4', 'webm'] };
const mimeTypes: Record<MediaType, string[]> = { image: ['image/png', 'image/jpeg'], gif: ['image/gif'], video: ['video/mp4', 'video/webm'] };
const uploadDirectories = ['profile', 'projects', 'skills', 'experiences', 'testimonials', 'services'] as const;
export type UploadDirectory = typeof uploadDirectories[number];

export function FileUpload({ label, value, type, directory, onChange }: { label: string; value?: string; type: MediaType; directory: UploadDirectory; onChange: (value: string | undefined) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');
  async function choose(file?: File) {
    setError('');
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !extensions[type].includes(extension) || (file.type && !mimeTypes[type].includes(file.type))) {
      setError(`Unsupported file. Select ${extensions[type].map((item) => `.${item}`).join(', ')} ${type === 'video' ? 'video' : 'image'} files.`);
      return;
    }
    if (file.size > 50 * 1024 * 1024) { setError('Files must be 50 MB or smaller.'); return; }
    setBusy(true);
    try {
      const body = new FormData(); body.set('file', file); body.set('directory', directory); body.set('type', type);
      const response = await fetch('/__cms/upload', { method: 'POST', body });
      const result = await response.json() as { url?: string; filename?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || 'Upload failed.');
      setFilename(result.filename || file.name); onChange(result.url);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Upload failed.'); }
    finally { setBusy(false); }
  }
  return <div className="grid max-w-4xl gap-2"><label className="grid gap-1.5 text-sm font-medium text-zinc-700">{label}<input className="w-full rounded-md border border-zinc-300 bg-white p-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:font-medium" type="file" accept={accepts[type]} disabled={busy} onChange={(event) => void choose(event.currentTarget.files?.[0])} /></label>
    {busy && <p className="m-0 text-sm text-zinc-700" role="status">Uploading…</p>}{error && <p className="m-0 rounded bg-red-50 p-2 text-sm text-red-800" role="alert">{error}</p>}
    {value && <div className="grid justify-items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3"><p className="m-0 break-all text-xs text-zinc-600">{filename || value.split('/').pop()}</p>{type === 'video' ? <video className="max-h-72 max-w-full rounded-lg" src={value} controls aria-label={`${label} preview`} onError={() => setError('The selected video could not be previewed.')} /> : <img className="max-h-72 max-w-full rounded-lg object-contain" src={value} alt={`${label} preview`} onError={() => setError('The selected image could not be previewed.')} />}<button className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" type="button" aria-label={`Remove ${label}`} onClick={() => { onChange(undefined); setFilename(''); setError(''); }}>Remove file</button></div>}
  </div>;
}
