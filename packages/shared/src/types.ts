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

export function isPurchaseResponse(
  result: PurchaseResult
): result is PurchaseResponse {
  return 'success' in result && result.success === true;
}

export function isRateLimitError(
  result: PurchaseResult
): result is RateLimitError {
  return 'error' in result && result.error === 'RATE_LIMIT_EXCEEDED';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

export interface HttpExceptionResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}

export interface UserEntity {
  id: string;
  lastPurchase: Date | null;
  totalCorns: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  id: string;
}

export interface UserStatsResponse {
  user: User;
  canPurchase: boolean;
  timeUntilNextPurchase?: number;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  database: DatabaseConfig;
  rateLimitWindowMs: number;
}
