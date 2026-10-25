import { randomUUID } from 'node:crypto';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import Busboy from 'busboy';
import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { validateContent } from './src/utils/contentValidation';

const destinations = new Set(['profile', 'projects', 'skills', 'experiences', 'testimonials', 'services']);
const mimeByExtension: Record<string, { type: 'image' | 'gif' | 'video'; mime: string }> = {
  png: { type: 'image', mime: 'image/png' }, jpg: { type: 'image', mime: 'image/jpeg' }, jpeg: { type: 'image', mime: 'image/jpeg' },
  gif: { type: 'gif', mime: 'image/gif' }, mp4: { type: 'video', mime: 'video/mp4' }, webm: { type: 'video', mime: 'video/webm' },
};
const json = (response: import('node:http').ServerResponse, status: number, data: unknown) => { response.statusCode = status; response.setHeader('Content-Type', 'application/json; charset=utf-8'); response.end(JSON.stringify(data)); };
function readJson(request: import('node:http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = ''; let size = 0;
    request.setEncoding('utf8');
    request.on('data', (chunk: string) => { size += Buffer.byteLength(chunk); if (size > 5_000_000) { reject(new Error('Content JSON is too large.')); request.destroy(); } else body += chunk; });
    request.on('end', () => { try { resolve(JSON.parse(body)); } catch { reject(new Error('Request body must be valid JSON.')); } });
    request.on('error', reject);
  });
}
function localCmsPlugin(): Plugin {
  let root = process.cwd();
  return {
    name: 'local-portfolio-cms',
    apply: 'serve',
    configResolved(config) { root = config.root; },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url || '/', 'http://127.0.0.1').pathname;
        if (pathname !== '/__cms/save' && pathname !== '/__cms/upload') return next();
        if (server.config.server.host !== '127.0.0.1') return json(response, 403, { error: 'CMS operations are available only on the local development server.' });
        if (request.method !== 'POST') return json(response, 405, { error: 'Use POST for this operation.' });
        try {
          if (pathname === '/__cms/save') {
            const content = await readJson(request);
            const validation = validateContent(content);
            if (!validation.valid) return json(response, 400, { error: validation.errors.join(' ') });
            const projectRoot = path.resolve(root);
            const destination = path.resolve(projectRoot, 'src/content/content.json');
            const relativeDestination = path.relative(projectRoot, destination);
            if (relativeDestination === '..' || relativeDestination.startsWith(`..${path.sep}`) || path.isAbsolute(relativeDestination)) return json(response, 403, { error: 'Invalid content destination.' });
            const temporary = `${destination}.${randomUUID()}.tmp`;
            await writeFile(temporary, `${JSON.stringify(content, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
            await rename(temporary, destination);
            return json(response, 200, { ok: true });
          }
          const contentType = request.headers['content-type'] || '';
          const directory = new URL(request.url || '/', 'http://127.0.0.1').searchParams.get('directory');
          // Browser FormData carries directory and type as fields, which Busboy parses below.
          let uploadDirectory = directory;
          let uploadType = '';
          let fileBuffer: Buffer | undefined;
          let originalName = '';
          let fileMime = '';
          if (!contentType.toLowerCase().startsWith('multipart/form-data')) return json(response, 400, { error: 'Upload must use multipart form data.' });
          await new Promise<void>((resolve, reject) => {
            const parser = Busboy({ headers: request.headers, limits: { fileSize: 50 * 1024 * 1024, files: 1, fields: 2 } });
            parser.on('field', (name, value) => { if (name === 'directory') uploadDirectory = value; if (name === 'type') uploadType = value; });
            parser.on('file', (name, stream, info) => {
              if (name !== 'file') { stream.resume(); return; }
              originalName = info.filename || ''; fileMime = info.mimeType;
              const chunks: Buffer[] = []; let exceeded = false;
              stream.on('limit', () => { exceeded = true; });
              stream.on('data', (chunk: Buffer) => chunks.push(chunk));
              stream.on('end', () => { if (!exceeded) fileBuffer = Buffer.concat(chunks); });
            });
            parser.on('filesLimit', () => reject(new Error('Upload must contain one file.')));
            parser.on('error', reject); parser.on('close', () => resolve()); request.pipe(parser);
          });
          if (!uploadDirectory || !destinations.has(uploadDirectory)) return json(response, 400, { error: 'Invalid upload destination.' });
          const safeDirectory = uploadDirectory;
          if (!originalName || !fileBuffer?.length) return json(response, 400, { error: 'No file was selected, or the file is empty or larger than 50 MB.' });
          const extension = path.extname(path.basename(originalName)).slice(1).toLowerCase();
          const allowed = mimeByExtension[extension];
          if (!allowed || (uploadType && uploadType !== allowed.type)) return json(response, 400, { error: 'File extension does not match an allowed media type.' });
          if (fileMime && fileMime !== allowed.mime && !(extension === 'jpg' && fileMime === 'image/jpeg')) return json(response, 400, { error: 'File MIME type does not match its extension.' });
          const folder = path.resolve(root, 'public/images', safeDirectory);
          if (!folder.startsWith(`${path.resolve(root, 'public/images')}${path.sep}`)) return json(response, 403, { error: 'Invalid upload path.' });
          await mkdir(folder, { recursive: true });
          const filename = `${randomUUID()}.${extension}`;
          const destination = path.resolve(folder, filename);
          if (!destination.startsWith(`${folder}${path.sep}`)) return json(response, 403, { error: 'Invalid upload filename.' });
          await writeFile(destination, fileBuffer, { flag: 'wx' });
          return json(response, 200, { url: `/images/${safeDirectory}/${filename}`, filename: path.basename(originalName) });
        } catch (error) {
          if (response.headersSent) return;
          return json(response, 400, { error: error instanceof Error ? error.message : 'Local CMS operation failed.' });
        }
      });
    },
  };
}

export default defineConfig({ plugins: [react(), tailwindcss(), localCmsPlugin()], server: { host: '127.0.0.1' } });
