import type { PortfolioContent } from '../../../../types/content';
import { ActionFields } from '../CollectionEditor';
import { EditorField, fieldError, imageField, longField, textField } from '../EditorField';
import { SectionHeading, sectionCardClass } from '../SectionCard';

const heroKeys = ['name', 'title', 'heading', 'description', 'extraText'] as const;

export function HeroSection({ value, onChange }: { value: PortfolioContent['hero']; onChange: (value: PortfolioContent['hero']) => void }) {
  return <section id="editor-hero" className={sectionCardClass}><SectionHeading eyebrow="INTRODUCTION" title="Hero" />{heroKeys.map((key) => {
    const label = key === 'extraText' ? 'Additional text' : key[0].toUpperCase() + key.slice(1);
    const spec = key === 'description' || key === 'extraText' ? longField(key, label) : textField(key, label);
    const required = key !== 'extraText';
    const requiredSpec = { ...spec, required };

    return <EditorField key={key} spec={requiredSpec} value={value[key]} error={fieldError(requiredSpec, value[key])} onChange={(next) => onChange({ ...value, [key]: next } as PortfolioContent['hero'])} />;
  })}<EditorField spec={imageField('profileImage', 'Profile image', 'profile')} value={value.profileImage} onChange={(profileImage) => onChange({ ...value, profileImage: profileImage as string | undefined })} /><ActionFields title="Primary call to action" value={value.primaryAction} onChange={(primaryAction) => onChange({ ...value, primaryAction })} /><ActionFields title="Secondary call to action" value={value.secondaryAction} onChange={(secondaryAction) => onChange({ ...value, secondaryAction })} /></section>;
}
