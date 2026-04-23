'use client';

import { useEffect, useMemo, useState } from 'react';
import type { EventSourceOptions } from 'extended-eventsource';

import { useAuthStore } from '@/store/auth';
import { useServerSideEvents } from '@/hooks/use-sse';

import { refreshAccessToken } from './token-manager';

export interface AuthServerSideEventOptions<TEventNames extends string> {
  url: string;
  options?: EventSourceOptions;
  events?: Record<TEventNames, (data: string) => void>;
}

export function useAuthenticatedServerSideEvents<TEventNames extends string>({
  url,
  options,
  events,
}: AuthServerSideEventOptions<TEventNames>) {
  const accessToken = useAuthStore((state) => state.tokens?.accessToken);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Automatically inject the Authorization header
  const mergedOptions = useMemo(() => {
    return {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }, [options, accessToken]);

  const sse = useServerSideEvents<TEventNames>({
    url,
    options: mergedOptions,
    events,
  });

  // Watch for connection errors (like 401s) and trigger token refresh
  useEffect(() => {
    const error = sse.connectionError as any;

    // extended-eventsource puts status on the Event as "status", or it might be "401"
    const isUnauthorized =
      error &&
      (error.status === 401 ||
        (error.message && typeof error.message === 'string' && error.message.includes('401')) ||
        (error.type === 'error' && !error.status)); // broad fallback: try refresh on generic network error

    if (isUnauthorized && !isRefreshing) {
      setIsRefreshing(true);

      refreshAccessToken()
        .catch(() => {
          alert('Session expired. Please login again.');
        })
        .finally(() => {
          setIsRefreshing(false);
        });
    }
  }, [sse.connectionError, isRefreshing]);

  return sse;
}
