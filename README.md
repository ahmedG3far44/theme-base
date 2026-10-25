# Portfolio CMS

Local, frontend-only portfolio with a development CMS. The canonical content is `src/content/content.json`; uploaded assets live under `public/images/` and should be committed with the content file.

## Start

Run `npm install`, then `npm run dev`. Open the Vite URL for the public portfolio and `/editor` for the development editor. Vite binds to `127.0.0.1` so the development file operations are local-only.

## Edit, save, and export

In `/editor`, edit singleton content and use each collection's Add, edit, delete, and Move up/Move down controls. The editor styles use Tailwind utilities. Social links and contact details share one `contact` section and one visibility toggle; older `socials` and `contacts` section entries are migrated into it when content loads. Drag the section list to change section order and use its checkboxes to hide or show sections. Upload fields immediately write files into the matching `public/images/<category>/` folder and add the returned public URL to the content model.

Use **Save to project** to validate and write `src/content/content.json`; Vite reloads the updated content. **Export Content JSON** downloads a Unicode-preserving `content.json` backup. **Import Content JSON** validates a selected file before loading it into the editor; save it to persist it.

The editor is intended for local development and source-controlled portfolio content. It does not edit a deployed static website. The Vite middleware is development-only and exposes only the scoped content-save and asset-upload operations.

## Production

Run `npm run build`. The editor module is conditionally imported only in development; the production `/editor` route redirects to `/`. The public portfolio remains a static application driven by the JSON file.
