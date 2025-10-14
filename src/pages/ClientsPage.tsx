import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { Client } from '@shared/types';
import { AddClientDialog } from '@/components/clients/AddClientDialog';
import { ClientActions } from '@/components/clients/ClientActions';
import { EmptyState } from '@/components/EmptyState';
import { Users } from 'lucide-react';
type PaginatedClients = {
  items: Client[];
  next: string | null;
};
const ClientTableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Last Contacted</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-40" /></TableCell>
          <TableCell><Skeleton className="h-5 w-28" /></TableCell>
          <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
export function ClientsPage() {
  const { data, isLoading, isError, error } = useQuery<PaginatedClients, Error>({
    queryKey: ['clients'],
    queryFn: () => api('/api/clients'),
  });
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-display text-charcoal dark:text-white">Client Management</h2>
        <AddClientDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ClientTableSkeleton />
          ) : isError ? (
            <div className="text-center text-red-500 py-10">Error: {error.message}</div>
          ) : !data || data.items.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Clients Found"
              description="You haven't added any clients yet. Get started by adding your first one."
              action={{ label: 'Add Your First Client', onClick: () => {} }} // The button is in the header, this is a placeholder
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Contacted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn({
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': client.status === 'Active',
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': client.status === 'Lead',
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': client.status === 'Inactive',
                        })}
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(client.lastContacted).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <ClientActions client={client} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}