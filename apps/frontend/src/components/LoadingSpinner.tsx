import { memo } from 'react';
import { LoadingSpinnerProps } from './types';

export const LoadingSpinner = memo(function LoadingSpinner({
  size = 5,
  color = 'white',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin h-${size} w-${size} border-2 border-${color} rounded-full border-t-transparent`}
    />
  );
});
