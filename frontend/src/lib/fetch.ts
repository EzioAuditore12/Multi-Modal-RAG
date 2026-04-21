import * as s from 'standard-parse';

export type FetchProps = RequestInit;

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface TypedFetchProps<S extends s.StandardSchemaV1> extends Omit<
  RequestInit,
  'method' | 'body'
> {
  url: string;
  schema: S;
  method: HttpMethods;
  query?: object; // Renamed from params to query
  body?: object;
}

export const typedFetch = async <S extends s.StandardSchemaV1>({
  url,
  schema,
  headers,
  query, // Renamed from params to query
  method,
  body,
  ...props
}: TypedFetchProps<S>): Promise<s.StandardSchemaV1.InferOutput<S>> => {
  const typedFetchHeader = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (query !== undefined) {
    const queryString = new URLSearchParams(query as Record<string, string>).toString();
    url = url + (url.includes('?') ? '&' : '?') + queryString;
  }

  const response = await fetch(url, {
    headers: typedFetchHeader,
    method: method,
    body: body ? JSON.stringify(body) : undefined,
    ...props,
  });

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

  const result = s.safeParse(schema, json);

  if (result.issues) throw new Error(JSON.stringify(result.issues));

  return result.value;
};
