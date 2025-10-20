import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { ErrorMessageProps } from './types';

export const ErrorMessage = memo(function ErrorMessage({
  error,
  timeRemaining,
}: ErrorMessageProps) {
  const t = useTranslations('purchase');
  const tCommon = useTranslations('common');

  const getErrorMessage = () => {
    if (error.isRateLimit) {
      return t('rateLimitExceeded');
    }
    if (error.message === 'Failed to purchase corn') {
      return t('failedToPurchase');
    }
    if (error.message === 'Failed to fetch corn total') {
      return t('failedToFetchTotal');
    }
    return error.message;
  };

  return (
    <div
      className={`p-4 rounded-lg text-sm font-medium ${
        error.isRateLimit
          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}
    >
      {getErrorMessage()}
      {timeRemaining > 0 && (
        <div className="text-xs mt-1 opacity-75">
          {tCommon('nextPurchaseAvailable', { seconds: timeRemaining })}
        </div>
      )}
    </div>
  );
});
