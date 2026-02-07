export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  gender: string;
}

export interface AuthResponse extends User {
  accessToken: string;
  refreshToken: string;
}
