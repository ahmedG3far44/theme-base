export const sectionCardClass = 'grid scroll-mt-4 gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5';

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div><span className="text-[0.68rem] font-bold tracking-widest text-zinc-500">{eyebrow}</span><h2 className="m-0 text-lg font-semibold tracking-tight">{title}</h2>{description && <p className="mb-0 mt-1 text-sm text-zinc-500">{description}</p>}</div>;
}
