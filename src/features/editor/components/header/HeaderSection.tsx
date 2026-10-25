import type { PortfolioContent } from '../../../../types/content';
import { ActionFields, NavigationEditor } from '../CollectionEditor';
import { EditorField, fieldError, imageField, textField } from '../EditorField';
import { SectionHeading, sectionCardClass } from '../SectionCard';

export function HeaderSection({ value, onChange }: { value: PortfolioContent['header']; onChange: (value: PortfolioContent['header']) => void }) {
  return <section id="editor-header" className={sectionCardClass}><SectionHeading eyebrow="GLOBAL" title="Header" /><EditorField spec={{ ...textField('logoText', 'Logo text'), required: true }} value={value.logoText} error={fieldError({ key: 'logoText', label: 'Logo text', required: true }, value.logoText)} onChange={(logoText) => onChange({ ...value, logoText: String(logoText) })} /><EditorField spec={imageField('logoImage', 'Logo image', 'profile')} value={value.logoImage} onChange={(logoImage) => onChange({ ...value, logoImage: logoImage as string | undefined })} /><NavigationEditor title="Header navigation" items={value.navigation} onChange={(navigation) => onChange({ ...value, navigation })} /><ActionFields title="Header call to action" value={value.action} onChange={(action) => onChange({ ...value, action })} /></section>;
}
