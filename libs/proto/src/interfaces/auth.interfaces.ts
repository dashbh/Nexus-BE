// Authentication Service gRPC Interfaces

export interface ValidateUserRequest {
  email: string;
  password: string;
}

export interface ValidateUserResponse {
  success: boolean;
  userId?: string;
  message?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  metadata?: Record<string, string>;
}

export interface CreateUserResponse {
  success: boolean;
  userId?: string;
  message?: string;
}

export interface GetUserRequest {
  userId: string;
}

export interface GetUserResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    isLocked: boolean;
  };
  message?: string;
}
