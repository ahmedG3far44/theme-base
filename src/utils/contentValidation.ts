import type { SectionId } from '../types/content';

export const SECTION_IDS: SectionId[] = ['header', 'hero', 'projects', 'skills', 'experiences', 'services', 'testimonials', 'contact', 'footer'];
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === 'string';
const isUniqueIds = (items: unknown): boolean => Array.isArray(items) && items.every((item) => isRecord(item) && isString(item.id) && Boolean(item.id.trim())) && new Set(items.map((item) => (item as { id: string }).id)).size === items.length;
const optionalString = (value: unknown) => value === undefined || isString(value);
const optionalMedia = (value: unknown) => value === undefined || safeMediaUrl(value);
const optionalUrl = (value: unknown) => value === undefined || (isString(value) && Boolean(safeUrl(value)));
const validAction = (value: unknown) => value === undefined || (isRecord(value) && isString(value.label) && isString(value.url) && Boolean(safeUrl(value.url)));
const validNavigation = (value: unknown) => isUniqueIds(value) && (value as Record<string, unknown>[]).every((item) => isString(item.label) && isString(item.url) && Boolean(safeUrl(item.url)));
const validSocial = (item: Record<string, unknown>) => isString(item.platform) && isString(item.label) && isString(item.url) && Boolean(safeUrl(item.url)) && optionalMedia(item.image);
const validMedia = (item: unknown) => isRecord(item) && ['image', 'gif', 'video'].includes(String(item.type)) && safeMediaUrl(item.url) && optionalString(item.alt);
const noTemporaryPaths = (value: unknown): boolean => {
  if (typeof value === 'string') return !/^(blob:|data:)|^[a-z]:[\\/]/i.test(value);
  if (Array.isArray(value)) return value.every(noTemporaryPaths);
  if (isRecord(value)) return Object.values(value).every(noTemporaryPaths);
  return true;
};

export function migrateContent(value: unknown): unknown {
  if (!isRecord(value)) return value;
  const migrated: Record<string, unknown> = { ...value };
  if (Array.isArray(value.sections)) {
    const sections: unknown[] = [];
    let contactIndex = -1;
    for (const section of value.sections) {
      if (isRecord(section) && ['socials', 'contacts', 'contact'].includes(String(section.id))) {
        if (contactIndex === -1) {
          contactIndex = sections.length;
          sections.push({ id: 'contact', enabled: section.enabled === true });
        } else if (section.enabled === true) {
          const current = sections[contactIndex];
          if (isRecord(current)) sections[contactIndex] = { ...current, enabled: true };
        }
      } else sections.push(section);
    }
    migrated.sections = sections;
  }
  const updateLegacyAnchors = (current: unknown): unknown => {
    if (Array.isArray(current)) return current.map(updateLegacyAnchors);
    if (!isRecord(current)) return current;
    return Object.fromEntries(Object.entries(current).map(([key, child]) => [key, key === 'url' && (child === '#socials' || child === '#contacts') ? '#contact' : updateLegacyAnchors(child)]));
  };
  return updateLegacyAnchors(migrated);
}

