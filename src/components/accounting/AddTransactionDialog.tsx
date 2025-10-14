import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { TransactionFormData } from '@/lib/schemas';
import { api } from '@/lib/api-client';
import { Transaction } from '@shared/types';
export function AddTransactionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: addTransaction, isPending } = useMutation<Transaction, Error, TransactionFormData>({
    mutationFn: (newTransaction) => api('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(newTransaction),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction added successfully!');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to add transaction: ${error.message}`);
    },
  });
  const handleSubmit = (data: TransactionFormData) => {
    addTransaction(data);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-charcoal text-white hover:bg-charcoal/90 dark:bg-white dark:text-charcoal dark:hover:bg-white/90 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of the financial transaction below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TransactionForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </div>
      </DialogContent>
    </Dialog>
  );
}