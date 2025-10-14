import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { PropertyForm } from './PropertyForm';
import { PropertyFormData } from '@/lib/schemas';
import { api } from '@/lib/api-client';
import { Property } from '@shared/types';
interface EditPropertySheetProps {
  property: Property;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function EditPropertySheet({ property, isOpen, onOpenChange }: EditPropertySheetProps) {
  const queryClient = useQueryClient();
  const { mutate: updateProperty, isPending } = useMutation<Property, Error, PropertyFormData>({
    mutationFn: (updatedData) => api(`/api/properties/${property.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property updated successfully!');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Failed to update property: ${error.message}`);
    },
  });
  const handleSubmit = (data: PropertyFormData) => {
    updateProperty(data);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Property</SheetTitle>
          <SheetDescription>
            Make changes to the property details. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <PropertyForm onSubmit={handleSubmit} initialData={property} isSubmitting={isPending} />
        </div>
      </SheetContent>
    </Sheet>
  );
}