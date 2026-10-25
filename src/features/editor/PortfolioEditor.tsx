import { Fragment, useState, type ReactNode } from 'react';
import initialContent from '../../content/content.json';
import type { PortfolioContent, SectionId } from '../../types/content';
import { migrateContent, validateContent } from '../../utils/contentValidation';
import { ContactSection } from './components/contact/ContactSection';
import { ContentJsonActions } from './components/ContentJsonActions';
import { ExperiencesSection } from './components/experiences/ExperiencesSection';
import { FooterSection } from './components/footer/FooterSection';
import { HeaderSection } from './components/header/HeaderSection';
import { HeroSection } from './components/hero/HeroSection';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { SectionOrderList } from './components/SectionOrderList';
import { ServicesSection } from './components/services/ServicesSection';
import { SkillsSection } from './components/skills/SkillsSection';
import { TestimonialsSection } from './components/testimonials/TestimonialsSection';

type DashboardIconName = 'overview' | 'sections' | 'header' | 'hero' | 'projects' | 'skills' | 'experiences' | 'services' | 'testimonials' | 'contact' | 'footer';

const iconPaths: Record<DashboardIconName, string> = {
  overview: 'M3 3h7v7H3z M14 3h7v5h-7z M14 12h7v9h-7z M3 14h7v7H3z',
  sections: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  header: 'M4 5h16v14H4z M4 9h16 M8 5v4',
  hero: 'M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z',
  projects: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  skills: 'M12 3l9 9-9 9-9-9 9-9z M12 8v8 M8 12h8',
  experiences: 'M12 8v4l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  services: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z',
  testimonials: 'M7 17.5c-2.2 0-4-1.7-4-3.8V8.5c0-2.2 1.8-4 4-4h4v8H7v5z M17 17.5c-2.2 0-4-1.7-4-3.8V8.5c0-2.2 1.8-4 4-4h4v8h-4v5z',
  contact: 'M4 5h16v14H4z M4 7l8 6 8-6 M8 16h3',
  footer: 'M4 6h16 M4 12h16 M4 18h10',
};

const sectionInfo: Record<SectionId, { label: string; icon: DashboardIconName }> = {
  header: { label: 'Header', icon: 'header' },
  hero: { label: 'Hero', icon: 'hero' },
  projects: { label: 'Projects', icon: 'projects' },
  skills: { label: 'Skills', icon: 'skills' },
  experiences: { label: 'Experiences', icon: 'experiences' },
  services: { label: 'Services', icon: 'services' },
  testimonials: { label: 'Testimonials', icon: 'testimonials' },
  contact: { label: 'Socials & Contacts', icon: 'contact' },
  footer: { label: 'Footer', icon: 'footer' },
};

function DashboardIcon({ name, className = 'size-4' }: { name: DashboardIconName; className?: string }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={iconPaths[name]} /></svg>;
}

