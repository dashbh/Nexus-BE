import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorCodes {
  // Authentication errors
  INVALID_CREDENTIALS = 'AUTH_001',
  ACCOUNT_LOCKED = 'AUTH_002',
  TOKEN_EXPIRED = 'AUTH_003',
  TOKEN_INVALID = 'AUTH_004',
  UNAUTHORIZED = 'AUTH_005',
  FORBIDDEN = 'AUTH_006',

  // Validation errors
  VALIDATION_FAILED = 'VALIDATION_001',
  INVALID_INPUT = 'VALIDATION_002',
  MISSING_REQUIRED_FIELD = 'VALIDATION_003',

  // Security errors
  RATE_LIMIT_EXCEEDED = 'SECURITY_001',
  SUSPICIOUS_ACTIVITY = 'SECURITY_002',
  IP_BLOCKED = 'SECURITY_003',

  // Database errors
  DATABASE_CONNECTION_FAILED = 'DB_001',
  RECORD_NOT_FOUND = 'DB_002',
  DUPLICATE_ENTRY = 'DB_003',
  CONSTRAINT_VIOLATION = 'DB_004',

  // External service errors
  EXTERNAL_SERVICE_UNAVAILABLE = 'EXT_001',
  GRPC_CONNECTION_FAILED = 'EXT_002',
  KAFKA_PUBLISH_FAILED = 'EXT_003',
  REDIS_CONNECTION_FAILED = 'EXT_004',

  // WebSocket errors
  WEBSOCKET_CONNECTION_FAILED = 'WS_001',
  WEBSOCKET_AUTHENTICATION_FAILED = 'WS_002',
  WEBSOCKET_MESSAGE_INVALID = 'WS_003',

  // General errors
  INTERNAL_SERVER_ERROR = 'GEN_001',
  SERVICE_UNAVAILABLE = 'GEN_002',
  TIMEOUT = 'GEN_003',
  CONFIGURATION_ERROR = 'GEN_004',
}

export interface ErrorDetails {
  field?: string;
  value?: any;
  constraint?: string;
  context?: Record<string, any>;
}

export class NexusError extends Error {
  public readonly code: string;
  public readonly httpStatus: HttpStatus;
  public readonly details?: ErrorDetails;
  public readonly timestamp: Date;
  public readonly correlationId?: string;

  constructor(
    code: ErrorCodes,
    message: string,
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(message);
    this.name = 'NexusError';
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;
    this.timestamp = new Date();
    this.correlationId = correlationId;
  }
}

export class AuthenticationError extends NexusError {
  constructor(
    code: ErrorCodes = ErrorCodes.UNAUTHORIZED,
    message: string = 'Authentication failed',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(code, message, HttpStatus.UNAUTHORIZED, details, correlationId);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends NexusError {
  constructor(
    message: string = 'Validation failed',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(
      ErrorCodes.VALIDATION_FAILED,
      message,
      HttpStatus.BAD_REQUEST,
      details,
      correlationId,
    );
    this.name = 'ValidationError';
  }
}

export class SecurityError extends NexusError {
  constructor(
    code: ErrorCodes = ErrorCodes.RATE_LIMIT_EXCEEDED,
    message: string = 'Security violation',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(code, message, HttpStatus.TOO_MANY_REQUESTS, details, correlationId);
    this.name = 'SecurityError';
  }
}

export class DatabaseError extends NexusError {
  constructor(
    code: ErrorCodes = ErrorCodes.DATABASE_CONNECTION_FAILED,
    message: string = 'Database operation failed',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(
      code,
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      details,
      correlationId,
    );
    this.name = 'DatabaseError';
  }
}

export class ExternalServiceError extends NexusError {
  constructor(
    code: ErrorCodes = ErrorCodes.EXTERNAL_SERVICE_UNAVAILABLE,
    message: string = 'External service error',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(
      code,
      message,
      HttpStatus.SERVICE_UNAVAILABLE,
      details,
      correlationId,
    );
    this.name = 'ExternalServiceError';
  }
}

export class WebSocketError extends NexusError {
  constructor(
    code: ErrorCodes = ErrorCodes.WEBSOCKET_CONNECTION_FAILED,
    message: string = 'WebSocket error',
    details?: ErrorDetails,
    correlationId?: string,
  ) {
    super(code, message, HttpStatus.BAD_REQUEST, details, correlationId);
    this.name = 'WebSocketError';
  }
}

@Injectable()
export class ErrorsService {
  /**
   * Creates a standardized error response
   */
  createErrorResponse(error: NexusError): {
    success: boolean;
    error: {
      code: string;
      message: string;
      details?: ErrorDetails;
      timestamp: Date;
      correlationId?: string;
    };
  } {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: error.timestamp,
        correlationId: error.correlationId,
      },
    };
  }

