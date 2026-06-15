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
  setUserDetails(data: User): void;
  logout: () => void;
}
