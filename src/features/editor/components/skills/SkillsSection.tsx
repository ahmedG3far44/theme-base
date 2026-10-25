import type { Skill } from '../../../../types/content';
import { CollectionEditor, createEditorId } from '../CollectionEditor';
import { imageField, longField, textField } from '../EditorField';

export function SkillsSection({ items, onChange }: { items: Skill[]; onChange: (items: Skill[]) => void }) {
  const fields = [{ ...textField('name', 'Name'), required: true }, longField('description', 'Description'), imageField('image', 'Skill logo', 'skills'), { key: 'proficiency', label: 'Proficiency (0–100)', kind: 'number' as const }, textField('category', 'Category')];

  return <div id="editor-skills" className="scroll-mt-4"><CollectionEditor<Skill> title="Skills" items={items} onChange={onChange} create={() => ({ id: createEditorId('skill'), name: '' })} fields={fields} /></div>;
}
