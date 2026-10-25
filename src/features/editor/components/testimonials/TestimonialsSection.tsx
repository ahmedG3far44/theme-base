import type { Testimonial } from '../../../../types/content';
import { CollectionEditor, createEditorId } from '../CollectionEditor';
import { imageField, longField, textField } from '../EditorField';

export function TestimonialsSection({ items, onChange }: { items: Testimonial[]; onChange: (items: Testimonial[]) => void }) {
  const fields = [{ ...textField('clientName', 'Client name'), required: true }, textField('clientRole', 'Client role'), textField('company', 'Company'), { ...longField('text', 'Testimonial'), required: true }, imageField('clientImage', 'Client image', 'testimonials'), imageField('companyLogo', 'Company logo', 'testimonials')];

  return <div id="editor-testimonials" className="scroll-mt-4"><CollectionEditor<Testimonial> title="Testimonials" items={items} onChange={onChange} create={() => ({ id: createEditorId('testimonial'), clientName: '', text: '' })} fields={fields} /></div>;
}
