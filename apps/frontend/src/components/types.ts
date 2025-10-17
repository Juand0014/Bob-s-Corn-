export interface CornStatsDisplayProps {
  cornTotal: number;
  isLoading: boolean;
}

export interface PurchaseButtonProps {
  onClick: () => void;
  disabled: boolean;
  isPurchasing: boolean;
  timeRemaining: number;
  buttonText: string;
}

export interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export interface ErrorMessageProps {
  error: {
    message: string;
    isRateLimit: boolean;
  };
  timeRemaining: number;
}

export interface EmptyStateProps {
  message: string;
}

export interface RateLimitInfoProps {
  message?: string;
}
