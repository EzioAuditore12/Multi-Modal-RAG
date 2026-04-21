import { refreshTokensApi } from '@/features/auth/refresh/api/refresh-tokens.api';
import { useAuthStore } from '@/store/auth';

let refreshPromise: Promise<void> | null = null;

export const refreshAccessToken = async (): Promise<void> => {
  // If a refresh is already in progress, return the existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  // Otherwise, create a new refresh promise
  refreshPromise = (async () => {
    try {
      const refreshToken = useAuthStore.getState().tokens?.refreshToken;

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshTokensApi(
        { refreshToken }
      );

      useAuthStore.getState().setUserTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      // If refresh fails, we must log out
      useAuthStore.getState().logout();
      throw error;
    } finally {
      // Reset the promise so future failures trigger a new refresh
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
