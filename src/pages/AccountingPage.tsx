import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { Transaction } from '@shared/types';
import { AddTransactionDialog } from '@/components/accounting/AddTransactionDialog';
import { TransactionActions } from '@/components/accounting/TransactionActions';
import { EmptyState } from '@/components/EmptyState';
import { DollarSign } from 'lucide-react';
type PaginatedTransactions = {
  items: Transaction[];
  next: string | null;
};
const AccountingTableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Type</TableHead>
        <TableHead className="text-right">Amount</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-48" /></TableCell>
          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
export function AccountingPage() {
  const { data, isLoading, isError, error } = useQuery<PaginatedTransactions, Error>({
    queryKey: ['transactions'],
    queryFn: () => api('/api/transactions'),
  });
  const formatCurrency = (amount: number) => {
    const value = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    return amount < 0 ? `-${formatted}` : formatted;
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-display text-charcoal dark:text-white">Financial Transactions</h2>
        <AddTransactionDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <AccountingTableSkeleton />
          ) : isError ? (
            <div className="text-center text-red-500 py-10">Error: {error.message}</div>
          ) : !data || data.items.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No Transactions Recorded"
              description="Your financial history is empty. Add a transaction to get started."
              action={{ label: 'Add First Transaction', onClick: () => {} }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/50">
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn({
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': transaction.type === 'Income',
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': transaction.type === 'Expense',
                        })}
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn('text-right font-semibold', {
                      'text-green-600': transaction.type === 'Income',
                      'text-red-600': transaction.type === 'Expense',
                    })}>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <TransactionActions transaction={transaction} />
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