export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
