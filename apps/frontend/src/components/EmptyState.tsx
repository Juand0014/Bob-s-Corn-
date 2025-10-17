import { memo } from 'react';
import { EmptyStateProps } from './types';

export const EmptyState = memo(function EmptyState({
  message,
}: EmptyStateProps) {
  return (
    <div className="text-center p-8">
      <p className="text-gray-500">{message}</p>
    </div>
  );
});
