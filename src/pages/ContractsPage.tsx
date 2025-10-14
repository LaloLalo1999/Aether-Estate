import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { Contract, Property, Client } from '@shared/types';
import { AddContractDialog } from '@/components/contracts/AddContractDialog';
import { ContractActions } from '@/components/contracts/ContractActions';
import { EmptyState } from '@/components/EmptyState';
import { FileText } from 'lucide-react';
type PaginatedData<T> = {
  items: T[];
  next: string | null;
};
const ContractsTableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Property</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Expiry Date</TableHead>
        <TableHead className="text-right">Amount</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-5 w-40" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-5 w-28 ml-auto" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
export function ContractsPage() {
  const results = useQueries({
    queries: [
      { queryKey: ['contracts'], queryFn: () => api<PaginatedData<Contract>>('/api/contracts') },
      { queryKey: ['properties'], queryFn: () => api<PaginatedData<Property>>('/api/properties') },
      { queryKey: ['clients'], queryFn: () => api<PaginatedData<Client>>('/api/clients') },
    ],
  });
  const isLoading = results.some(q => q.isLoading);
  const isError = results.some(q => q.isError);
  const contractsData = results[0].data;
  const propertiesData = results[1].data;
  const clientsData = results[2].data;
  const propertyMap = React.useMemo(() => new Map(propertiesData?.items.map(p => [p.id, p])), [propertiesData]);
  const clientMap = React.useMemo(() => new Map(clientsData?.items.map(c => [c.id, c])), [clientsData]);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-display text-charcoal dark:text-white">Contract Management</h2>
        <AddContractDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ContractsTableSkeleton />
          ) : isError ? (
            <div className="text-center text-red-500 py-10">Error loading data.</div>
          ) : !contractsData || contractsData.items.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No Contracts Found"
              description="You have no contracts yet. Create one to manage your deals."
              action={{ label: 'Create First Contract', onClick: () => {} }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractsData.items.map((contract) => {
                  const property = propertyMap.get(contract.propertyId);
                  const client = clientMap.get(contract.clientId);
                  return (
                    <TableRow key={contract.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{property?.name || 'N/A'}</TableCell>
                      <TableCell>{client?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn({
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': contract.status === 'Signed',
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': contract.status === 'Sent',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200': contract.status === 'Draft',
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': contract.status === 'Expired',
                          })}
                        >
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(contract.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-semibold text-gold">
                        {formatCurrency(contract.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <ContractActions contract={contract} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}