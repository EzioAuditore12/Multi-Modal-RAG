import * as s from 'standard-parse';

export type FetchOptions = RequestInit;

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Converts an object of key-value pairs into a URL search string.
 * Handles arrays (repeated params), null (empty string), and undefined (skipped).
 */
export const buildQueryParams = (query?: object) => {
  if (!query) return '';

  const params = new URLSearchParams();

  Object.entries(query as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined) return;

    if (value === null) {
      params.append(key, '');
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)));
      return;
    }

    params.append(key, String(value));
  });

  return params.toString();
};

interface TypedFetchProps<S extends s.StandardSchemaV1> extends Omit<
  FetchOptions,
  'method' | 'body'
> {
  url: string;
  schema: S;
  method: HttpMethods;
  query?: object;
  body?: object | FormData;
  contentType?: string | null;
}

/**
 * Type-safe fetch wrapper that validates the response JSON against a
 * Standard Schema (Zod-compatible). Throws on HTTP errors or validation failures.
 */
export const typedFetch = async <S extends s.StandardSchemaV1>({
  url,
  schema,
  headers,
  query,
  method,
  body,
  contentType = 'application/json',
  ...props
}: TypedFetchProps<S>): Promise<s.StandardSchemaV1.InferOutput<S>> => {
  const typedFetchHeader: Record<string, string> = {
    ...((headers as Record<string, string>) || {}),
  };

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (!isFormData && contentType !== null && !typedFetchHeader['Content-Type']) {
    typedFetchHeader['Content-Type'] = contentType;
  }

  const paramsValues = buildQueryParams(query);

  if (paramsValues) url = url + (url.includes('?') ? '&' : '?') + paramsValues;

  const response = await fetch(url, {
    credentials: 'include',
    headers: typedFetchHeader,
    method: method,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    ...props,
  });

  // Try to extract a structured error message from the response body
  if (!response.ok) {
    const errorBody = await response.text();
    try {
      const errorJson = JSON.parse(errorBody);
      throw new Error(errorJson.message || JSON.stringify(errorJson));
    } catch {
      throw new Error(errorBody || response.statusText);
    }
  }

  const json = await response.json();

  // Validate the parsed JSON against the provided schema
  const result = s.safeParse(schema, json);

  if (result.issues) throw new Error(JSON.stringify(result.issues));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return result.value;
};
