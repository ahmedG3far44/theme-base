import type { Project } from '../../../../types/content';
import { CollectionEditor, createEditorId } from '../CollectionEditor';
import { imageField, listField, longField, textField } from '../EditorField';

export function ProjectsSection({ items, onChange }: { items: Project[]; onChange: (items: Project[]) => void }) {
  return <div id="editor-projects" className="scroll-mt-4"><CollectionEditor<Project> title="Projects" items={items} onChange={onChange} create={() => ({ id: createEditorId('project'), title: '', description: '', tags: [], media: [] })} withMedia fields={[{ ...textField('title', 'Title'), required: true }, { ...longField('description', 'Description'), required: true }, listField('tags', 'Tags (one per line)'), imageField('thumbnail', 'Thumbnail', 'projects'), textField('projectUrl', 'Project URL'), textField('sourceUrl', 'Source code URL'), longField('metadata', 'Metadata')]} /></div>;
}
