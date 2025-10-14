import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bed, Bath, Square, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { Property } from '@shared/types';
import { AddPropertyDialog } from '@/components/properties/AddPropertyDialog';
import { PropertyActions } from '@/components/properties/PropertyActions';
import { EmptyState } from '@/components/EmptyState';
type PaginatedProperties = {
  items: Property[];
  next: string | null;
};
const PropertyCardSkeleton = () => (
  <Card className="overflow-hidden flex flex-col">
    <Skeleton className="h-48 w-full" />
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent className="flex-grow">
      <Skeleton className="h-8 w-1/3" />
    </CardContent>
    <CardFooter className="flex justify-between border-t pt-4">
      <Skeleton className="h-5 w-10" />
      <Skeleton className="h-5 w-10" />
      <Skeleton className="h-5 w-16" />
    </CardFooter>
  </Card>
);
export function PropertiesPage() {
  const { data, isLoading, isError, error } = useQuery<PaginatedProperties, Error>({
    queryKey: ['properties'],
    queryFn: () => api('/api/properties'),
  });
  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />);
    }
    if (isError) {
      return <div className="col-span-full text-center text-red-500 py-10">Error: {error.message}</div>;
    }
    if (!data || data.items.length === 0) {
      return (
        <div className="col-span-full">
          <EmptyState
            icon={Home}
            title="No Properties Found"
            description="You haven't added any properties yet. Add your first listing to see it here."
            action={{ label: 'Add Your First Property', onClick: () => {} }}
          />
        </div>
      );
    }
    return data.items.map((property) => (
      <Card key={property.id} className="overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative">
          <img src={property.imageUrl} alt={property.name} className="h-48 w-full object-cover" />
          <Badge
            className={cn('absolute top-3 right-3', {
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': property.status === 'For Sale',
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': property.status === 'Sold',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200': property.status === 'Pending',
            })}
          >
            {property.status}
          </Badge>
        </div>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold truncate">{property.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{property.address}</p>
          </div>
          <PropertyActions property={property} />
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-2xl font-bold text-gold">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(property.price)}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-1"><Bed className="h-4 w-4" /> {property.bedrooms}</div>
          <div className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.bathrooms}</div>
          <div className="flex items-center gap-1"><Square className="h-4 w-4" /> {property.sqft} sqft</div>
        </CardFooter>
      </Card>
    ));
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-display text-charcoal dark:text-white">Property Listings</h2>
        <AddPropertyDialog />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {renderContent()}
      </div>
    </div>
  );
}