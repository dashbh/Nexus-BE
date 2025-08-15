import { Injectable } from '@nestjs/common';
import { ApiResponse, ApiError } from './interfaces';

@Injectable()
export class TypesService {
  /**
   * Validates if an object matches the User interface structure
   */
  isValidUser(obj: unknown): obj is Record<string, unknown> {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    const user = obj as Record<string, unknown>;
    return (
      typeof user.id === 'string' &&
      typeof user.email === 'string' &&
      typeof user.isLocked === 'boolean' &&
      typeof user.failedLoginAttempts === 'number' &&
      user.createdAt instanceof Date &&
      user.updatedAt instanceof Date
    );
  }

  /**
   * Validates if an object matches the JwtPayload interface structure
   */
  isValidJwtPayload(obj: unknown): obj is Record<string, unknown> {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    const payload = obj as Record<string, unknown>;
    return (
      typeof payload.sub === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.iat === 'number' &&
      typeof payload.exp === 'number'
    );
  }

  /**
   * Validates if an object matches the SessionData interface structure
   */
  isValidSessionData(obj: unknown): obj is Record<string, unknown> {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    const session = obj as Record<string, unknown>;
    return (
      typeof session.userId === 'string' &&
      typeof session.email === 'string' &&
      session.loginTime instanceof Date &&
      session.lastActivity instanceof Date &&
      typeof session.refreshToken === 'string'
    );
  }

  /**
   * Creates a standardized API response
   */
  createApiResponse<T>(
    success: boolean,
    data?: T,
    error?: ApiError,
    correlationId?: string,
  ): ApiResponse<T> {
    return {
      success,
      data,
      error,
      timestamp: new Date(),
      correlationId: correlationId || this.generateCorrelationId(),
    };
  }

  /**
   * Creates pagination metadata
   */
  createPaginationMeta(
    page: number,
    limit: number,
    total: number,
  ): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Generates a correlation ID
   */
  private generateCorrelationId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
