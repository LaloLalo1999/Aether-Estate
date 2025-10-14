import React, { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Client } from '@shared/types';
import { api } from '@/lib/api-client';
import { PipelineColumn } from './PipelineColumn';
import { PipelineCard } from './PipelineCard';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';
type PaginatedClients = { items: Client[]; next: string | null; };
type ClientStatus = 'Lead' | 'Active' | 'Inactive';
const COLUMNS: ClientStatus[] = ['Lead', 'Active', 'Inactive'];
export function PipelineBoard() {
  const queryClient = useQueryClient();
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const { data, isLoading, isError, error } = useQuery<PaginatedClients, Error>({
    queryKey: ['pipeline-clients'],
    queryFn: () => api('/api/clients?limit=1000'),
  });
  const clientsByStatus = useMemo(() => {
    const initial: Record<ClientStatus, Client[]> = { Lead: [], Active: [], Inactive: [] };
    if (!data) return initial;
    return data.items.reduce((acc, client) => {
      acc[client.status].push(client);
      return acc;
    }, initial);
  }, [data]);
  const { mutate: updateClientStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ClientStatus }) =>
      api(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success("Client status updated!");
    },
    onError: (err) => {
      toast.error(`Failed to update status: ${err.message}`);
      queryClient.invalidateQueries({ queryKey: ['pipeline-clients'] });
    },
  });
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  }));
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const client = data?.items.find(c => c.id === active.id);
    if (client) setActiveClient(client);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveClient(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeClient = data?.items.find(c => c.id === active.id);
    const newStatus = over.id as ClientStatus;
    if (activeClient && activeClient.status !== newStatus) {
      updateClientStatus({ id: activeClient.id, status: newStatus });
    }
  };
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map(status => (
          <div key={status} className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }
  if (isError) return <div className="text-center text-red-500">Error: {error.message}</div>;
  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {COLUMNS.map(status => (
          <PipelineColumn key={status} status={status} clients={clientsByStatus[status]} />
        ))}
      </div>
      <DragOverlay>
        {activeClient ? <PipelineCard client={activeClient} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}