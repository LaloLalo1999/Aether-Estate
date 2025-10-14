import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Client } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Mail, Phone } from 'lucide-react';
interface PipelineCardProps {
  client: Client;
  isDragging?: boolean;
}
export function PipelineCard({ client, isDragging = false }: PipelineCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: client.id,
    data: { type: 'Client', client },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0].substring(0, 2);
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={cn(
          'cursor-grab active:cursor-grabbing transition-shadow duration-200',
          (isDragging || isSortableDragging) ? 'shadow-2xl ring-2 ring-gold scale-105' : 'hover:shadow-md'
        )}
      >
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar>
            <AvatarFallback className="bg-gold text-white font-bold">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-base font-semibold">{client.name}</CardTitle>
            <p className="text-xs text-muted-foreground">Last contacted: {new Date(client.lastContacted).toLocaleDateString()}</p>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            <span>{client.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <span>{client.phone}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}