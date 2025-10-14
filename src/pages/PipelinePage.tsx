import React from 'react';
import { PipelineBoard } from '@/components/pipeline/PipelineBoard';
export function PipelinePage() {
  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-display text-charcoal dark:text-white">Sales Pipeline</h2>
      </div>
      <div className="flex-grow">
        <PipelineBoard />
      </div>
    </div>
  );
}