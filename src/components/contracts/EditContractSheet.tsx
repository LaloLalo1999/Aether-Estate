import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ContractForm } from './ContractForm';
import { ContractFormData } from '@/lib/schemas';
import { api } from '@/lib/api-client';
import { Contract } from '@shared/types';
interface EditContractSheetProps {
  contract: Contract;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function EditContractSheet({ contract, isOpen, onOpenChange }: EditContractSheetProps) {
  const queryClient = useQueryClient();
  const { mutate: updateContract, isPending } = useMutation<Contract, Error, ContractFormData>({
    mutationFn: (updatedData) => api(`/api/contracts/${contract.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract updated successfully!');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Failed to update contract: ${error.message}`);
    },
  });
  const handleSubmit = (data: ContractFormData) => {
    updateContract(data);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Contract</SheetTitle>
          <SheetDescription>
            Update the details of the contract. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <ContractForm onSubmit={handleSubmit} initialData={contract} isSubmitting={isPending} />
        </div>
      </SheetContent>
    </Sheet>
  );
}