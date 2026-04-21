import * as s from 'standard-parse';
import { FetchProps, HttpMethods } from './fetch';
import { env } from '@/env';
import { useAuthStore } from '@/store/auth';
import { refreshAccessToken } from './token-manager';

interface AuthenticatedFetchProps extends Omit<FetchProps, 'body' | 'method'> {
  baseUrl?: string;
  url: string;
  responseStatus?: number;
  method: HttpMethods;
  body?: object;
}

export const authenticatedFetch = async ({
  baseUrl = env.NEXT_PUBLIC_API_URL,
  url,
  headers,
  responseStatus = 401,
  body,
  method,
  ...props
}: AuthenticatedFetchProps) => {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  if (!accessToken) throw new Error('No authentication token provided');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...(headers || {}),
  };

  const requestOptions = {
    method,
    body: body ? JSON.stringify(body) : undefined,
  };

  const apiUrl = `${baseUrl}/${url}`;

  let response = await fetch(apiUrl, {
    ...requestOptions,
    headers: authHeaders,
    ...props,
  });

  if (response.status === responseStatus) {
    try {
      // 1. Call the shared refresh logic
      await refreshAccessToken();

      // 2. Get new token
      const newAccessToken = useAuthStore.getState().tokens?.accessToken;

      // 3. Update headers
      authHeaders.Authorization = `Bearer ${newAccessToken}`;

      // 4. Retry request
      response = await fetch(apiUrl, {
        ...requestOptions,
        headers: authHeaders,
        ...props,
      });
    } catch (error) {
      alert('Session expired. Please login again.');
      throw error;
    }
  }

  const json = await response.json();
  return json;
};

interface TypedAuthenticatedFetchProps<
  S extends s.StandardSchemaV1,
> extends AuthenticatedFetchProps {
  method: HttpMethods;
  schema: S;
  body?: object;
  query?: object; // Renamed from params to query
}

export const authenticatedTypedFetch = async <S extends s.StandardSchemaV1>({
  baseUrl = `${env.NEXT_PUBLIC_API_URL}`,
  url,
  headers,
  responseStatus = 401,
  body,
  schema,
  query, // Renamed from params to query
  method,
  ...props
}: TypedAuthenticatedFetchProps<S>): Promise<s.StandardSchemaV1.InferOutput<S>> => {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  if (!accessToken) throw new Error('No authentication token provided');

  let authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...(headers || {}),
  };

  if (query !== undefined) {
    const queryString = new URLSearchParams(query as Record<string, string>).toString();
    url = url + (url.includes('?') ? '&' : '?') + queryString;
  }

  const requestOptions = {
    method,
    body: body ? JSON.stringify(body) : undefined,
  };

  const apiUrl = `${baseUrl}/${url}`;

  let response = await fetch(apiUrl, {
    ...requestOptions,
    headers: authHeaders,
    ...props,
  });

  if (response.status === responseStatus) {
    try {
      // 1. Call shared refresh logic
      await refreshAccessToken();

      // 2. Get new token
      const newAccessToken = useAuthStore.getState().tokens?.accessToken;

      // 3. Update headers
      authHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newAccessToken}`,
        ...(headers || {}),
      };

      // 4. Retry request
      response = await fetch(apiUrl, {
        ...requestOptions,
        headers: authHeaders,
        ...props,
      });
    } catch (error) {
      alert('Session expired. Please login again.');
      throw error;
    }
  }

  const json = await response.json();

  const result = s.safeParse(schema, json);

  if (result.issues) throw new Error(JSON.stringify(result.issues));

  return result.value;
};
