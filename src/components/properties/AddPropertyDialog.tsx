import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { PropertyForm } from './PropertyForm';
import { PropertyFormData } from '@/lib/schemas';
import { api } from '@/lib/api-client';
import { Property } from '@shared/types';
export function AddPropertyDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: addProperty, isPending } = useMutation<Property, Error, PropertyFormData>({
    mutationFn: (newProperty) => api('/api/properties', {
      method: 'POST',
      body: JSON.stringify(newProperty),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property added successfully!');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to add property: ${error.message}`);
    },
  });
  const handleSubmit = (data: PropertyFormData) => {
    addProperty(data);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-charcoal text-white hover:bg-charcoal/90 dark:bg-white dark:text-charcoal dark:hover:bg-white/90 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new property listing.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <PropertyForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </div>
      </DialogContent>
    </Dialog>
  );
}