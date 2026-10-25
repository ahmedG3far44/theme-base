import type { PortfolioContent, SocialLink } from '../../../../types/content';
import { CollectionEditor, createEditorId, NavigationEditor } from '../CollectionEditor';
import { EditorField, imageField, longField, textField } from '../EditorField';
import { SectionHeading, sectionCardClass } from '../SectionCard';

const socialFields = [textField('platform', 'Platform'), textField('label', 'Display label'), textField('url', 'URL'), imageField('image', 'Icon or image', 'services')];

export function FooterSection({ value, onChange }: { value: PortfolioContent['footer']; onChange: (value: PortfolioContent['footer']) => void }) {
  return <section id="editor-footer" className={sectionCardClass}><SectionHeading eyebrow="SITE CLOSE" title="Footer" /><EditorField spec={longField('text', 'Footer text')} value={value.text} onChange={(text) => onChange({ ...value, text: String(text) })} /><EditorField spec={textField('copyright', 'Copyright notice')} value={value.copyright} onChange={(copyright) => onChange({ ...value, copyright: String(copyright) })} /><NavigationEditor title="Footer navigation" items={value.navigation} onChange={(navigation) => onChange({ ...value, navigation })} /><CollectionEditor<SocialLink> title="Footer socials" items={value.socials} onChange={(socials) => onChange({ ...value, socials })} create={() => ({ id: createEditorId('footer-social'), platform: '', label: '', url: '' })} fields={socialFields} /><EditorField spec={textField('contactText', 'Additional contact text')} value={value.contactText} onChange={(contactText) => onChange({ ...value, contactText: String(contactText) })} /></section>;
}
