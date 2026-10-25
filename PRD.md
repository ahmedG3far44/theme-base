# Task: Build a Data-Driven Portfolio CMS with React 19

## 1. Project Objective

Build a functional, lightweight portfolio website with an integrated content management system (CMS).

The application must allow a developer to manage all portfolio content from a dedicated editor page during development, while the main portfolio page renders all content dynamically from a single `content.json` file.

**The priority is functionality, data architecture, and content management logic — not visual design.**

Do not create a designed UI. Do not add colors, font styling, typography systems, shadows, gradients, borders for decoration, animations, or a theme. Use only basic HTML elements and minimal spacing and padding where necessary.

## 2. Required Technology Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router for routing
- A drag-and-drop library compatible with React 19, such as `@dnd-kit/sortable`, for section reordering
- A suitable file-upload library or native file inputs
- JSON as the source of truth for portfolio content

Use strict TypeScript settings. Keep the implementation modular, maintainable, and type-safe.

Do not introduce a backend, database, authentication system, API server, or session management. This is a local, frontend-only CMS.

## 3. Required Routes

### `/` — Public Portfolio

This route must render the portfolio homepage using the data loaded from `content.json`.

Requirements:

- Render all enabled portfolio sections dynamically.
- Render sections in the order specified by the content configuration.
- Read all section content from the JSON data.
- Reflect changes made to the JSON and the corresponding application data.
- Never hardcode portfolio content directly into the section components.
- Do not render the editor or expose editor controls on this page.

### `/editor` — Development-Only CMS

This route must be available only when running the development environment.

Requirements:

- Allow access when `import.meta.env.DEV === true`.
- When running a production build, `/editor` must not render the editor or any editor-related UI.
- Render a simple unavailable/not-found state or redirect to `/` when the route is accessed in production.
- Prefer excluding editor modules from the production bundle using conditional imports and a development-only entry point where practical.
- Ensure the production build cannot accidentally expose the CMS interface through another route.

Example routing behavior:

```tsx
<Route path="/" element={<PortfolioPage />} />

{import.meta.env.DEV && (
  <Route
    path="/editor"
    element={<PortfolioEditor />}
  />
)}
```

Adapt the implementation to the existing routing architecture. Verify the production behavior rather than relying only on this conditional route.

**Important limitation:** Because this is a static frontend application, development-only routing is not a security boundary for private data. The requirement is to exclude the editor from the production application, not to protect sensitive server-side operations.

## 4. Portfolio Sections

The CMS must manage all the following sections.

### A. Hero

Allow editing:

- Main heading
- Subtitle or description
- Name or professional title
- Profile image
- Primary call-to-action text and URL
- Secondary call-to-action text and URL
- Optional additional text or metadata

The exact fields should be represented in the TypeScript schema and JSON configuration.

### B. Header

Allow editing:

- Logo text or logo image
- Navigation items
- Navigation labels and target section IDs or URLs
- Optional call-to-action
- Other header content

### C. Projects

Allow users to create, edit, delete, and reorder projects.

Each project should support:

- Unique ID
- Project title
- Description
- Category or tags
- Thumbnail image
- GIF preview
- MP4 or WebM video preview
- Additional project images
- Optional project URL
- Optional source code URL
- Optional project metadata

Support multiple media items for each project where appropriate.

For example:

```json
{
  "id": "project-1",
  "title": "Portfolio Platform",
  "description": "A portfolio platform built with React.",
  "tags": ["React", "TypeScript"],
  "thumbnail": "/images/projects/portfolio-thumbnail.png",
  "media": [
    {
      "type": "image",
      "url": "/images/projects/portfolio-detail.png"
    },
    {
      "type": "gif",
      "url": "/images/projects/portfolio-preview.gif"
    },
    {
      "type": "video",
      "url": "/images/projects/portfolio-demo.mp4"
    }
  ],
  "projectUrl": "",
  "sourceUrl": ""
}
```

### D. Skills

Allow users to create, edit, delete, and reorder skills.

Each skill should support:

- Unique ID
- Skill name
- Optional description
- Optional skill logo or image
- Optional proficiency value
- Optional category

Skill logos should be stored in `/public/images/skills/`.

### E. Experiences

