import { env } from '@/env';
import type { BaseAuthenticatedFetchProps } from './type';
import { useAuthStore } from '@/store/auth';
import { buildQueryParams } from '../fetch';
import { refreshAccessToken } from './tokens-manager';

/**
 * Core authenticated fetch executor.
 * Automatically attaches the JWT access token, serializes query params,
 * and handles Content-Type for JSON vs FormData bodies.
 * On a 401 response, transparently refreshes the access token and retries once.
 */
export const executeAuthenticatedRequest = async ({
  baseUrl = env.NEXT_PUBLIC_API_URL,
  url,
  headers,
  responseStatus = 401,
  body,
  query,
  method,
  ...props
}: BaseAuthenticatedFetchProps) => {
  const isFormData = body instanceof FormData;

  const authHeaders: Record<string, string> = {
    ...((headers as Record<string, string>) || {}),
  };

  if (!isFormData && !authHeaders['Content-Type']) {
    authHeaders['Content-Type'] = 'application/json';
  }

  const paramsValues = buildQueryParams(query);

  if (paramsValues) {
    url = url + (url.includes('?') ? '&' : '?') + paramsValues;
  }

  const requestOptions = {
    method,

    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  };

  const apiUrl = `${baseUrl}/${url}`;

  let response = await fetch(apiUrl, {
    ...requestOptions,

    credentials: 'include',

    headers: authHeaders,

    ...props,
  });

  // If the server responds with 401, attempt a silent token refresh and retry
  if (response.status === responseStatus) {
    try {
      await refreshAccessToken();

      // Retry the original request (new HttpOnly cookie is attached automatically)
      response = await fetch(apiUrl, {
        ...requestOptions,

        credentials: 'include',

        headers: authHeaders,

        ...props,
      });
    } catch (error) {
      alert('Session expired. Please login again.');

      throw error;
    }
  }

  return response;
};
