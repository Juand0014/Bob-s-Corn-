'use client';

import { useTranslations } from 'next-intl';
import { useCornPurchase } from '@/hooks/useCornPurchase';
import { CornStatsDisplay, PurchaseButton, ErrorMessage } from './index';

interface CornPurchaseProps {
  userId: string;
}

export const CornPurchase = ({ userId }: CornPurchaseProps) => {
  const t = useTranslations('purchase');
  const {
    cornTotal,
    isLoadingTotal,
    isPurchasing,
    purchaseError,
    timeRemaining,
    handlePurchase,
    isDisabled,
  } = useCornPurchase({ userId });

  const getButtonText = () => {
    if (isPurchasing) {
      return t('buying');
    }
    if (timeRemaining > 0) {
      return t('waitToBuyAgain', { seconds: timeRemaining });
    }
    return t('buyCorn');
  };

  return (
    <div className="space-y-6">
      <CornStatsDisplay cornTotal={cornTotal} isLoading={isLoadingTotal} />

      <PurchaseButton
        onClick={handlePurchase}
        disabled={isDisabled}
        isPurchasing={isPurchasing}
        timeRemaining={timeRemaining}
        buttonText={getButtonText()}
      />

      {purchaseError && (
        <ErrorMessage error={purchaseError} timeRemaining={timeRemaining} />
      )}
    </div>
  );
};