type Tokens = {
  accessToken: string;
  refreshToken: string;
};

type User = {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export interface AuthStore {
  user: User | null;
  tokens: Tokens | null;
  setUserDetails(data: User): void;
  setUserTokens(data: Tokens): void;
  logout: () => void;
}
