export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  active: boolean;
  password?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtPayload {
  iss: string;
  sub: string;
  authorities: string;
  iat: number;
  exp: number;
  jti: string;
  nbf: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
