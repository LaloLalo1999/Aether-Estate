import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { ClientForm } from './ClientForm';
import { ClientFormData } from '@/lib/schemas';
import { api } from '@/lib/api-client';
import { Client } from '@shared/types';
export function AddClientDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: addClient, isPending } = useMutation<Client, Error, ClientFormData>({
    mutationFn: (newClient) => api('/api/clients', {
      method: 'POST',
      body: JSON.stringify(newClient),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline-clients'] });
      toast.success('Client added successfully!');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to add client: ${error.message}`);
    },
  });
  const handleSubmit = (data: ClientFormData) => {
    addClient(data);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-charcoal text-white hover:bg-charcoal/90 dark:bg-white dark:text-charcoal dark:hover:bg-white/90 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter the client's details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ClientForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </div>
      </DialogContent>
    </Dialog>
  );
}