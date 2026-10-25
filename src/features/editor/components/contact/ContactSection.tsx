import type { PortfolioContent, SocialLink } from '../../../../types/content';
import { ActionFields, CollectionEditor, createEditorId } from '../CollectionEditor';
import { EditorField, imageField, longField, textField } from '../EditorField';
import { SectionHeading, sectionCardClass } from '../SectionCard';

const socialFields = [textField('platform', 'Platform'), { ...textField('label', 'Display label'), required: true }, { ...textField('url', 'URL'), required: true }, imageField('image', 'Icon or image', 'services')];

export function ContactSection({ contacts, socials, onContactsChange, onSocialsChange }: {
  contacts: PortfolioContent['contacts'];
  socials: SocialLink[];
  onContactsChange: (contacts: PortfolioContent['contacts']) => void;
  onSocialsChange: (socials: SocialLink[]) => void;
}) {
  return <section id="editor-contact" className={sectionCardClass}><SectionHeading eyebrow="GET IN TOUCH" title="Socials & Contacts" /><div className="grid gap-3 rounded-lg bg-zinc-50 p-4"><h3 className="m-0 text-sm font-bold">Contact details</h3>{(['email', 'phone', 'location'] as const).map((key) => <EditorField key={key} spec={textField(key, key[0].toUpperCase() + key.slice(1))} value={contacts[key]} onChange={(value) => onContactsChange({ ...contacts, [key]: String(value) })} />)}<ActionFields title="Contact call to action" value={contacts.action} onChange={(action) => onContactsChange({ ...contacts, action })} /><EditorField spec={longField('additionalInfo', 'Additional contact information')} value={contacts.additionalInfo} onChange={(additionalInfo) => onContactsChange({ ...contacts, additionalInfo: String(additionalInfo) })} /></div><CollectionEditor<SocialLink> title="Social links" items={socials} onChange={onSocialsChange} create={() => ({ id: createEditorId('social'), platform: '', label: '', url: '' })} fields={socialFields} /></section>;
}