Allow users to create, edit, delete, and reorder professional experiences.

Each experience should support:

- Unique ID
- Job title
- Company name
- Employment type
- Start date
- End date
- Current employment status
- Description
- Responsibilities or achievements
- Optional company logo
- Optional company URL

Company logos should be stored in `/public/images/experiences/`.

### F. Services

Allow users to create, edit, delete, and reorder services.

Each service should support:

- Unique ID
- Title
- Description
- Optional icon or image
- Optional features or deliverables

### G. Testimonials

Allow users to create, edit, delete, and reorder testimonials.

Each testimonial should support:

- Unique ID
- Client name
- Client role
- Company name
- Testimonial text
- Optional client image
- Optional company logo

### H. Social Links and Contacts

Allow editing and managing social links and contact information.

Support:

- Platform name
- Display label
- URL
- Optional icon or image
- Email address
- Phone number
- Location
- Contact call-to-action
- Other optional contact information

Validate URLs and email addresses where appropriate.

### I. Footer

Allow editing:

- Footer text
- Copyright notice
- Footer navigation
- Social links
- Contact details
- Optional additional content

All sections must be managed from the same CMS and saved in the same JSON configuration.

## 5. Section Visibility Management

Provide a visibility toggle for every portfolio section.

At minimum, the following sections must be independently configurable:

- Header
- Hero
- Projects
- Skills
- Experiences
- Services
- Testimonials
- Social and contacts
- Footer

Requirements:

1. Each section must have an `enabled` or equivalent boolean property.
2. The editor must allow users to toggle a section on or off.
3. Disabled sections must not render on the homepage.
4. Hiding a section must not delete its content.
5. Re-enabling a section must restore its existing content.
6. Section visibility and section order must persist in the generated JSON configuration.

The header and footer must also respect their visibility settings.

## 6. Drag-and-Drop Section Ordering

Implement drag-and-drop reordering in the editor.

Users must be able to change the order of the main portfolio sections, for example:

1. Hero
2. Projects
3. Skills
4. Experiences
5. Services
6. Testimonials
7. Social and contacts

They must be able to move Projects before Skills, Testimonials after Skills, and arrange the remaining sections in any desired order.

Requirements:

- Provide a draggable list of sections in the editor.
- Update the internal section order immediately after a successful drag operation.
- Persist the new order to the JSON configuration.
- Render the homepage sections according to that order.
- Preserve the content and visibility settings when reordering.
- Ensure the implementation works with keyboard interactions where supported by the drag-and-drop library.

Treat Header and Footer as configurable sections too. They may have fixed positions by default (Header first and Footer last), but their visibility must remain configurable. If the implementation supports arbitrary placement, document how their positions are handled.

Use a stable section ID rather than an array index as the drag-and-drop identifier.

## 7. Local File Upload System

Implement reusable file-upload components for images, GIFs, and videos.

### Supported formats

At minimum, support:

**Images**
- `.png`
- `.jpg`
- `.jpeg`

**Animated images**
- `.gif`

**Videos**
- `.mp4`
- `.webm`

You may support other common video formats if they are compatible with the intended browser playback workflow. Do not promise support for every codec merely because the file extension is accepted.

Validate both file extensions and MIME types where available. Set the appropriate `accept` attribute on file inputs.

Example:

```tsx
<input
  type="file"
  accept=".png,.jpg,.jpeg,.gif,.mp4,.webm,image/png,image/jpeg,image/gif,video/mp4,video/webm"
/>
```

### Upload component behavior

Every upload component must:

1. Open a native local file picker.
2. Validate the selected file's extension, MIME type where available, and permitted media category.
3. Display a preview after the file is selected.
4. Use an image preview for images and GIFs.
5. Use a video preview with native controls for videos.
6. Display the filename and relevant file information.
7. Provide an `X` or remove button to remove the selected file.
8. Allow replacing an existing file.
9. Display a useful error message when the file type is unsupported.
10. Handle loading, failure, and empty states appropriately.

The upload component should support different use cases, including:

- Hero profile images
- Project thumbnails
- Project GIF previews
- Project video previews
- Additional project images
- Skill logos
- Company logos
- Client images
- Other supported portfolio media

Use reusable, typed components instead of implementing separate upload logic for every section.