export default function PortfolioEditor() {
  const [validationError, setValidationError] = useState('');
  const [content, setContent] = useState<PortfolioContent>(() => structuredClone(migrateContent(initialContent) as PortfolioContent));

  function update<K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  function replaceContent(next: PortfolioContent) {
    const normalized = migrateContent(next) as PortfolioContent;
    const result = validateContent(normalized);
    if (!result.valid) {
      setValidationError(result.errors.join(' '));
      return;
    }
    setValidationError('');
    setContent(normalized);
  }

  const sectionById = Object.fromEntries(content.sections.map(({ id, enabled }) => [id, enabled])) as Record<SectionId, boolean>;
  const visibleSections = content.sections.filter(({ enabled }) => enabled);
  const itemCount = content.projects.length + content.skills.length + content.experiences.length + content.services.length + content.testimonials.length;

  const sectionEditors: Record<SectionId, ReactNode> = {
    header: <HeaderSection value={content.header} onChange={(header) => update('header', header)} />,
    hero: <HeroSection value={content.hero} onChange={(hero) => update('hero', hero)} />,
    projects: <ProjectsSection items={content.projects} onChange={(projects) => update('projects', projects)} />,
    skills: <SkillsSection items={content.skills} onChange={(skills) => update('skills', skills)} />,
    experiences: <ExperiencesSection items={content.experiences} onChange={(experiences) => update('experiences', experiences)} />,
    services: <ServicesSection items={content.services} onChange={(services) => update('services', services)} />,
    testimonials: <TestimonialsSection items={content.testimonials} onChange={(testimonials) => update('testimonials', testimonials)} />,
    contact: <ContactSection contacts={content.contacts} socials={content.socials} onContactsChange={(contacts) => update('contacts', contacts)} onSocialsChange={(socials) => update('socials', socials)} />,
    footer: <FooterSection value={content.footer} onChange={(footer) => update('footer', footer)} />,
  };

  return <main className="grid min-h-screen w-full min-w-0 max-w-full grid-cols-1 items-start gap-0 bg-white font-sans text-zinc-950 md:grid-cols-[15rem_minmax(0,1fr)]">
    <aside className="flex flex-col gap-3 border-b border-zinc-200 bg-white p-3 md:sticky md:top-0 md:h-screen md:gap-5 md:border-b-0 md:border-r md:px-3 md:py-5"><a className="flex items-center gap-3 px-2 py-1 text-zinc-950 no-underline" href="/editor"><span className="grid size-9 place-items-center rounded-lg bg-zinc-950 text-sm font-bold text-white">PC</span><span className="grid"><strong className="text-sm font-semibold">Portfolio CMS</strong><small className="text-xs text-zinc-500">Content workspace</small></span></a><div className="mt-2 hidden px-3 text-xs font-medium text-zinc-500 md:block">Workspace</div><nav className="flex gap-1 overflow-x-auto md:grid md:overflow-visible" aria-label="Editor navigation"><a className="flex shrink-0 items-center gap-3 rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-950 no-underline" href="#editor-overview"><DashboardIcon name="overview" className="size-4 text-zinc-600" />Overview</a><a className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-950" href="#editor-sections"><DashboardIcon name="sections" className="size-4 text-zinc-500" />Sections</a><div className="mb-1 mt-5 hidden px-3 text-xs font-medium text-zinc-500 md:block">Manage content</div>{visibleSections.map(({ id: sectionId }) => <a className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-zinc-400" key={sectionId} href={`#editor-${sectionId}`}><DashboardIcon name={sectionInfo[sectionId].icon} className="size-4 text-zinc-500" />{sectionInfo[sectionId].label}</a>)}</nav><div className="mt-auto hidden rounded-lg border border-zinc-200 bg-zinc-50 p-3 md:block"><div className="flex items-center gap-2 text-xs font-medium text-zinc-700"><span className="size-2 rounded-full bg-emerald-500" />Development mode</div><p className="mb-0 mt-2 text-xs leading-5 text-zinc-500">Changes save to your local project files.</p><a className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-zinc-700 underline-offset-4 hover:underline" href="/">Open portfolio <span aria-hidden="true">↗</span></a></div></aside>
    <div className="mx-auto grid min-h-screen min-w-0 w-full max-w-7xl content-start gap-6 bg-zinc-50 px-4 py-5 sm:px-6 lg:px-10 lg:py-8"><header className="sticky top-0 z-10 -mx-4 flex min-w-0 flex-col items-start justify-between gap-4 border-b border-zinc-200 bg-white/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 xl:flex-row xl:items-center lg:-mx-10 lg:px-10"><div><div className="mb-2 flex items-center gap-2 text-sm text-zinc-500"><a className="text-zinc-500 no-underline hover:text-zinc-950" href="#editor-overview">Dashboard</a><span>/</span><span className="font-medium text-zinc-800">Portfolio</span></div><div className="flex flex-wrap items-center gap-3"><h1 className="m-0 text-2xl font-semibold tracking-tight">Portfolio</h1><span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">Development</span></div><p className="mb-0 mt-1 text-sm text-zinc-500">Manage your portfolio content and publish changes to the project.</p></div><ContentJsonActions content={content} onImport={replaceContent} onSaved={() => setValidationError('')} /></header>
      {validationError && <p className="m-0 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">{validationError}</p>}
      <div id="editor-overview" className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4"><article className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-xs"><div className="grid gap-1"><span className="text-sm font-medium text-zinc-500">Visible sections</span><strong className="text-3xl font-semibold tracking-tight">{visibleSections.length}<span className="text-base font-medium text-zinc-400"> / {content.sections.length}</span></strong><small className="text-xs text-zinc-500">Active on your portfolio</small></div><span className="grid size-10 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600"><DashboardIcon name="sections" /></span></article><article className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-xs"><div className="grid gap-1"><span className="text-sm font-medium text-zinc-500">Content entries</span><strong className="text-3xl font-semibold tracking-tight">{itemCount}</strong><small className="text-xs text-zinc-500">Projects, skills, and more</small></div><span className="grid size-10 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600"><DashboardIcon name="projects" /></span></article><article className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-xs"><div className="grid gap-1"><span className="text-sm font-medium text-zinc-500">Projects</span><strong className="text-3xl font-semibold tracking-tight">{content.projects.length}</strong><small className="text-xs text-zinc-500">Portfolio case studies</small></div><span className="grid size-10 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600"><DashboardIcon name="projects" /></span></article><article className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-xs"><div className="grid gap-1"><span className="text-sm font-medium text-zinc-500">Data source</span><strong className="text-xl font-semibold tracking-tight">Local JSON</strong><small className="text-xs text-zinc-500">Canonical project content</small></div><span className="grid size-10 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 font-mono text-xs text-zinc-600">{'{}'}</span></article></div>
      <section id="editor-sections" className="grid scroll-mt-4 gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-lg bg-zinc-100 text-zinc-700"><DashboardIcon name="sections" /></span><div><span className="text-[0.68rem] font-bold tracking-widest text-zinc-500">LAYOUT</span><h2 className="m-0 text-lg font-semibold tracking-tight">Sections</h2><p className="mb-0 mt-1 text-sm text-zinc-500">Choose what appears and arrange the page.</p></div></div><SectionOrderList order={content.sections.map(({ id: sectionId }) => sectionId)} enabled={sectionById} onReorder={(order) => update('sections', order.map((sectionId) => ({ id: sectionId, enabled: sectionById[sectionId] })))} onToggle={(sectionId) => update('sections', content.sections.map((section) => section.id === sectionId ? { ...section, enabled: !section.enabled } : section))} /></section>
      {content.sections.map(({ id: sectionId, enabled }) => enabled ? <Fragment key={sectionId}>{sectionEditors[sectionId]}</Fragment> : null)}
      <footer className="flex items-center justify-between gap-4 py-3 text-xs text-zinc-500"><span>Remember to save your changes to update the portfolio.</span><button className="rounded-lg border border-zinc-300 bg-white px-3 py-2 font-semibold hover:bg-zinc-50" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></footer>
    </div>
  </main>;
}
