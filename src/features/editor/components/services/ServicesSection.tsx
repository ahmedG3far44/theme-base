import type { Service } from '../../../../types/content';
import { CollectionEditor, createEditorId } from '../CollectionEditor';
import { imageField, listField, longField, textField } from '../EditorField';

export function ServicesSection({ items, onChange }: { items: Service[]; onChange: (items: Service[]) => void }) {
  const fields = [{ ...textField('title', 'Title'), required: true }, { ...longField('description', 'Description'), required: true }, imageField('image', 'Icon or image', 'services'), listField('features', 'Features / deliverables')];

  return <div id="editor-services" className="scroll-mt-4"><CollectionEditor<Service> title="Services" items={items} onChange={onChange} create={() => ({ id: createEditorId('service'), title: '', description: '', features: [] })} fields={fields} /></div>;
}
