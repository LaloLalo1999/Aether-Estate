import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Client } from '@shared/types';
import { PipelineCard } from './PipelineCard';
import { cn } from '@/lib/utils';
interface PipelineColumnProps {
  status: 'Lead' | 'Active' | 'Inactive';
  clients: Client[];
}
const statusConfig = {
  Lead: { title: 'Leads', color: 'bg-blue-500' },
  Active: { title: 'Active Clients', color: 'bg-green-500' },
  Inactive: { title: 'Inactive', color: 'bg-gray-500' },
};
export function PipelineColumn({ status, clients }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = statusConfig[status];
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col bg-muted/50 rounded-lg p-4 transition-colors duration-200',
        isOver ? 'bg-muted' : ''
      )}
    >
      <div className="flex items-center mb-4 pb-2 border-b">
        <div className={cn('w-3 h-3 rounded-full mr-2', config.color)} />
        <h3 className="font-semibold text-lg text-charcoal dark:text-white">{config.title}</h3>
        <span className="ml-auto text-sm font-medium bg-background text-muted-foreground rounded-full px-2 py-0.5">
          {clients.length}
        </span>
      </div>
      <SortableContext items={clients.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4 min-h-[200px]">
          {clients.map(client => (
            <PipelineCard key={client.id} client={client} />
          ))}
          {clients.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              <p>Drag clients here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}