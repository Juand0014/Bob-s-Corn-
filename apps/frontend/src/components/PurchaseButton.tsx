import { memo } from 'react';
import { PurchaseButtonProps } from './types';
import { LoadingSpinner } from './LoadingSpinner';

export const PurchaseButton = memo(function PurchaseButton({
  onClick,
  disabled,
  isPurchasing,
  timeRemaining,
  buttonText,
}: PurchaseButtonProps) {
  const getButtonContent = () => {
    if (isPurchasing) {
      return (
        <div className="flex items-center justify-center space-x-2">
          <LoadingSpinner size={5} color="white" />
          <span>Purchasing...</span>
        </div>
      );
    }

    if (timeRemaining > 0) {
      return `Wait ${timeRemaining}s to buy again`;
    }

    return buttonText;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg ${
        !disabled
          ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      {getButtonContent()}
    </button>
  );
});
