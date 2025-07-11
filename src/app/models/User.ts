export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export interface LoginRequest {
  email: string;
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
  message: string;
  jwt: string;
}
