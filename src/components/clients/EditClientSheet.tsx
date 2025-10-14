import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ClientForm } from './ClientForm';
import { api } from '@/lib/api-client';
import { Client } from '@shared/types';
import { ClientFormData } from '@/lib/schemas';
interface EditClientSheetProps {
  client: Client;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function EditClientSheet({ client, isOpen, onOpenChange }: EditClientSheetProps) {
  const queryClient = useQueryClient();
  const { mutate: updateClient, isPending } = useMutation<Client, Error, ClientFormData>({
    mutationFn: (updatedData) => api(`/api/clients/${client.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client updated successfully!');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Failed to update client: ${error.message}`);
    },
  });
  const handleSubmit = (data: ClientFormData) => {
    updateClient(data);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Client Details</SheetTitle>
          <SheetDescription>
            Make changes to your client's profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <ClientForm onSubmit={handleSubmit} initialData={client} isSubmitting={isPending} />
        </div>
      </SheetContent>
    </Sheet>
  );
}