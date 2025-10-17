'use client';

import { memo } from 'react';
import { useCornPurchase } from '@/hooks/useCornPurchase';
import {
  CornStatsDisplay,
  PurchaseButton,
  ErrorMessage,
  EmptyState,
  RateLimitInfo,
} from './index';

interface CornPurchaseProps {
  userId: string;
}

export default memo(function CornPurchase({ userId }: CornPurchaseProps) {
  const {
    cornTotal,
    isLoadingTotal,
    isPurchasing,
    purchaseError,
    timeRemaining,
    handlePurchase,
    isDisabled,
    buttonText,
  } = useCornPurchase({ userId });

  if (!userId.trim()) {
    return (
      <EmptyState message="Please enter a User ID to start purchasing corn" />
    );
  }

  return (
    <div className="space-y-6">
      <CornStatsDisplay cornTotal={cornTotal} isLoading={isLoadingTotal} />

      <PurchaseButton
        onClick={handlePurchase}
        disabled={isDisabled}
        isPurchasing={isPurchasing}
        timeRemaining={timeRemaining}
        buttonText={buttonText}
      />

      {purchaseError && (
        <ErrorMessage error={purchaseError} timeRemaining={timeRemaining} />
      )}

      <RateLimitInfo />
    </div>
  );
});
