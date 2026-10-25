import type { Experience } from '../../../../types/content';
import { CollectionEditor, createEditorId } from '../CollectionEditor';
import { imageField, listField, longField, textField } from '../EditorField';

export function ExperiencesSection({ items, onChange }: { items: Experience[]; onChange: (items: Experience[]) => void }) {
  const fields = [{ ...textField('title', 'Job title'), required: true }, { ...textField('company', 'Company'), required: true }, textField('employmentType', 'Employment type'), textField('startDate', 'Start date'), textField('endDate', 'End date'), { key: 'current', label: 'Currently employed', kind: 'boolean' as const }, { ...longField('description', 'Description'), required: true }, listField('achievements', 'Responsibilities / achievements'), imageField('logo', 'Company logo', 'experiences'), textField('companyUrl', 'Company URL')];

  return <div id="editor-experiences" className="scroll-mt-4"><CollectionEditor<Experience> title="Experiences" items={items} onChange={onChange} create={() => ({ id: createEditorId('experience'), title: '', company: '', current: false, description: '', achievements: [] })} fields={fields} /></div>;
}
