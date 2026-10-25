import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SectionId } from '../../../types/content';
import { sectionLabels } from '../../portfolio/PortfolioPage';

function Row({ id, enabled, onToggle }: { id: SectionId; enabled: boolean; onToggle: (id: SectionId) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return <li className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white p-2" ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}><button className="inline-flex size-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900" type="button" aria-label={`Drag ${sectionLabels[id]}`} {...attributes} {...listeners}><svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01" /></svg></button><label className="flex items-center gap-2 text-sm font-medium text-zinc-700"><input className="size-4 accent-zinc-900" type="checkbox" checked={enabled} onChange={() => onToggle(id)} /> {sectionLabels[id]}</label></li>;
}
export function SectionOrderList({ order, enabled, onReorder, onToggle }: { order: SectionId[]; enabled: Record<SectionId, boolean>; onReorder: (order: SectionId[]) => void; onToggle: (id: SectionId) => void }) {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  function dragEnd(event: DragEndEvent) { const { active, over } = event; if (over && active.id !== over.id) onReorder(arrayMove(order, order.indexOf(active.id as SectionId), order.indexOf(over.id as SectionId))); }
  return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}><SortableContext items={order} strategy={verticalListSortingStrategy}><ol className="grid list-decimal gap-2 pl-5">{order.map((id) => <Row key={id} id={id} enabled={enabled[id]} onToggle={onToggle} />)}</ol></SortableContext></DndContext>;
}
