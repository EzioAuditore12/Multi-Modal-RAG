import { authenticatedTypedFetch } from '@/lib/auth-fetch';

import { userSchema } from '../schemas/user.schema';

export const getProfileApi = async () => {
  return await authenticatedTypedFetch({
    url: 'user/profile',
    method: 'GET',
    schema: userSchema,
  });
};
