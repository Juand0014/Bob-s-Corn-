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

export interface UserCornTotal {
  userId: string;
  totalCorns: number;
  lastPurchase: Date | null;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingRequests?: number;
  resetTime?: number;
  retryAfter?: number;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  limitBy: 'user' | 'machine';
}