export function validateContent(value: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!isRecord(value)) return { valid: false, errors: ['Content must be a JSON object.'] };
  if (typeof value.version !== 'number') errors.push('version must be a number.');
  if (!noTemporaryPaths(value)) errors.push('Content cannot contain temporary blob URLs, Base64 data, or local filesystem paths.');
  const sections = value.sections;
  if (!Array.isArray(sections) || sections.length !== SECTION_IDS.length) errors.push('sections must contain each supported section exactly once.');
  else {
    const ids = sections.map((section) => isRecord(section) ? section.id : undefined);
    if (ids.some((id) => !SECTION_IDS.includes(id as SectionId)) || new Set(ids).size !== SECTION_IDS.length || ids.length !== SECTION_IDS.length) errors.push('sections contains an unknown, missing, or duplicate section ID.');
    sections.forEach((section) => { if (!isRecord(section) || typeof section.enabled !== 'boolean') errors.push('Every section needs an enabled boolean.'); });
  }
  for (const key of ['header', 'hero', 'contacts', 'footer']) if (!isRecord(value[key])) errors.push(`${key} must be an object.`);
  for (const key of ['projects', 'skills', 'experiences', 'services', 'testimonials', 'socials']) {
    if (!isUniqueIds(value[key])) errors.push(`${key} must be an array with unique, non-empty IDs.`);
  }
  const header = value.header;
  if (isRecord(header) && (!isString(header.logoText) || !validNavigation(header.navigation) || !optionalMedia(header.logoImage) || !validAction(header.action))) errors.push('header has invalid logo, navigation, or call-to-action values.');
  const hero = value.hero;
  if (isRecord(hero) && (['name', 'title', 'heading', 'description'].some((key) => !isString(hero[key])) || !optionalMedia(hero.profileImage) || !validAction(hero.primaryAction) || !validAction(hero.secondaryAction) || !optionalString(hero.extraText))) errors.push('hero has missing or invalid required text, media, or action values.');
  const contacts = value.contacts;
  if (isRecord(contacts)) {
    if (!['email', 'phone', 'location', 'additionalInfo'].every((key) => optionalString(contacts[key])) || !validAction(contacts.action)) errors.push('contacts contains an invalid value.');
    if (contacts.email && (!isString(contacts.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacts.email))) errors.push('contacts.email must be a valid email address.');
  }
  const footer = value.footer;
  if (isRecord(footer) && (!['text', 'copyright', 'contactText'].every((key) => optionalString(footer[key])) || !validNavigation(footer.navigation) || !isUniqueIds(footer.socials) || !(footer.socials as Record<string, unknown>[]).every(validSocial))) errors.push('footer contains an invalid value, navigation item, or social link.');
  const projects = value.projects as Record<string, unknown>[];
  if (Array.isArray(projects) && projects.some((item) => !isString(item.title) || !isString(item.description) || !Array.isArray(item.tags) || !item.tags.every(isString) || !Array.isArray(item.media) || !item.media.every(validMedia) || !optionalMedia(item.thumbnail) || !optionalUrl(item.projectUrl) || !optionalUrl(item.sourceUrl) || !optionalString(item.metadata))) errors.push('projects contains an invalid project, URL, or media item.');
  const skills = value.skills as Record<string, unknown>[];
  if (Array.isArray(skills) && skills.some((item) => !isString(item.name) || !optionalString(item.description) || !optionalMedia(item.image) || !optionalString(item.category) || (item.proficiency !== undefined && (typeof item.proficiency !== 'number' || item.proficiency < 0 || item.proficiency > 100)))) errors.push('skills contains an invalid skill.');
  const experiences = value.experiences as Record<string, unknown>[];
  if (Array.isArray(experiences) && experiences.some((item) => !['title', 'company', 'description'].every((key) => isString(item[key])) || typeof item.current !== 'boolean' || !Array.isArray(item.achievements) || !item.achievements.every(isString) || !['employmentType', 'startDate', 'endDate'].every((key) => optionalString(item[key])) || !optionalMedia(item.logo) || !optionalUrl(item.companyUrl))) errors.push('experiences contains an invalid experience.');
  const services = value.services as Record<string, unknown>[];
  if (Array.isArray(services) && services.some((item) => !isString(item.title) || !isString(item.description) || !optionalMedia(item.image) || !Array.isArray(item.features) || !item.features.every(isString))) errors.push('services contains an invalid service.');
  const testimonials = value.testimonials as Record<string, unknown>[];
  if (Array.isArray(testimonials) && testimonials.some((item) => !isString(item.clientName) || !isString(item.text) || !['clientRole', 'company'].every((key) => optionalString(item[key])) || !optionalMedia(item.clientImage) || !optionalMedia(item.companyLogo))) errors.push('testimonials contains an invalid testimonial.');
  const socials = value.socials as Record<string, unknown>[];
  if (Array.isArray(socials) && socials.some((item) => !validSocial(item))) errors.push('socials contains an invalid social link or URL.');
  if (errors.length) return { valid: false, errors };
  return { valid: true, errors: [] };
}

export function safeUrl(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  if ((value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:')) return value;
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? value : undefined; } catch { return undefined; }
}

export function safeMediaUrl(value: unknown): value is string {
  return isString(value) && value.startsWith('/images/') && !value.includes('..') && !value.startsWith('//');
}
