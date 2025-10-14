import React, { useState, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Search, User, Home } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Client, Property } from '@shared/types';
type PaginatedData<T> = { items: T[]; next: string | null };
export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const results = useQueries({
    queries: [
      { queryKey: ['search-clients'], queryFn: () => api<PaginatedData<Client>>('/api/clients?limit=1000'), enabled: open },
      { queryKey: ['search-properties'], queryFn: () => api<PaginatedData<Property>>('/api/properties?limit=1000'), enabled: open },
    ],
  });
  const clients = results[0].data?.items || [];
  const properties = results[1].data?.items || [];
  const isLoading = results.some(r => r.isLoading);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };
  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <span className="sr-only">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search clients or properties..." />
        <CommandList>
          <CommandEmpty>{isLoading ? 'Loading...' : 'No results found.'}</CommandEmpty>
          {!isLoading && clients.length > 0 && (
            <CommandGroup heading="Clients">
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`client-${client.name}-${client.email}`}
                  onSelect={() => runCommand(() => navigate('/clients'))}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{client.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {!isLoading && properties.length > 0 && (
            <CommandGroup heading="Properties">
              {properties.map((property) => (
                <CommandItem
                  key={property.id}
                  value={`property-${property.name}-${property.address}`}
                  onSelect={() => runCommand(() => navigate('/properties'))}
                >
                  <Home className="mr-2 h-4 w-4" />
                  <span>{property.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}