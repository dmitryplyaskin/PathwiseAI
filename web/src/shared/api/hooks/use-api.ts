import { useState, useCallback } from 'react';
import { ApiError } from '../base';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T = unknown, A extends unknown[] = unknown[]>(
  apiCall: (...args: A) => Promise<T>,
  options: UseApiOptions = {},
) {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: A) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await apiCall(...args);
        setState({ data, loading: false, error: null });
        onSuccess?.(data);
        return data;
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError('Неизвестная ошибка');
        setState({ data: null, loading: false, error: apiError });
        onError?.(apiError);
        throw apiError;
      }
    },
    [apiCall, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Хук для мутаций (POST, PUT, DELETE)
export function useApiMutation<T = unknown, P = unknown>(
  apiCall: (params: P) => Promise<T>,
  options: UseApiOptions = {},
) {
  return useApi(apiCall, { ...options, immediate: false });
}

// Хук для запросов (GET)
export function useApiQuery<T = unknown>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {},
) {
  return useApi(apiCall, { ...options, immediate: true });
}
