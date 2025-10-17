import { memo } from 'react';
import { ErrorMessageProps } from './types';

export const ErrorMessage = memo(function ErrorMessage({
  error,
  timeRemaining,
}: ErrorMessageProps) {
  return (
    <div
      className={`p-4 rounded-lg text-sm font-medium ${
        error.isRateLimit
          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}
    >
      {error.message}
      {timeRemaining > 0 && (
        <div className="text-xs mt-1 opacity-75">
          Next purchase available in {timeRemaining} seconds
        </div>
      )}
    </div>
  );
});
