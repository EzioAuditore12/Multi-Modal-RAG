import { useAuthStore } from '@/store/auth';

import { refreshTokensApi } from '@/features/auth/refresh/api/refresh-tokens.api';

/**
 * Singleton promise guard: prevents multiple concurrent refresh requests.
 * If a refresh is already in-flight, subsequent calls reuse the same promise
 * instead of firing parallel refresh API calls (which would race-condition).
 */
let refreshPromise: Promise<void> | null = null;

export const refreshAccessToken = async (): Promise<void> => {
  // If a refresh is already in progress, return the existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  // Otherwise, create a new refresh promise
  refreshPromise = (async () => {
    try {
      // Just call the refresh API. The refresh token is in the HttpOnly cookie.
      await refreshTokensApi();
    } catch (error) {
      // If refresh fails (e.g. refresh token expired), force logout
      useAuthStore.getState().logout();
      throw error;
    } finally {
      // Reset so future calls trigger a new refresh attempt
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