## 8. Local Storage of Uploaded Assets

All uploaded files should ultimately reside in the project's public assets directory.

Use the following structure:

```text
public/
└── images/
    ├── profile/
    ├── projects/
    ├── skills/
    ├── experiences/
    ├── testimonials/
    └── services/
```

Example resulting paths:

```text
/images/profile/profile-photo.png
/images/projects/project-thumbnail.png
/images/projects/project-preview.gif
/images/projects/project-demo.mp4
/images/projects/project-detail-1.jpg
/images/skills/react-logo.png
/images/experiences/company-logo.png
/images/testimonials/client-photo.jpg
```

Store only public URLs such as `/images/projects/project-thumbnail.png` in `content.json`, never local filesystem paths such as `C:\Users\...`, temporary browser object URLs, or Base64 data.

### Important technical constraint

A normal React application running in the browser cannot write files directly into the project's `/public/images/` directory.

Therefore, implement a solution that respects the no-backend requirement:

- During development, provide an appropriate local file-writing mechanism, such as a Vite development-only middleware or a small Node.js script invoked by the development tooling.
- Keep all filesystem-writing functionality development-only.
- Expose a narrowly scoped upload operation that accepts files only for predefined asset directories.
- Reject path traversal, invalid directory names, unsupported file extensions, and unsafe filenames.
- Generate collision-resistant filenames and prevent accidental overwriting of existing files.
- Return the resulting public URL to the React editor.
- Ensure uploaded assets can be served through Vite immediately.

Do not implement a production server or backend merely to support local uploads.

If a direct filesystem upload is not feasible in the existing environment, use a clearly defined development-only helper or CLI script. Do not silently fall back to storing temporary blob URLs as permanent content.

Document that this CMS is intended for local development and source-controlled portfolio content, not direct editing of a deployed static website.

## 9. JSON Content Architecture

All portfolio content must be stored in one source-of-truth file:

`src/content/content.json`

Use this as the canonical location unless the existing project already has a suitable content directory.

The JSON must include all editable content for:

- Hero
- Header
- Projects
- Skills
- Experiences
- Services
- Testimonials
- Social links
- Contacts
- Footer
- Section visibility
- Section ordering

Create appropriate TypeScript types for the JSON structure.

Example high-level structure:

```json
{
  "version": 1,
  "hero": {
    "name": "Your Name",
    "title": "Full-Stack Developer",
    "description": "I build web applications.",
    "profileImage": "/images/profile/profile-photo.png",
    "primaryAction": {
      "label": "View Projects",
      "url": "#projects"
    }
  },
  "header": {
    "enabled": true,
    "logoText": "Your Name",
    "navigation": []
  },
  "projects": [],
  "skills": [],
  "experiences": [],
  "services": [],
  "testimonials": [],
  "socials": [],
  "contacts": {
    "email": "",
    "phone": "",
    "location": ""
  },
  "footer": {
    "enabled": true,
    "copyright": ""
  },
  "sections": [
    { "id": "hero", "enabled": true },
    { "id": "projects", "enabled": true },
    { "id": "skills", "enabled": true },
    { "id": "experiences", "enabled": true },
    { "id": "services", "enabled": true },
    { "id": "testimonials", "enabled": true },
    { "id": "socials", "enabled": true },
    { "id": "contacts", "enabled": true }
  ]
}
```

This is a starting point, not a requirement to use this exact schema. Adapt it so Header and Footer are also represented consistently, and ensure every field displayed on the portfolio can be managed through the editor.

### Data requirements

- Use stable IDs for repeatable entities.
- Define a clear schema for media references.
- Avoid duplicating section visibility or order across multiple unrelated objects.
- Preserve existing content when adding new fields through future schema migrations.
- Use safe defaults when optional fields are missing.
- Validate content before saving or exporting.
- Do not allow malformed JSON to crash the entire application.

## 10. CMS State and Content Editing

The editor must maintain an editable in-memory content model.

Implement reusable functionality for:

- Updating a single field.
- Adding an item to a collection.
- Editing an existing item.
- Deleting an item.
- Reordering collection items where appropriate.
- Toggling section visibility.
- Reordering portfolio sections.
- Selecting and replacing media.
- Removing media.
- Exporting the complete content configuration.

