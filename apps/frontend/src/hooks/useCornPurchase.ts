import { useCallback, useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PurchaseRequest,
  PurchaseResponse,
  UserCornTotal,
  RateLimitError,
} from '@packages/shared';
import { CORN_TOTAL_QUERY_KEY } from './queryKeys';
import { ConfigService } from '../config/config.service';

interface PurchaseError {
  message: string;
  isRateLimit: boolean;
  retryAfter?: number;
}

const API_BASE_URL = ConfigService.getApiUrl();

export function useCornPurchase({ userId }: PurchaseRequest) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [purchaseError, setPurchaseError] = useState<PurchaseError | null>(
    null
  );

  const queryClient = useQueryClient();

  const {
    data: cornTotal,
    isLoading: isLoadingTotal,
    error: totalError,
  } = useQuery({
    queryKey: [CORN_TOTAL_QUERY_KEY, userId],
    queryFn: async (): Promise<UserCornTotal> => {
      const response = await fetch(`${API_BASE_URL}/purchase/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch corn total');
      }

      return response.json();
    },
    enabled: !!userId,

    staleTime: 30 * 1000,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (): Promise<
      PurchaseResponse & { headers?: { retryAfter?: number } }
    > => {
      const purchaseData: PurchaseRequest = { userId };

      const response = await fetch(`${API_BASE_URL}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const errorData: RateLimitError = await response.json();

          throw {
            isRateLimit: true,
            message: errorData.message,
            retryAfter: errorData.retryAfter,
          };
        }

        throw {
          isRateLimit: false,
          message: 'Failed to purchase corn',
        };
      }

      const data = await response.json();

      const retryAfter = response.headers.get('Retry-After');
      if (retryAfter) {
        data.headers = { retryAfter: parseInt(retryAfter) };
      }

      return data;
    },
    onSuccess: async (
      data: PurchaseResponse & { headers?: { retryAfter?: number } }
    ) => {
      await queryClient.invalidateQueries({
        queryKey: [CORN_TOTAL_QUERY_KEY, userId],
      });
      setPurchaseError(null);

      const waitTime = data.headers?.retryAfter || 60;

      setTimeRemaining(waitTime);
    },
    onError: (error: PurchaseError) => {
      setPurchaseError(error);

      if (error.isRateLimit && error.retryAfter) {
        setTimeRemaining(error.retryAfter);
      }
    },
  });

  const handlePurchase = useCallback(() => {
    if (timeRemaining > 0 || purchaseMutation.isPending) return;

    purchaseMutation.mutate();
  }, [timeRemaining, purchaseMutation]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          setPurchaseError(null);

          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  useEffect(() => {
    setPurchaseError(null);

    setTimeRemaining(0);
  }, [userId]);

  const isDisabled = useMemo(
    () => timeRemaining > 0 || purchaseMutation.isPending || !userId.trim(),
    [timeRemaining, purchaseMutation.isPending, userId]
  );

  const buttonText = useMemo(() => {
    if (purchaseMutation.isPending) {
      return 'Buying...';
    }

    if (timeRemaining > 0) {
      return `Wait ${timeRemaining}s`;
    }

    return 'Buy Corn';
  }, [purchaseMutation.isPending, timeRemaining]);

  const currentTotal = useMemo(
    () => cornTotal?.totalCorns ?? 0,
    [cornTotal?.totalCorns]
  );

  return useMemo(
    () => ({
      cornTotal: currentTotal,
      userId: cornTotal?.userId ?? userId,
      isLoadingTotal,
      isPurchasing: purchaseMutation.isPending,
      purchaseError,
      totalError,
      timeRemaining,
      handlePurchase,
      isDisabled,
      buttonText,
    }),
    [
      currentTotal,
      cornTotal?.userId,
      userId,
      isLoadingTotal,
      purchaseMutation.isPending,
      purchaseError,
      totalError,
      timeRemaining,
      handlePurchase,
      isDisabled,
      buttonText,
    ]
  );
}
