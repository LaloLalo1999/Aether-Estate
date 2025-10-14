import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-12 border-2 border-dashed rounded-lg bg-muted/50',
        className
      )}
    >
      <div className="bg-background p-4 rounded-full border mb-6">
        <Icon className="h-10 w-10 text-gold" />
      </div>
      <h3 className="text-2xl font-semibold font-display text-charcoal dark:text-white mb-2">
        {title}
      </h3>
      <p className="max-w-sm text-muted-foreground mb-6">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-charcoal text-white hover:bg-charcoal/90 dark:bg-white dark:text-charcoal dark:hover:bg-white/90"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}