  /**
   * Converts any error to NexusError
   */
  normalizeError(error: unknown, correlationId?: string): NexusError {
    if (error instanceof NexusError) {
      return error;
    }

    if (error instanceof HttpException) {
      return new NexusError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        error.message,
        error.getStatus() as HttpStatus,
        undefined,
        correlationId,
      );
    }

    // Handle validation errors from class-validator
    if (this.isValidationError(error)) {
      const validationError = error as {
        name: string;
        property: string;
        value: unknown;
        constraints: Record<string, string>;
      };

      return new ValidationError(
        'Validation failed',
        {
          field: validationError.property,
          value: validationError.value,
          constraint: Object.values(validationError.constraints)[0],
        },
        correlationId,
      );
    }

    // Handle database errors
    if (this.isDatabaseError(error)) {
      const dbError = error as { code: string; detail?: string };
      if (dbError.code.startsWith('23')) {
        // PostgreSQL constraint violations
        return new DatabaseError(
          ErrorCodes.CONSTRAINT_VIOLATION,
          'Database constraint violation',
          { context: { dbCode: dbError.code, detail: dbError.detail } },
          correlationId,
        );
      }
    }

    // Default to internal server error
    const errorMessage = this.getErrorMessage(error);
    return new NexusError(
      ErrorCodes.INTERNAL_SERVER_ERROR,
      errorMessage,
      HttpStatus.INTERNAL_SERVER_ERROR,
      undefined,
      correlationId,
    );
  }

  /**
   * Type guard for validation errors
   */
  private isValidationError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      'constraints' in error &&
      (error as { name: string }).name === 'ValidationError'
    );
  }

  /**
   * Type guard for database errors
   */
  private isDatabaseError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as { code: unknown }).code === 'string'
    );
  }

  /**
   * Safely extracts error message
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
      const message = (error as { message: unknown }).message;
      if (typeof message === 'string') {
        return message;
      }
    }

    return 'An unexpected error occurred';
  }

  /**
   * Logs error with appropriate level
   */
  logError(error: NexusError, context?: string): void {
    const logData = {
      code: error.code,
      message: error.message,
      httpStatus: error.httpStatus,
      details: error.details,
      timestamp: error.timestamp,
      correlationId: error.correlationId,
      context,
      stack: error.stack,
    };

    // In a real implementation, you would use a proper logger like Winston
    const statusCode = Number(error.httpStatus);
    if (statusCode >= 500) {
      console.error('ERROR:', JSON.stringify(logData, null, 2));
    } else if (statusCode >= 400) {
      console.warn('WARNING:', JSON.stringify(logData, null, 2));
    } else {
      console.info('INFO:', JSON.stringify(logData, null, 2));
    }
  }

  /**
   * Checks if error is retryable
   */
  isRetryableError(error: NexusError): boolean {
    const retryableCodes: string[] = [
      ErrorCodes.DATABASE_CONNECTION_FAILED,
      ErrorCodes.EXTERNAL_SERVICE_UNAVAILABLE,
      ErrorCodes.GRPC_CONNECTION_FAILED,
      ErrorCodes.KAFKA_PUBLISH_FAILED,
      ErrorCodes.REDIS_CONNECTION_FAILED,
      ErrorCodes.TIMEOUT,
    ];

    return retryableCodes.includes(error.code);
  }

  /**
   * Creates authentication error
   */
  createAuthError(
    message: string,
    correlationId?: string,
  ): AuthenticationError {
    return new AuthenticationError(
      ErrorCodes.INVALID_CREDENTIALS,
      message,
      undefined,
      correlationId,
    );
  }

  /**
   * Creates validation error
   */
  createValidationError(
    message: string,
    field?: string,
    value?: unknown,
    correlationId?: string,
  ): ValidationError {
    return new ValidationError(message, { field, value }, correlationId);
  }

  /**
   * Creates rate limit error
   */
  createRateLimitError(correlationId?: string): SecurityError {
    return new SecurityError(
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Rate limit exceeded. Please try again later.',
      undefined,
      correlationId,
    );
  }

  /**
   * Creates database error
   */
  createDatabaseError(message: string, correlationId?: string): DatabaseError {
    return new DatabaseError(
      ErrorCodes.DATABASE_CONNECTION_FAILED,
      message,
      undefined,
      correlationId,
    );
  }

  /**
   * Creates external service error
   */
  createExternalServiceError(
    serviceName: string,
    correlationId?: string,
  ): ExternalServiceError {
    return new ExternalServiceError(
      ErrorCodes.EXTERNAL_SERVICE_UNAVAILABLE,
      `${serviceName} service is currently unavailable`,
      { context: { serviceName } },
      correlationId,
    );
  }
}
