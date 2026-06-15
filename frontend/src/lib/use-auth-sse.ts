'use client';

import { useEffect, useMemo, useState } from 'react';
import type { EventSourceOptions } from 'extended-eventsource';

import { useAuthStore } from '@/store/auth';
import { useServerSideEvents } from '@/hooks/use-sse';

import { refreshAccessToken } from './token-manager';

export interface AuthServerSideEventOptions<TEventNames extends string> {
  url: string;
  // -> Pass through the enabled flag
  enabled?: boolean;
  options?: EventSourceOptions & { query?: Record<string, string> };
  events?: Record<TEventNames, (data: string) => void>;
}

export function useAuthenticatedServerSideEvents<TEventNames extends string>({
  url,
  enabled = true, // <- Default to true
  options,
  events,
}: AuthServerSideEventOptions<TEventNames>) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Automatically include credentials for HttpOnly cookies
  const mergedOptions = useMemo(() => {
    return {
      ...options,
      withCredentials: true,
      headers: {
        ...options?.headers,
      },
    };
  }, [options]);

  const sse = useServerSideEvents<TEventNames>({
    url,
    enabled, // <- Pass to the main hook
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
        (error.message && typeof error.message === 'string' && error.message.includes('401')));

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
