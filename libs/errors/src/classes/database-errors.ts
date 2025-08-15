// Database related errors
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../constants/error-codes';
import { NexusError, ErrorDetails } from './base-error';

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
