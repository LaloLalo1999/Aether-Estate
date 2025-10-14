import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { ContractForm } from './ContractForm';
import { ContractFormData } from '@/lib/schemas';
import { api } from '@/lib/api-client';
import { Contract } from '@shared/types';
export function AddContractDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: addContract, isPending } = useMutation<Contract, Error, ContractFormData>({
    mutationFn: (newContract) => api('/api/contracts', {
      method: 'POST',
      body: JSON.stringify(newContract),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract added successfully!');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to add contract: ${error.message}`);
    },
  });
  const handleSubmit = (data: ContractFormData) => {
    addContract(data);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-charcoal text-white hover:bg-charcoal/90 dark:bg-white dark:text-charcoal dark:hover:bg-white/90 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contract</DialogTitle>
          <DialogDescription>
            Link a property and client to create a new contract.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ContractForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </div>
      </DialogContent>
    </Dialog>
  );
}