Use immutable state updates and proper TypeScript types.

Do not use direct DOM manipulation to update portfolio content.

Do not duplicate the same update logic across projects, skills, experiences, and other collections. Use reusable typed helpers or well-defined section-specific forms.

## 11. Exporting `content.json`

Provide a clear **Export Content JSON** action in the editor.

When clicked, it must:

1. Validate the current content.
2. Serialize the entire content configuration to valid, formatted JSON.
3. Include every section's content, visibility, and order.
4. Include all public media URLs.
5. Download the result as `content.json`.
6. Preserve Unicode characters, including Arabic content.
7. Avoid exporting temporary browser object URLs or file-system paths.

The exported file must be usable as the portfolio's content configuration without requiring manual JSON edits.

Also provide an import action if practical, allowing an existing valid `content.json` file to be loaded into the editor. Validate imported JSON before replacing the current editor state.

### Persistence limitation

Exporting a JSON file from a browser does not automatically overwrite the source file in the project. The development-only filesystem integration should therefore support saving the configuration back to `src/content/content.json`, or provide a clearly documented workflow for applying the exported file.

Prefer implementing a development-only save operation that writes the validated JSON to the canonical file. Make the export action available independently so the user can download a portable backup.

Ensure that saving content updates the development homepage without requiring a full application restart.

## 12. Dynamic Portfolio Rendering

Build a data-driven rendering system.

Requirements:

- Load the initial configuration from `content.json`.
- Use reusable section components.
- Render enabled sections in configured order.
- Preserve each section's content and media.
- Support empty collections without errors.
- Handle optional fields gracefully.
- Render image, GIF, and video media using the correct HTML elements.
- Avoid rendering missing or invalid media URLs.
- Use stable React keys for all repeated elements.
- Keep the portfolio independent of the editor implementation.

A recommended structure:

```text
src/
├── app/
│   └── router.tsx
├── components/
│   ├── MediaPreview.tsx
│   └── FileUpload.tsx
├── content/
│   └── content.json
├── features/
│   ├── portfolio/
│   │   ├── PortfolioPage.tsx
│   │   ├── PortfolioRenderer.tsx
│   │   └── sections/
│   │       ├── HeaderSection.tsx
│   │       ├── HeroSection.tsx
│   │       ├── ProjectsSection.tsx
│   │       ├── SkillsSection.tsx
│   │       ├── ExperiencesSection.tsx
│   │       ├── ServicesSection.tsx
│   │       ├── TestimonialsSection.tsx
│   │       ├── SocialsSection.tsx
│   │       ├── ContactsSection.tsx
│   │       └── FooterSection.tsx
│   └── editor/
│       ├── PortfolioEditor.tsx
│       ├── components/
│       │   ├── SectionVisibilityToggle.tsx
│       │   ├── SectionOrderList.tsx
│       │   ├── CollectionEditor.tsx
│       │   └── ContentJsonActions.tsx
│       ├── hooks/
│       └── utils/
├── types/
│   └── content.ts
├── utils/
│   ├── contentValidation.ts
│   └── media.ts
└── main.tsx
```

You may adjust the directory structure if necessary, but maintain a clear separation between portfolio rendering, editor logic, shared types, and filesystem operations.

## 13. Styling Restrictions

This task is not a design exercise.

**Strictly prohibited:**

- Color palettes or custom text colors
- Background color styling
- Custom fonts or typography systems
- Decorative borders
- Shadows
- Gradients
- Animations or transitions
- Decorative icons or illustrations
- Complex card designs
- Marketing-oriented visual effects
- Elaborate responsive layouts

Use default browser styling wherever possible.

Tailwind CSS v4 may be used for functional layout utilities only, including:

- `flex`
- `grid`
- `gap-*`
- `p-*`
- `px-*`
- `py-*`
- `m-*`
- `space-y-*`
- `w-*`
- `max-w-*`
- `items-*`
- `justify-*`
- `overflow-*`

Use only the minimum spacing necessary to make forms, lists, previews, and section controls usable.

The portfolio should display actual content and media without imposing a visual design system.

## 14. Accessibility and Usability

Even without styling, ensure:

