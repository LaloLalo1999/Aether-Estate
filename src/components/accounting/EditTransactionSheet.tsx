import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { TransactionForm } from './TransactionForm';
import { TransactionFormData } from '@/lib/schemas';
import { api } from '@/lib/api-client';
import { Transaction } from '@shared/types';
interface EditTransactionSheetProps {
  transaction: Transaction;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function EditTransactionSheet({ transaction, isOpen, onOpenChange }: EditTransactionSheetProps) {
  const queryClient = useQueryClient();
  const { mutate: updateTransaction, isPending } = useMutation<Transaction, Error, TransactionFormData>({
    mutationFn: (updatedData) => api(`/api/transactions/${transaction.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction updated successfully!');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Failed to update transaction: ${error.message}`);
    },
  });
  const handleSubmit = (data: TransactionFormData) => {
    updateTransaction(data);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
          <SheetDescription>
            Update the details of the transaction. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <TransactionForm onSubmit={handleSubmit} initialData={transaction} isSubmitting={isPending} />
        </div>
      </SheetContent>
    </Sheet>
  );
}