export interface PurchaseRequest {
  userId: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  cornsPurchased?: number;
  nextAvailableAt?: Date;
}

export interface RateLimitError {
  error: 'RATE_LIMIT_EXCEEDED';
  message: string;
  retryAfter: number;
  nextAvailableAt: Date;
}

export interface User {
  id: string;
  lastPurchase?: Date;
  totalCorns: number;
}

export type PurchaseResult = PurchaseResponse | RateLimitError;