- Every input has a label.
- Buttons have clear accessible names.
- Image previews include appropriate alternative text.
- Video previews have native playback controls.
- Drag-and-drop controls support keyboard interaction where practical.
- Validation errors are readable and associated with the relevant fields.
- Delete and remove actions are clearly labeled.
- Empty states are understandable.
- All form controls can be operated using a keyboard.

## 15. Validation and Error Handling

Implement validation for:

- Missing or duplicate entity IDs.
- Invalid section IDs or order entries.
- Invalid visibility values.
- Malformed imported JSON.
- Invalid URLs and email addresses where applicable.
- Unsupported file extensions or MIME types.
- Empty filenames.
- Unsafe upload filenames.
- Invalid upload destinations.
- File upload failures.
- File save failures.
- Missing referenced media.
- Invalid media categories.

Show useful errors instead of silently ignoring failures.

Use a schema validation library such as Zod if appropriate, but do not add unnecessary dependencies.

## 16. Development Workflow

Implement development-only operations for:

- Uploading media into the public assets directory.
- Saving the validated content model to `src/content/content.json`.
- Reading the latest saved content after a page refresh.

The development integration must:

- Bind only to the intended local development server.
- Restrict file operations to explicitly allowed paths.
- Validate incoming payloads and file sizes.
- Avoid arbitrary filesystem reads or writes.
- Avoid exposing filesystem operations in production.
- Return clear success or failure responses.

Do not use `localStorage` as the canonical content source. It may be used for temporary editor drafts if necessary, but the canonical persisted data must remain the JSON file.

## 17. Implementation Process

Follow these steps:

1. Inspect the existing repository and identify its current framework, dependencies, routing, and build setup.
2. Reuse existing project conventions where they do not conflict with this specification.
3. Define the complete TypeScript content schema.
4. Create a valid initial `content.json` with example portfolio content.
5. Implement the dynamic portfolio renderer.
6. Implement section visibility controls.
7. Implement section ordering and drag-and-drop.
8. Implement collection CRUD operations for all repeatable content types.
9. Implement the reusable upload and preview components.
10. Implement the development-only filesystem integration.
11. Implement JSON import, export, and saving.
12. Implement the `/editor` development-only route.
13. Verify that the homepage reflects the saved configuration.
14. Run TypeScript checks, linting if configured, and a production build.
15. Fix all errors and verify the production route behavior.

Do not stop after creating the component structure or mockup. Implement working functionality.

## 18. Acceptance Criteria

The implementation is complete only when all of the following are true:

- [ ] `/` renders a portfolio from `content.json`.
- [ ] `/editor` works in development.
- [ ] `/editor` does not expose the CMS in production.
- [ ] All requested sections can be edited.
- [ ] Projects, skills, experiences, services, testimonials, and social links support CRUD operations.
- [ ] Every section can be enabled or disabled.
- [ ] Reordering sections updates the homepage rendering order.
- [ ] Section order persists in JSON.
- [ ] Images, GIFs, and videos can be selected and previewed.
- [ ] Uploaded media can be removed or replaced.
- [ ] Uploads are written to the correct local public directory.
- [ ] JSON contains the uploaded media's public URL.
- [ ] No temporary blob URLs are saved as permanent references.
- [ ] The complete content can be exported to `content.json`.
- [ ] The content can be saved back to the canonical JSON file during development.
- [ ] Arabic and other Unicode content is preserved.
- [ ] Empty collections and optional fields do not crash rendering.
- [ ] No visual design system has been introduced.
- [ ] TypeScript checks pass.
- [ ] The production build succeeds.
- [ ] Production routing does not expose the editor.

## Final Instruction

Implement the complete portfolio CMS and dynamic portfolio rendering system, not a design mockup.

Focus on clean architecture, predictable state updates, reliable local file management, a single source of truth, type safety, and a working development-to-production workflow.

Keep the interface plain and functional. Use only basic spacing and padding. Do not spend time on styling or branding.

When finished, provide a concise implementation report covering:

1. What was implemented.
2. The key files and architecture.
3. How to start the development server.
4. How to edit content and upload media.
5. How to save and export `content.json`.
6. How production excludes `/editor`.
7. Any remaining limitations or required manual steps.