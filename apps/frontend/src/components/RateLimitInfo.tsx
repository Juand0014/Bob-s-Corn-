import { memo } from 'react';
import { RateLimitInfoProps } from './types';

export const RateLimitInfo = memo(function RateLimitInfo({
  message = 'Rate limit: 1 corn per minute per user',
}: RateLimitInfoProps) {
  return (
    <div className="text-xs text-gray-500 text-center">
      <p>{message}</p>
    </div>
  );
});
