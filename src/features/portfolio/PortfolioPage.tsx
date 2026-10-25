import contentJson from '../../content/content.json';

import type { PortfolioContent, SectionId } from '../../types/content';
import { migrateContent, validateContent } from '../../utils/contentValidation';
import { PortfolioRenderer } from './PortfolioRenderer';

const initialContent = migrateContent(contentJson) as PortfolioContent;

export function PortfolioPage() {
  const validation = validateContent(initialContent);
  if (!validation.valid) return <main><h1>Portfolio content could not be loaded</h1><ul>{validation.errors.map((error) => <li key={error}>{error}</li>)}</ul></main>;
  return <PortfolioRenderer content={initialContent} />;
}

export const sectionLabels: Record<SectionId, string> = {
  header: 'Header', hero: 'Hero', projects: 'Projects', skills: 'Skills', experiences: 'Experiences',
  services: 'Services', testimonials: 'Testimonials', contact: 'Socials & Contacts', footer: 'Footer',
};
