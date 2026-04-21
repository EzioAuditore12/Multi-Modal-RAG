import { useQuery } from '@tanstack/react-query';

import { getProfileApi } from '../api/get-profile.api';

export function useGetProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
  });
}
