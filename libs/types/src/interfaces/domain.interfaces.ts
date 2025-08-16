// Domain/Business entity interfaces

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  isLocked: boolean;
  failedLoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export interface SessionData {
  userId: string;
  email: string;
  loginTime: Date;
  lastActivity: Date;
  refreshToken: string;
  deviceInfo?: string;
}
